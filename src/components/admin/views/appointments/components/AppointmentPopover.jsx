"use client"

import { Popover, PopoverContent, PopoverTrigger } from "../../../../public_ui/popover"
import { Badge } from "../../../../public_ui/badge"
import { Button } from "../../../../public_ui/button"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
 // Importar el CSS para el popover
import "../styles/AppointmentPopover.css"
import { CalendarIcon, ClockIcon, FileTextIcon, PhoneIcon, MailIcon, UserIcon, XIcon } from  "lucide-react"

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
const AppointmentPopover = ({ appointment, patientProfile, onClose, onSeePatientDetails, style, popoverLoading }) => {
  if (!appointment) return null

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmada":
        return "success"
      case "pendiente":
        return "warning"
      case "cancelada":
        return "destructive"
      case "completada":
        return "default"
      case "postergada":
        return "info"
      case "inasistencia":
        return "secondary"
      default:
        return "default"
    }
  }

  const appointmentDate = new Date(appointment.fecha_hora)
  const formattedTime = appointmentDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  const formattedDate = appointmentDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="appointment-popover" style={style}>
      <div className="popover-header">
        <h3 className="popover-title">Detalles de la Cita</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="popover-close-btn">
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </Button>
      </div>
      <div className="popover-content">
        <div className="popover-section patient-info">
          <Avatar className="popover-avatar">
            <AvatarFallback>{getInitials(appointment.usuario?.nombre)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="popover-patient-name">{appointment.usuario?.nombre}</p>
            <p className="popover-patient-email">{appointment.usuario?.email}</p>
          </div>
        </div>

        <div className="popover-section appointment-info">
          <div className="info-item">
            <CalendarIcon className="info-icon" />
            <span>{formattedDate}</span>
          </div>
          <div className="info-item">
            <ClockIcon className="info-icon" />
            <span>
              {formattedTime} ({appointment.duracion || 60} min)
            </span>
          </div>
          <div className="info-item">
            <Badge variant={getStatusVariant(appointment.estado)}>{appointment.estado}</Badge>
          </div>
          {appointment.notes && (
            <div className="info-item">
              <span className="font-medium">Notas:</span> {appointment.notes}
            </div>
          )}
          {appointment.numero_sesion && (
            <div className="info-item">
              <span className="font-medium">Sesión #:</span> {appointment.numero_sesion}
            </div>
          )}
        </div>

        {patientProfile && (
          <div className="popover-section patient-details">
            <h4 className="section-title">Perfil del Paciente</h4>
            <div className="grid gap-2">
              <div className="info-item">
                <UserIcon className="info-icon" />
                <span>{patientProfile.genero || "N/A"}</span>
              </div>
              <div className="info-item">
                <CalendarIcon className="info-icon" />
                <span>
                  {patientProfile.fecha_nacimiento
                    ? new Date(patientProfile.fecha_nacimiento).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="info-item">
                <PhoneIcon className="info-icon" />
                <span>{patientProfile.telefono || "N/A"}</span>
              </div>
              <div className="info-item">
                <MailIcon className="info-icon" />
                <span>{patientProfile.direccion || "N/A"}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 bg-transparent"
              onClick={() => onSeePatientDetails(appointment.id_usuario)}
            >
              Ver Perfil Completo
            </Button>
          </div>
        )}
        {patientProfile === null && !popoverLoading && (
          <div className="popover-section patient-details">
            <p className="text-sm text-gray-500">No se pudo cargar el perfil del paciente.</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 bg-transparent"
              onClick={() => onSeePatientDetails(appointment.id_usuario)}
            >
              Intentar de nuevo
            </Button>
          </div>
        )}
        {popoverLoading && (
          <div className="popover-section patient-details">
            <p className="text-sm text-gray-500">Cargando perfil...</p>
          </div>
        )}
      </div>
    </div>
  )
}


export default AppointmentPopover
