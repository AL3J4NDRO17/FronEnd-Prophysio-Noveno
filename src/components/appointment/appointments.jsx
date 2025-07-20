"use client"

import "./styles/CancelPostponeModal.css"
import "./styles/NewAppointmentStepper.css" // Importa el CSS del stepper
import "./styles/appointments.css" // Importa el CSS de citas
import "./styles/userAppointmentsDetails.css" // Importa el CSS de detalles de citas
import "./styles/SummaryStep.css"
import "./styles/VeriftAppointment.css"
import "./styles/Confirmation.css"
import "./styles/PaymentForm.css"
import { useOutletContext } from "react-router-dom" // Importar desde next/navigation para compatibilidad con Next.js App Router
import { useState, useEffect } from "react"
import NewAppointmentStepper from "./utils/NewAppointmentStepper"
import UserAppointmentDetails from "./utils/UserAppointmentDetails"
import CancelPostponeModal from "./components/CancelPostponeModal"
import { toast } from "react-toastify"
import { Info } from "lucide-react" // Importar icono de información
import { parseISO, getDay, setHours, setMinutes, addMinutes, isBefore, isEqual, isAfter } from "date-fns"

import { useCitas } from "./hooks/useCitas"
import { useClinicHours } from "./hooks/useClinicHours" // Importar el hook de horarios de clínica

// Default work hours (example) - Should ideally come from a global config or API
// ESTO YA NO ES NECESARIO, SE OBTIENE DE useClinicHours
// const DEFAULT_WORK_HOURS = {
//   days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // Días en inglés
//   startTime: "09:00",
//   endTime: "18:00",
// }

