"use client"

import { useState, useEffect } from "react"
import NewAppointmentStepper from "./utils/NewAppointmentStepper"
import UserAppointmentDetails from "./utils/UserAppointmentDetails"
import CancelPostponeModal from "./components/CancelPostponeModal"
import { ToastContainer, toast } from "react-toastify"
import { Info } from "lucide-react" // Importar icono de información
import { Input } from "../public_ui/input"
import { Label } from "../public_ui/label"


import { useCitas } from "./hooks/useCitas"
import "./styles/appointments.css" // Importa el nuevo CSS de la página
import { useOutletContext } from "react-router-dom"

// Default work hours (example) - Should ideally come from a global config or API
const DEFAULT_WORK_HOURS = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // Días en inglés
  startTime: "09:00",
  endTime: "18:00",
}

export default function AgendarCitaPage() {
  // Obtener el usuario del contexto
  const { user } = useOutletContext()
  const userId = user?.id_Perfil

  const { citas, loading: citasLoading, cargarCitas, cancelarCita, postergarCita } = useCitas()
  const [activeAppointment, setActiveAppointment] = useState(null)
  const [showCancelPostponeModal, setShowCancelPostponeModal] = useState(false)
  const [appointmentToCancelOrPostpone, setAppointmentToCancelOrPostpone] = useState(null)
  const [cancelPostponeMode, setCancelPostponeMode] = useState("cancel")

  // Simulate fetching work hours (in a real app, this would be from localStorage or an API)
  const [workHours, setWorkHours] = useState(DEFAULT_WORK_HOURS)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("prophysioWorkHours")
      if (saved) {
        setWorkHours(JSON.parse(saved))
      }
    }
  }, [])

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

  const handleConfirmCancelPostpone = async (details) => {
    if (!appointmentToCancelOrPostpone) return

    try {
      if (cancelPostponeMode === "cancel") {
        await cancelarCita(appointmentToCancelOrPostpone.id_cita, details.motivo)
      } else if (cancelPostponeMode === "postpone") {
        const newCombinedDateTime = details.nuevaFecha
        const appointmentDuration = appointmentToCancelOrPostpone.duracion || 30

        const isTimeSlotAvailable = (dateTime, duration, existingAppointments, workHoursConfig) => {
          const newAppStartTime = new Date(dateTime).getTime()
          const newAppEndTime = newAppStartTime + Number.parseInt(duration) * 60 * 1000

          const selectedDay = new Date(dateTime).getDay()
          const dayName = ENGLISH_DAYS_OF_WEEK[selectedDay] // Obtiene el nombre del día en inglés

          if (!workHoursConfig.days.includes(dayName)) {
            toast.error(`La clínica no trabaja los ${dayName}s.`)
            return false
          }

          const workStartTimeParts = workHoursConfig.startTime.split(":")
          const workEndTimeParts = workHoursConfig.endTime.split(":")

          const workStartDateTime = new Date(dateTime)
          workStartDateTime.setHours(
            Number.parseInt(workStartTimeParts[0]),
            Number.parseInt(workStartTimeParts[1]),
            0,
            0,
          )

          const workEndDateTime = new Date(dateTime)
          workEndDateTime.setHours(Number.parseInt(workEndTimeParts[0]), Number.parseInt(workEndTimeParts[1]), 0, 0)

          if (newAppStartTime < workStartDateTime.getTime() || newAppEndTime > workEndDateTime.getTime()) {
            toast.error(
              `El horario seleccionado está fuera del horario laboral (${workHoursConfig.startTime} - ${workHoursConfig.endTime}).`,
            )
            return false
          }

          for (const app of existingAppointments) {
            if (appointmentToCancelOrPostpone && app.id_cita === appointmentToCancelOrPostpone.id_cita) continue

            if (app.estado === "cancelada" || app.estado === "completada") continue

            const existingAppStartTime = new Date(app.fecha_cita).getTime()
            const existingAppEndTime = existingAppStartTime + (app.duracion || 30) * 60 * 1000

            if (newAppStartTime < existingAppEndTime && newAppEndTime > existingAppStartTime) {
              toast.error("El horario seleccionado se superpone con otra cita existente.")
              return false
            }
          }
          return true
        }

        if (!isTimeSlotAvailable(newCombinedDateTime, appointmentDuration, citas, workHours)) {
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

        {citasLoading ? (
          <p>Cargando sus citas...</p>
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
                appointmentDate={appointmentToCancelOrPostpone.fecha_cita}
                mode={cancelPostponeMode}
                workHours={workHours}
              />
            )}
          </>
        ) : (
          <NewAppointmentStepper userId={userId} />
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
