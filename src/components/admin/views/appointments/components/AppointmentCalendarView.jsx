"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { es } from "date-fns/locale"

import { Button } from "../../../../public_ui/button"
import { toast } from "react-toastify"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
import AppointmentPopover from "./AppointmentPopover"
import { userService } from "../services/userService"
import { format, parse, startOfWeek, getDay, addMinutes, setMinutes, setHours } from "date-fns"
import "../styles/reactBigCalendar.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../styles/AppointmentCalendarView.css" // Nuevo CSS para el calendario

const locales = {
  "es-ES": es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Helper to get initials
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}



const AppointmentsCalendarView = ({ citas, clinicWorkHours, openNewAppointmentModal, onViewAppointmentDetails }) => {
  console.log("Citas recibidas en AppointmentsCalendarView:", citas)

  const [popoverAppointment, setPopoverAppointment] = useState(null)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const [popoverPatientProfile, setPopoverPatientProfile] = useState(null)
  const [popoverLoading, setPopoverLoading] = useState(false)

  const calendarRef = useRef(null) // Ref para el contenedor del calendario

  // Transformar citas a eventos para react-big-calendar
  const events = useMemo(() => {
    return citas
      .filter((cita) => {
        // Filtrar citas canceladas, completadas o inasistencias
        return cita.estado !== "cancelada" && cita.estado !== "completada" && cita.estado !== "inasistencia"
      })
      .map((cita) => {
        const start = new Date(cita.fecha_hora)
        const end = addMinutes(start, cita.duracion || 60) // Usar duración de la cita o 60 min por defecto

        return {
          id: cita.id_cita,
          title: cita.usuario?.nombre || "Cita",
          start,
          end,
          allDay: false,
          resource: cita, // Guardar el objeto cita completo en resource
        }
      })
  }, [citas])

  // Determinar las horas de inicio y fin del día a partir de clinicWorkHours
  const minTime = useMemo(() => {
    const startHour =
      clinicWorkHours.length > 0
        ? Math.min(...clinicWorkHours.map((h) => Number.parseInt(h.hora_inicio.split(":")[0])))
        : 8
    return setMinutes(setHours(new Date(), startHour), 0)
  }, [clinicWorkHours])

  const maxTime = useMemo(() => {
    const endHour =
      clinicWorkHours.length > 0
        ? Math.max(...clinicWorkHours.map((h) => Number.parseInt(h.hora_fin.split(":")[0])))
        : 18
    return setMinutes(setHours(new Date(), endHour), 0)
  }, [clinicWorkHours])

  // Función para obtener estilos personalizados para los eventos
  const eventPropGetter = useCallback((event, start, end, isSelected) => {
    const cita = event.resource // Acceder al objeto cita original
    const className = `status-${cita.estado}` // Clase CSS basada en el estado

    return {
      className: className,
      style: {
        // Puedes añadir estilos inline aquí si es necesario, pero el CSS es preferible
      },
    }
  }, [])

  // Manejador de clic en un evento (cita existente)
  const handleSelectEvent = useCallback(
    async (event, e) => {
      const cita = event.resource
      setPopoverLoading(true)
      setPopoverAppointment(cita)

      // Calcular la posición del popover
      const targetRect = e.currentTarget.getBoundingClientRect()
      const calendarRect = calendarRef.current.getBoundingClientRect()

      const top = targetRect.top - calendarRect.top + targetRect.height + 10 // Debajo del evento clicado
      let left = targetRect.left - calendarRect.left

      // Ajustar si el popover se sale de la pantalla a la derecha
      const popoverWidth = 320 // Ancho aproximado del popover
      if (left + popoverWidth > calendarRect.width) {
        left = calendarRect.width - popoverWidth - 20 // Posicionarlo a la izquierda
      }
      if (left < 0) left = 10 // Asegurarse de que no se salga por la izquierda

      setPopoverPosition({ top, left })

      try {
        const profile = await userService.getPatientProfile(cita.id_usuario)
        setPopoverPatientProfile(profile)
      } catch (err) {
        console.error("Error loading patient profile for popover:", err)
        setPopoverPatientProfile(null)
        toast.error("No se pudo cargar el perfil del paciente para el popover.")
      } finally {
        setPopoverLoading(false)
      }
    },
    [userService],
  )

  // Manejador de clic en un slot de tiempo vacío
  const handleSelectSlot = useCallback(
    ({ start }) => {
      // `start` es un objeto Date del slot seleccionado
      openNewAppointmentModal({ fecha_hora: start.toISOString() })
      setPopoverAppointment(null) // Cerrar popover si hay uno abierto
    },
    [openNewAppointmentModal],
  )

  const closePopover = () => {
    setPopoverAppointment(null)
    setPopoverPatientProfile(null)
  }

  const handleSeePatientDetailsFromPopover = (patientId) => {
    closePopover()
    onViewAppointmentDetails({ id_usuario: patientId })
  }

  // Mensajes personalizados para el calendario
  const messages = useMemo(
    () => ({
      allDay: "Todo el día",
      previous: "Anterior",
      next: "Siguiente",
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
      agenda: "Agenda",
      date: "Fecha",
      time: "Hora",
      event: "Evento",
      noEventsInRange: "No hay eventos en este rango.",
      showMore: (total) => `+ Ver más (${total})`,
    }),
    [],
  )

  return (
    <div className="calendar-view-container">
      <div className="calendar-header">
        <div className="calendar-nav-group">
          {/* Los botones de navegación ahora son manejados por react-big-calendar */}
          {/* Puedes a��adir botones personalizados aquí si quieres un control fuera del toolbar */}
        </div>
      </div>
      <div className="calendar-grid" ref={calendarRef}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week" // Vista por defecto
          views={["week", "day", "month", "agenda"]} // Vistas disponibles
          step={30} // Intervalo de tiempo en minutos para los slots
          timeslots={2} // Número de slots por hora (si step es 30, 2 slots por hora)
          min={minTime} // Hora mínima de visualización
          max={maxTime} // Hora máxima de visualización
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable // Permite seleccionar slots vacíos
          eventPropGetter={eventPropGetter}
          messages={messages} // Mensajes en español
          culture="es-ES" // Cultura para la localización
          // Componentes personalizados para renderizar eventos, etc.
          components={{
            event: ({ event }) => (
              <div className="rbc-event-content">
                <span className="patient-name">{event.title}</span>
                <span className="time-range">
                  {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                </span>
                {/* Puedes añadir avatares aquí si el diseño lo requiere */}
              </div>
            ),
            toolbar: (toolbar) => {
              // Renderizar el toolbar personalizado si es necesario
              // Por ahora, react-big-calendar renderiza su propio toolbar por defecto
              // Si quieres personalizarlo, puedes pasar tu propio componente aquí
              // y usar toolbar.onNavigate, toolbar.view, toolbar.views, toolbar.label
              return (
                <div className="rbc-toolbar">
                  <span className="rbc-btn-group">
                    <Button variant="outline" size="sm" onClick={() => toolbar.onNavigate("PREV")}>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toolbar.onNavigate("TODAY")}>
                      Hoy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toolbar.onNavigate("NEXT")}>
                      Siguiente
                    </Button>
                  </span>
                  <span className="rbc-toolbar-label">{toolbar.label}</span>
                  <span className="rbc-btn-group">
                    {toolbar.views.map((view) => (
                      <Button
                        key={view}
                        variant="outline"
                        size="sm"
                        onClick={() => toolbar.onView(view)}
                        className={toolbar.view === view ? "rbc-active" : ""}
                      >
                        {messages[view]}
                      </Button>
                    ))}
                  </span>
                </div>
              )
            },
          }}
        />
        {popoverAppointment && (
          <AppointmentPopover
            appointment={popoverAppointment}
            patientProfile={popoverPatientProfile}
            onClose={closePopover}
            onSeePatientDetails={handleSeePatientDetailsFromPopover}
            style={{ position: "absolute", top: popoverPosition.top, left: popoverPosition.left, zIndex: 50 }}
            popoverLoading={popoverLoading}
          />
        )}
      </div>
    </div>
  )
}


export default AppointmentsCalendarView
