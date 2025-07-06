"use client"

import { useState } from "react"
import { X, User, Calendar, Clock, FileText, CheckCircle, XCircle, CalendarPlus } from "lucide-react"
import { Button } from "@button"
import { Separator } from "@separator"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { es } from "date-fns/locale/es"

import "../styles/AppointmentDetailsPanel.css" // Asegúrate de que este archivo CSS exista

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

const AppointmentDetailsPanel = ({
  isOpen,
  onClose,
  appointment,
  onScheduleAppointment,
  onMarkAttended, // Nueva prop
  onMarkNoShow, // Nueva prop
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  if (!isOpen || !appointment) return null

  const handleMarkAttendedClick = async () => {
    if (window.confirm("¿Estás seguro de que quieres marcar esta cita como ASISTIDA?")) {
      setIsUpdatingStatus(true)
      try {
        await onMarkAttended(appointment.id_cita)
        toast.success("Cita marcada como asistida.")
        onClose() // Cerrar el panel después de la acción
      } catch (error) {
        console.error("Error al marcar como asistida:", error)
        toast.error("Error al marcar la cita como asistida.")
      } finally {
        setIsUpdatingStatus(false)
      }
    }
  }

  const handleMarkNoShowClick = async () => {
    if (window.confirm("¿Estás seguro de que quieres marcar esta cita como INASISTENCIA?")) {
      setIsUpdatingStatus(true)
      try {
        await onMarkNoShow(appointment.id_cita)
        toast.success("Cita marcada como inasistencia.")
        onClose() // Cerrar el panel después de la acción
      } catch (error) {
        console.error("Error al marcar como inasistencia:", error)
        toast.error("Error al marcar la cita como inasistencia.")
      } finally {
        setIsUpdatingStatus(false)
      }
    }
  }

  const isActionDisabled =
    appointment.estado === "cancelada" || appointment.estado === "completada" || appointment.estado === "inasistencia"

  return (
    <div className="appointment-details-panel-overlay">
      <div className="appointment-details-panel">
        <div className="appointment-details-header">
          <h2 className="appointment-details-title">Detalles de la Cita</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="appointment-details-close-btn">
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>

        <div className="appointment-details-content">
          <div className="appointment-details-section">
            <h3 className="appointment-details-section-title">Paciente</h3>
            <div className="appointment-details-item">
              <User className="appointment-details-icon" />
              <span>{appointment.usuario?.nombre || "Paciente Desconocido"}</span>
            </div>
            <div className="appointment-details-item">
              <span className="appointment-details-label">Email:</span>
              <span>{appointment.usuario?.email || "N/A"}</span>
            </div>
            <div className="appointment-details-item">
              <span className="appointment-details-label">Teléfono:</span>
              <span>{appointment.usuario?.telefono || "N/A"}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="appointment-details-section">
            <h3 className="appointment-details-section-title">Información de la Cita</h3>
            <div className="appointment-details-item">
              <Calendar className="appointment-details-icon" />
              <span>{format(new Date(appointment.fecha_hora), "dd MMMM yyyy", { locale: es })}</span>
            </div>
            <div className="appointment-details-item">
              <Clock className="appointment-details-icon" />
              <span>{format(new Date(appointment.fecha_hora), "HH:mm", { locale: es })}</span>
            </div>
            <div className="appointment-details-item">
              <span className="appointment-details-label">Duración:</span>
              <span>{appointment.duracion || 60} minutos</span>
            </div>
            <div className="appointment-details-item">
              <span className="appointment-details-label">Sesión No.:</span>
              <span>{appointment.numero_sesion}</span>
            </div>
            <div className="appointment-details-item">
              <span className="appointment-details-label">Estado:</span>
              <span className={`appointment-details-status-badge status-${appointment.estado}`}>
                {appointment.estado}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="appointment-details-section">
            <h3 className="appointment-details-section-title">Notas</h3>
            <div className="appointment-details-item">
              <FileText className="appointment-details-icon" />
              <p>{appointment.notes || "No hay notas."}</p>
            </div>
          </div>
        </div>

        <div className="appointment-details-footer">
          {/* Botones de acción */}
          {!isActionDisabled && (
            <>
              <Button
                variant="default"
                onClick={handleMarkAttendedClick}
                disabled={isUpdatingStatus}
                className="w-full"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isUpdatingStatus ? "Marcando..." : "Marcar Asistida"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleMarkNoShowClick}
                disabled={isUpdatingStatus}
                className="w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isUpdatingStatus ? "Marcando..." : "Marcar Inasistencia"}
              </Button>
            </>
          )}
          {/* Otros botones de acción que ya tenías o quieras añadir */}
          <Button
            variant="outline"
            onClick={() => onScheduleAppointment(appointment.usuario)} // Reutiliza para agendar otra cita con el mismo usuario
            className="w-full"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Agendar otra cita
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetailsPanel
