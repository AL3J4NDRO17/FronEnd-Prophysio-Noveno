"use client"

import { useState, useMemo, useCallback } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMinutes,
  setHours,
  setMinutes,
  isBefore,
  isEqual,
  isAfter,
} from "date-fns"
import { es } from "date-fns/locale"
import AppointmentPopover from "./AppointmentPopover"
import { toast } from "react-toastify"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../styles/AppointmentCalendarView.css"
import "../styles/reactBigCalendar.css"
import "../styles/AppointmentPopover.css"

const locales = {
  es: es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const AppointmentCalendarView = ({ events, onSelectEvent, onSelectSlot, clinicWorkHours }) => {
  const [showPopover, setShowPopover] = useState(false)
  const [popoverData, setPopoverData] = useState(null)
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 })

  const mappedEvents = useMemo(() => {
    if (!Array.isArray(events)) {
      console.warn("La prop 'events' no es un array:", events)
      return []
    }
    return events.map((cita) => {
      const start = new Date(cita.fecha_hora)
      const end = addMinutes(start, cita.duracion || 60)
      return {
        id: cita.id_cita,
        title: cita.usuario?.nombre || "Cita",
        start,
        end,
        allDay: false,
        resource: cita,
      }
    })
  }, [events])

  const handleSelectEvent = useCallback((event, e) => {
    setPopoverData(event.resource)
    setPopoverPosition({ x: e.clientX, y: e.clientY })
    setShowPopover(true)
  }, [])

  const handleSelectSlot = useCallback(
    ({ start, end, action }) => {
      if (action === "click" || action === "doubleClick") {
        const selectedDate = start
        const dayOfWeekIndex = getDay(selectedDate) // Usar getDay de date-fns
        const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const spanishDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
        const selectedDayNameEnglish = englishDays[dayOfWeekIndex]

        const daySchedules = Array.isArray(clinicWorkHours)
          ? clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameEnglish)
          : []

        if (daySchedules.length === 0) {
          toast.error(`La clínica no trabaja los ${spanishDays[dayOfWeekIndex]}.`)
          return
        }

        let isWithinWorkHours = false
        let sessionDuration = 0
        let isDuringLunchBreak = false // Nuevo flag para la hora de comida

        for (const schedule of daySchedules) {
          if (!schedule.hora_inicio || !schedule.hora_fin) {
            console.error("Horario incompleto detectado:", schedule)
            toast.error("Error: Horario de clínica incompleto. Contacte al administrador.")
            return
          }

          const workStartTimeParts = schedule.hora_inicio.split(":").map(Number)
          const workEndTimeParts = schedule.hora_fin.split(":").map(Number)

          const workStartDateTime = setMinutes(setHours(selectedDate, workStartTimeParts[0]), workStartTimeParts[1])
          const workEndDateTime = setMinutes(setHours(selectedDate, workEndTimeParts[0]), workEndTimeParts[1])

          // Verificar si la cita cae dentro del horario laboral principal
          if (
            (isEqual(selectedDate, workStartDateTime) || isAfter(selectedDate, workStartDateTime)) &&
            isBefore(selectedDate, workEndDateTime)
          ) {
            sessionDuration = schedule.duracion_sesion
            const slotEnd = addMinutes(selectedDate, sessionDuration)

            // Verificar si la cita se superpone con la hora de comida
            if (schedule.hora_comida_inicio && schedule.hora_comida_fin) {
              const [lunchStartH, lunchStartM] = schedule.hora_comida_inicio.split(":").map(Number)
              const [lunchEndH, lunchEndM] = schedule.hora_comida_fin.split(":").map(Number)
              const lunchStartDateTime = setMinutes(setHours(selectedDate, lunchStartH), lunchStartM)
              const lunchEndDateTime = setMinutes(setHours(selectedDate, lunchEndH), lunchEndM)

              if (
                (isBefore(selectedDate, lunchEndDateTime) && isAfter(slotEnd, lunchStartDateTime)) ||
                isEqual(selectedDate, lunchStartDateTime) ||
                isEqual(slotEnd, lunchEndDateTime)
              ) {
                isDuringLunchBreak = true
                break // Si se superpone con la comida, no es válido
              }
            }

            if (isBefore(slotEnd, workEndDateTime) || isEqual(slotEnd, workEndDateTime)) {
              isWithinWorkHours = true
              break
            }
          }
        }

        if (isDuringLunchBreak) {
          toast.error("El horario seleccionado cae dentro de la hora de comida de la clínica.")
          return
        }

        if (!isWithinWorkHours) {
          toast.error(
            "El horario seleccionado está fuera del horario laboral de la clínica para este día o la duración excede el bloque.",
          )
          return
        }

        const newAppStartTime = selectedDate.getTime()
        const newAppEndTime = newAppStartTime + sessionDuration * 60 * 1000

        const isOverlapping = events.some((existingApp) => {
          if (
            existingApp.estado === "cancelada" ||
            existingApp.estado === "completada" ||
            existingApp.estado === "inasistencia"
          )
            return false

          const existingAppStartTime = new Date(existingApp.fecha_hora).getTime()
          const existingAppDuration = existingApp.duracion || 60
          const existingAppEndTime = existingAppStartTime + existingAppDuration * 60 * 1000

          return newAppStartTime < existingAppEndTime && newAppEndTime > existingAppStartTime
        })

        if (isOverlapping) {
          toast.error("El horario seleccionado se superpone con otra cita existente.")
          return
        }

        onSelectSlot(null) // Esto debería abrir el modal de nueva cita
      }
    },
    [events, onSelectSlot, clinicWorkHours],
  )

  const eventPropGetter = useCallback((event, start, end, isSelected) => {
    let className = ""
    switch (event.resource.estado) {
      case "confirmada":
        className = "rbc-event-confirmed"
        break
      case "pendiente":
        className = "rbc-event-pending"
        break
      case "cancelada":
        className = "rbc-event-cancelled"
        break
      case "postergada":
        className = "rbc-event-postponed"
        break
      case "completada":
        className = "rbc-event-completed"
        break
      case "inasistencia":
        className = "rbc-event-missed"
        break
      default:
        className = "rbc-event-default"
    }
    return { className }
  }, [])

  return (
    <div className="calendar-view-container">
      <Calendar
        localizer={localizer}
        events={mappedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay citas en este rango.",
        }}
        culture="es"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventPropGetter}
        views={["month", "week", "day", "agenda"]}
        defaultView="week"
        min={setMinutes(setHours(new Date(), 7), 0)}
        max={setMinutes(setHours(new Date(), 22), 0)}
      />
      {showPopover && popoverData && (
        <AppointmentPopover
          appointment={popoverData}
          position={popoverPosition}
          onClose={() => setShowPopover(false)}
          onViewDetails={onSelectEvent}
        />
      )}
    </div>
  )
}

export default AppointmentCalendarView