export default function AgendarCitaPage() {
  // Simulación de useOutletContext para obtener el usuario
  const { user } = useOutletContext()
  const userId = user?.id_Perfil

  const { citas, loading: citasLoading, cargarCitas, cancelarCita, postergarCita } = useCitas()
  const { clinicHours, loading: clinicHoursLoading } = useClinicHours() // Obtener horarios de clínica
  const [activeAppointment, setActiveAppointment] = useState(null)
  const [showCancelPostponeModal, setShowCancelPostponeModal] = useState(false)
  const [appointmentToCancelOrPostpone, setAppointmentToCancelOrPostpone] = useState(null)
  const [cancelPostponeMode, setCancelPostponeMode] = useState("cancel")

  // Simulate fetching work hours (in a real app, this would be from localStorage or an API)
  // ESTO YA NO ES NECESARIO, SE OBTIENE DE useClinicHours
  // const [workHours, setWorkHours] = useState(DEFAULT_WORK_HOURS)
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const saved = localStorage.getItem("prophysioWorkHours")
  //     if (saved) {
  //       setWorkHours(JSON.parse(saved))
  //     }
  //   }
  // }, [])

  useEffect(() => {
    if (!citasLoading && citas.length > 0 && userId) {
      // Filtrar citas del usuario actual y buscar una activa
      const userAppointments = citas.filter((cita) => cita.id_usuario === userId)
      const foundActiveAppointment = userAppointments.find(
        (cita) => cita.estado === "pendiente" || cita.estado === "confirmada" || cita.estado === "postergada",
      )
      setActiveAppointment(foundActiveAppointment)
    } else if (!userId) {
      setActiveAppointment(null) // Si no hay userId, no hay cita activa
    }
  }, [citas, citasLoading, userId]) // Dependencia de userId para re-evaluar

  const openCancelPostponeModal = (appointment, mode) => {
    setAppointmentToCancelOrPostpone(appointment)
    setCancelPostponeMode(mode)
    setShowCancelPostponeModal(true)
  }

  const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const SPANISH_DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

  const handleConfirmCancelPostpone = async (details) => {
    if (!appointmentToCancelOrPostpone) return

    try {
      if (cancelPostponeMode === "cancel") {
        await cancelarCita(appointmentToCancelOrPostpone.id_cita, details.motivo)
      } else if (cancelPostponeMode === "postpone") {
        const newCombinedDateTime = details.nuevaFecha
        const appointmentDuration = appointmentToCancelOrPostpone.duracion || 60 // Usar 60 como default

        const isTimeSlotAvailable = (
          dateTime,
          duration,
          existingAppointments,
          clinicWorkHoursData,
          currentAppointmentId,
        ) => {
          const newAppStartTime = parseISO(dateTime)
          const newAppEndTime = addMinutes(newAppStartTime, duration)

          const selectedDayIndex = getDay(newAppStartTime)
          const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[selectedDayIndex]

          const daySchedules = clinicWorkHoursData.filter((schedule) => schedule.dia === selectedDayNameEnglish)

          if (daySchedules.length === 0) {
            toast.error(`La clínica no trabaja los ${SPANISH_DAYS_OF_WEEK[selectedDayIndex]}.`)
            return false
          }

          let isWithinWorkHours = false
          let isDuringLunchBreak = false

          for (const schedule of daySchedules) {
            const [startH, startM] = schedule.hora_inicio.split(":").map(Number)
            const [endH, endM] = schedule.hora_fin.split(":").map(Number)
            const workStartDateTime = setMinutes(setHours(newAppStartTime, startH), startM)
            const workEndDateTime = setMinutes(setHours(newAppStartTime, endH), endM)

            if (
              (isEqual(newAppStartTime, workStartDateTime) || isAfter(newAppStartTime, workStartDateTime)) &&
              isBefore(newAppStartTime, workEndDateTime)
            ) {
              if (isBefore(newAppEndTime, workEndDateTime) || isEqual(newAppEndTime, workEndDateTime)) {
                isWithinWorkHours = true

                // Verificar hora de comida
                if (schedule.hora_comida_inicio && schedule.hora_comida_fin) {
                  const [lunchStartH, lunchStartM] = schedule.hora_comida_inicio.split(":").map(Number)
                  const [lunchEndH, lunchEndM] = schedule.hora_comida_fin.split(":").map(Number)
                  const lunchStartDateTime = setMinutes(setHours(newAppStartTime, lunchStartH), lunchStartM)
                  const lunchEndDateTime = setMinutes(setHours(newAppStartTime, lunchEndH), lunchEndM)

                  if (
                    (isBefore(newAppStartTime, lunchEndDateTime) && isAfter(newAppEndTime, lunchStartDateTime)) ||
                    isEqual(newAppStartTime, lunchStartDateTime) ||
                    isEqual(newAppEndTime, lunchEndDateTime)
                  ) {
                    isDuringLunchBreak = true
                    break // Si se superpone con la comida, no es válido
                  }
                }
                break
              }
            }
          }

          if (isDuringLunchBreak) {
            toast.error("El horario seleccionado cae dentro de la hora de comida de la clínica.")
            return false
          }

          if (!isWithinWorkHours) {
            toast.error(
              "El horario seleccionado está fuera del horario laboral de la clínica para este día o la duración excede el bloque.",
            )
            return false
          }

          for (const app of existingAppointments) {
            if (app.id_cita === currentAppointmentId) continue // Ignorar la cita que se está modificando
            if (app.estado === "cancelada" || app.estado === "completada" || app.estado === "inasistencia") continue

            const existingAppStartTime = parseISO(app.fecha_hora)
            const existingAppDuration = app.duracion || 60
            const existingAppEndTime = addMinutes(existingAppStartTime, existingAppDuration)

            if (isBefore(newAppStartTime, existingAppEndTime) && isAfter(newAppEndTime, existingAppStartTime)) {
              toast.error("El horario seleccionado se superpone con otra cita existente.")
              return false
            }
          }
          return true
        }

        if (
          !isTimeSlotAvailable(
            newCombinedDateTime,
            appointmentDuration,
            citas,
            clinicHours,
            appointmentToCancelOrPostpone.id_cita,
          )
        ) {
          return
        }

        await postergarCita(appointmentToCancelOrPostpone.id_cita, details.motivo, details.nuevaFecha)
      }
      setShowCancelPostponeModal(false)
      setAppointmentToCancelOrPostpone(null)
      cargarCitas()
    } catch (err) {
      // El toast de error ya es manejado por useCitas
    }
  }

  // Si no hay usuario autenticado, mostrar mensaje
  if (!user) {
    return (
      <div className="agendar-cita-layout">
        <div className="agendar-cita-form-container">
          <div className="agendar-cita-header">
            <h1 className="agendar-cita-title">Acceso Requerido</h1>
            <p className="agendar-cita-subtitle">Debe iniciar sesión para agendar una cita.</p>
          </div>
        </div>
        <div className="agendar-cita-visual-panel">
          <div className="agendar-cita-logo">PROphysio</div>
          <h1 className="agendar-cita-welcome-text">Bienvenido a PROphysio</h1>
          <div className="agendar-cita-hose-svg"></div>
          <div className="agendar-cita-city-svg"></div>
          <div className="agendar-cita-main-illustration-svg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="agendar-cita-layout">
      {/* Panel Izquierdo (Formulario con Stepper Vertical) */}
      <div className="agendar-cita-form-container">
        {/* Header "Let's Start!" y mensaje de info */}
        <div className="agendar-cita-header">
          <h1 className="agendar-cita-title">¡Empecemos!</h1>
          <p className="agendar-cita-subtitle">Agenda tu cita con un sencillo proceso de 5 pasos.</p>
          <div className="agendar-cita-info-box">
            <Info className="agendar-cita-info-icon" />
            Puedes editar cualquier campo antes de confirmar.
          </div>
        </div>

        {/* Mostrar información del usuario autenticado */}
        <div className="agendar-cita-user-info">
          <p className="agendar-cita-user-welcome">
            Bienvenido, <strong>{user.nombre || "Usuario"}</strong>
          </p>
        </div>

        {citasLoading || clinicHoursLoading ? ( // Añadir clinicHoursLoading
          <p>Cargando sus citas y horarios...</p>
        ) : activeAppointment ? (
          <>
            <UserAppointmentDetails
              appointment={activeAppointment}
              onCancel={() => openCancelPostponeModal(activeAppointment, "cancel")}
              onPostpone={() => openCancelPostponeModal(activeAppointment, "postpone")}
            />
            {showCancelPostponeModal && appointmentToCancelOrPostpone && (
              <CancelPostponeModal
                isOpen={showCancelPostponeModal}
                onClose={() => setShowCancelPostponeModal(false)}
                onConfirm={handleConfirmCancelPostpone}
                appointmentFechaHora={appointmentToCancelOrPostpone.fecha_hora} // Usar fecha_hora
                mode={cancelPostponeMode}
                clinicWorkHours={clinicHours} // Pasar clinicHours
                appointmentDuration={appointmentToCancelOrPostpone.duracion || 60} // Pasar duración
              />
            )}
          </>
        ) : (
          <NewAppointmentStepper userId={userId} clinicWorkHours={clinicHours} existingAppointments={citas} />
        )}
      </div>

      {/* Panel Derecho (Visual con SVGs) */}
      <div className="agendar-cita-visual-panel">
        <div className="agendar-cita-logo">PROphysio</div>
        <h1 className="agendar-cita-welcome-text">Bienvenido a PROphysio</h1>
        {/* SVGs de fondo y decoración */}
        <div className="agendar-cita-hose-svg"></div>
        <div className="agendar-cita-city-svg"></div>
        <div className="agendar-cita-main-illustration-svg"></div>
      </div>
    </div>
  )
}
