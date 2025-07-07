"use client"

import { useState } from "react"
import Swal from "sweetalert2"
import {
  X,
  User,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  CalendarPlus,
  Hash,
  Info,
  Phone,
  Mail,
  Trash2,
  MoreVertical,
} from "lucide-react"
import { Button } from "@button"
import { Separator } from "@separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dropdown-menu"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { es } from "date-fns/locale/es"
import { appointmentService } from "../services/appointment-service"

import "../styles/AppointmentDetailsPanel.css"

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
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !appointment) return null

  const handleMarkAttendedClick = async () => {
    const result = await Swal.fire({
      title: "¿Confirmar?",
      text: "¿Estás seguro de que quieres marcar esta cita como ASISTIDA?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, marcar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      setIsUpdatingStatus(true)
      try {
        await appointmentService.markAsAttended(appointment.id_cita)
        toast.success("Cita marcada como asistida.")
        onClose()
      } catch (error) {
        console.error("Error al marcar como asistida:", error)
        toast.error("Error al marcar la cita como asistida.")
      } finally {
        setIsUpdatingStatus(false)
      }
    }
  }

  const handleMarkNoShowClick = async () => {
    const result = await Swal.fire({
      title: "¿Confirmar?",
      text: "¿Estás seguro de que quieres marcar esta cita como INASISTENCIA?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, marcar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      setIsUpdatingStatus(true)
      try {
        await appointmentService.markAsNoShow(appointment.id_cita)
        toast.success("Cita marcada como inasistencia.")
        onClose()
      } catch (error) {
        console.error("Error al marcar como inasistencia:", error)
        toast.error("Error al marcar la cita como inasistencia.")
      } finally {
        setIsUpdatingStatus(false)
      }
    }
  }

  const handleDeleteClick = async () => {
    const result = await Swal.fire({
      title: "ADVERTENCIA",
      text: "¿Estás seguro de que quieres ELIMINAR esta cita? Esta acción es irreversible.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      setIsDeleting(true)
      try {
        await appointmentService.deleteAppointment(appointment.id_cita)
        toast.success("Cita eliminada correctamente.")
        onClose()
      } catch (error) {
        console.error("Error al eliminar la cita:", error)
        toast.error("Error al eliminar la cita.")
      } finally {
        setIsDeleting(false)
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
            <h3 className="appointment-details-section-title">
              <User className="appointment-details-section-icon" />
              Paciente
            </h3>
            <div className="appointment-details-section-grid">
              <div className="appointment-details-item">
                <User className="appointment-details-icon" />
                <span>{appointment.usuario?.nombre || "Paciente Desconocido"}</span>
              </div>
              <div className="appointment-details-item">
                <Mail className="appointment-details-icon" />
                <span>{appointment.usuario?.email || "N/A"}</span>
              </div>
              <div className="appointment-details-item">
                <Phone className="appointment-details-icon" />
                <span>{appointment.usuario?.telefono || "N/A"}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="appointment-details-section">
            <h3 className="appointment-details-section-title">
              <Info className="appointment-details-section-icon" />
              Información de la Cita
            </h3>
            <div className="appointment-details-section-grid">
              <div className="appointment-details-item">
                <Calendar className="appointment-details-icon" />
                <span>{format(new Date(appointment.fecha_hora), "dd MMMM yyyy", { locale: es })}</span>
              </div>
              <div className="appointment-details-item">
                <Clock className="appointment-details-icon" />
                <span>{format(new Date(appointment.fecha_hora), "HH:mm", { locale: es })}</span>
              </div>
              <div className="appointment-details-item">
                <Hash className="appointment-details-icon" />
                <span>Sesión No.: {appointment.numero_sesion}</span>
              </div>
              <div className="appointment-details-item">
                <span className="appointment-details-label">Duración:</span>
                <span>{appointment.duracion || 60} minutos</span>
              </div>
              <div className="appointment-details-item">
                <span className="appointment-details-label">Estado:</span>
                <span className={`appointment-details-status-badge status-${appointment.estado}`}>
                  {appointment.estado}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="appointment-details-section">
            <h3 className="appointment-details-section-title">
              <FileText className="appointment-details-section-icon" />
              Notas
            </h3>
            <div className="appointment-details-item notes-content">
              <p>{appointment.notes || "No hay notas."}</p>
            </div>
          </div>
        </div>

        <div className="appointment-details-footer">
          {!isActionDisabled && (
            <>
              <Button
                variant="default"
                onClick={handleMarkAttendedClick}
                disabled={isUpdatingStatus || isDeleting}
                className="appointment-details-action-button"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isUpdatingStatus ? "Marcando..." : "Marcar Asistida"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleMarkNoShowClick}
                disabled={isUpdatingStatus || isDeleting}
                className="appointment-details-action-button"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isUpdatingStatus ? "Marcando..." : "Marcar Inasistencia"}
              </Button>
            </>
          )}

          {/* Botones de Cancelar y Posponer */}
          <Button
            variant="outline"
            onClick={() => appointmentService.cancelAppointment(appointment.id_cita, "cancel")}
            disabled={isUpdatingStatus || isDeleting || isActionDisabled}
            className="appointment-details-action-button"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar Cita
          </Button>
          <Button
            variant="outline"
            onClick={() => appointmentService.postponeAppointment(appointment.id_cita, "postpone")}
            disabled={isUpdatingStatus || isDeleting || isActionDisabled}
            className="appointment-details-action-button"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Posponer Cita
          </Button>

          {/* Botón para agendar otra cita (siempre visible) */}
          <Button
            variant="outline"
            onClick={() => onScheduleAppointment(appointment.usuario)}
            disabled={isDeleting || isUpdatingStatus}
            className="appointment-details-action-button"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Agendar otra cita
          </Button>

          {/* Menú desplegable para acciones "secretas" como Eliminar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="appointment-details-more-actions-button"
                disabled={isDeleting || isUpdatingStatus}
              >
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Más acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDeleteClick}
                disabled={isDeleting || isUpdatingStatus}
                className="dropdown-menu-item-destructive" // Clase para estilo rojo
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Cita
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetailsPanel
