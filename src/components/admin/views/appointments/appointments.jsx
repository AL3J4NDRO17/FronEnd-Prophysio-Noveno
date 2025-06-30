"use client"


import { useState, useEffect, useMemo } from "react"
import { Plus, SettingsIcon } from "lucide-react"
import "./appointments.css"
import { useCitas } from "./hooks/useCitas.js"

import CalendarSidebar from "./components/CalendarSidebar"
import AppointmentsCalendarView from "./components/AppointmentCalendarView"
// import AppointmentItemRow from "./components/AppointmentItemRow"
import CancelPostponeModal from "./components/CancelPostponeModal"
import WorkHoursModal from "./components/WorksHourModal"
import NewAppointmentModal from "./components/NewAppointmentModel"
import AppointmentDetailsPanel from "./components/AppointmentDetailsPanel" // Nuevo componente
import { Button } from "../../../public_ui/button"
// import { Input } from "../../../public_ui/input"
// import { Label } from "../../../public_ui/label"
// import { Select, SelectItem } from "../../../public_ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "../../../public_ui/card"
import { toast } from "react-toastify"
import { userService } from "./services/userService" // Nuevo servicio de usuarios
import { horarioService } from "./services/horarioService" // Ruta actualizada
// import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs/tabs.jsx" // Importar Tabs desde shadcn
// // Helper to get initials
// // Helper to get initials
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Default work hours (example) - This will be replaced by fetched data
const DEFAULT_WORK_HOURS = [] // Initialize as empty array

function AppointmentsPage() {
  const {
    citas,
    loading,
    error,
    crearCita,
    actualizarCita,
    eliminarCita,
    postergarCita,
    cancelarCita,
    marcarAsistida,
    marcarInasistencia,
  } = useCitas()

  // AÑADE ESTE CONSOLE.LOG AQUÍ
  console.log("Citas recibidas en AppointmentsPage (desde useCitas):", citas)

  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [appointmentToCancelOrPostpone, setAppointmentToCancelOrPostpone] = useState(null)
  const [cancelPostponeMode, setCancelPostponeMode] = useState("cancel")
  const [showCancelPostponeModal, setShowCancelPostponeModal] = useState(false)
  const [showWorkHoursModal, setShowWorkHoursModal] = useState(false)
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null)
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)

  // `workHours` ahora almacenará el array completo de horarios configurados por el usuario
  const [workHours, setWorkHours] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("prophysioWorkHours")
      return saved ? JSON.parse(saved) : DEFAULT_WORK_HOURS
    }
    return DEFAULT_WORK_HOURS
  })

  // `clinicWorkHours` se usará para los horarios obtenidos del backend
  const [clinicWorkHours, setClinicWorkHours] = useState([])
  // Eliminar appointmentDuration, ya no es necesario como estado global
  //- const [appointmentDuration, setAppointmentDuration] = useState(null)
  const [configLoading, setConfigLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("prophysioWorkHours", JSON.stringify(workHours))
    }
  }, [workHours])

  useEffect(() => {
    const loadClinicData = async () => {
      try {
        setConfigLoading(true)
        const hours = await horarioService.getHorariosClinica()
        // Mapear los días a nombres en inglés para consistencia con el modal de cita
        const mappedHours = hours.map((h) => ({
          ...h,
          dia:
            h.dia === "Lunes"
              ? "Monday"
              : h.dia === "Martes"
                ? "Tuesday"
                : h.dia === "Miércoles"
                  ? "Wednesday"
                  : h.dia === "Jueves"
                    ? "Thursday"
                    : h.dia === "Viernes"
                      ? "Friday"
                      : h.dia === "Sábado"
                        ? "Saturday"
                        : h.dia === "Domingo"
                          ? "Sunday"
                          : h.dia, // Fallback
        }))
        setClinicWorkHours(mappedHours)

        // La duración de la sesión ya no se establece aquí globalmente,
        // sino que se obtiene por cada bloque de horario en NewAppointmentModal.
        //- if (hours.length > 0 && hours[0].duracion_sesion) {
        //-   setAppointmentDuration(hours[0].duracion_sesion)
        //- } else {
        //-   setAppointmentDuration(60)
        //-   console.warn("No se encontró 'duracion_sesion' en los horarios, usando 60 minutos por defecto.")
        //- }
      } catch (err) {
        console.error("Error al cargar horarios de la clínica:", err)
        toast.error("No se pudieron cargar los horarios de la clínica.")
        //- setAppointmentDuration(60) // Fallback si no se cargan horarios
      } finally {
        setConfigLoading(false)
      }
    }
    loadClinicData()
  }, [])

  const openNewAppointmentModal = (appointment = null) => {
    setEditingAppointment(appointment)
    setShowNewAppointmentModal(true)
  }

  const handleSaveAppointment = async (appointmentPayload, isEditing) => {
    try {
      if (isEditing) {
        await actualizarCita(editingAppointment.id_cita, appointmentPayload)
      } else {
        await crearCita(appointmentPayload)
      }
      setShowNewAppointmentModal(false)
      setEditingAppointment(null)
    } catch (err) {
      // Error toast is handled by useCitas
    }
  }

  const openCancelPostponeModal = (appointment, mode) => {
    setAppointmentToCancelOrPostpone(appointment)
    setCancelPostponeMode(mode)
    setShowCancelPostponeModal(true)
  }

  const handleConfirmCancelPostpone = async (details) => {
    if (!appointmentToCancelOrPostpone) return

    try {
      if (cancelPostponeMode === "cancel") {
        await cancelarCita(appointmentToCancelOrPostpone.id_cita, details.motivo)
      } else if (cancelPostponeMode === "postpone") {
        await postergarCita(appointmentToCancelOrPostpone.id_cita, details.motivo, details.nuevaFecha)
      }
      setShowCancelPostponeModal(false)
      setAppointmentToCancelOrPostpone(null)
    } catch (err) {
      // Error toast handled by useCitas
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointmentDetails(appointment)
    setShowDetailsPanel(true)
  }

  const filteredCitas = useMemo(() => citas, [citas])

  return (
    <div className="appointmentsAdmin-container">
      {/* Header */}
      <header className="appointmentsAdmin-header">
        <div className="appointmentsAdmin-header-title">
          <h1>Gestión de Citas</h1>
        </div>
        <div className="appointmentsAdmin-header-actions">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowWorkHoursModal(true)}
            className="appointmentsAdmin-btn-icon"
            title="Ajustar Horario Laboral"
          >
            <SettingsIcon className="appointmentsAdmin-icon-sm" />
          </Button>
          <Button variant="primary" onClick={() => openNewAppointmentModal()}>
            <Plus className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
            Nueva cita
          </Button>
        </div>
      </header>

      {/* Content Wrapper: Sidebar + Main Content */}
      <div className="appointmentsAdmin-content-wrapper">
        {/* Calendar Sidebar */}
        <CalendarSidebar
          citas={citas} // Pass all citas for the queue
        />

        {/* Main content area */}
        <main className="appointmentsAdmin-main-content">
          <AppointmentsCalendarView
            citas={filteredCitas} // Pass filtered citas to the calendar view
            clinicWorkHours={clinicWorkHours}
            // Eliminar appointmentDuration
            //- appointmentDuration={appointmentDuration}
            openNewAppointmentModal={openNewAppointmentModal}
            onViewAppointmentDetails={handleViewDetails}
          />
        </main>
      </div>

      {/* New/Edit Appointment Modal (reused component) */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSave={handleSaveAppointment}
        editingAppointment={editingAppointment}
        initialSelectedUser={null}
        clinicWorkHours={clinicWorkHours} // Pasar el array completo de horarios
        allAppointments={citas} // All appointments for time slot validation
        userService={userService}
        isSaving={loading}
        // Eliminar appointmentDuration
        //- appointmentDuration={appointmentDuration}
      />

      {/* Cancel/Postpone Modal */}
      {showCancelPostponeModal && appointmentToCancelOrPostpone && (
        <CancelPostponeModal
          isOpen={showCancelPostponeModal}
          onClose={() => setShowCancelPostponeModal(false)}
          onConfirm={handleConfirmCancelPostpone}
          appointmentFechaHora={appointmentToCancelOrPostpone.fecha_hora}
          mode={cancelPostponeMode}
          workHours={workHours} // Usar los workHours configurados por el usuario
        />
      )}

      {/* Work Hours Modal */}
      {showWorkHoursModal && (
        <WorkHoursModal
          isOpen={showWorkHoursModal}
          onClose={() => setShowWorkHoursModal(false)}
          currentWorkHours={clinicWorkHours} // Pasar los horarios del backend para editar
          onSave={(newHours) => {
            // Aquí deberías llamar a un servicio para guardar los nuevos horarios en tu backend
            // Por ahora, solo actualizamos el estado local y el localStorage
            setWorkHours(newHours) // Esto es para persistencia local, no para el backend
            setClinicWorkHours(newHours) // Actualizar los horarios usados por el calendario/modal de cita
            setShowWorkHoursModal(false)
            toast.success("Horario laboral actualizado.")
          }}
        />
      )}

      {/* Appointment Details Panel */}
      {showDetailsPanel && selectedAppointmentDetails && (
        <AppointmentDetailsPanel
          isOpen={showDetailsPanel}
          onClose={() => setShowDetailsPanel(false)}
          patientId={selectedAppointmentDetails.id_usuario}
          onScheduleAppointment={(patient) => {
            setShowDetailsPanel(false)
            openNewAppointmentModal({ initialSelectedUser: patient })
          }}
        />
      )}
    </div>
  )
}

export default AppointmentsPage