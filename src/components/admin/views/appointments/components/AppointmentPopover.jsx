"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@button"
import { Badge } from "@badge"
import { Avatar, AvatarFallback } from "@avatar"
import { X, Calendar, Clock, FileText, Info } from "lucide-react"
import { appointmentService } from "../services/appointment-service"
import "../styles/AppointmentPopover.css"

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

const getStatusBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmada":
      return "confirmed"
    case "pendiente":
      return "pending"
    case "cancelada":
      return "cancelled"
    case "postergada":
      return "pending"
    case "completada":
      return "confirmed"
    case "inasistencia":
      return "inasistencia"
    default:
      return "default"
  }
}

const AppointmentPopover = ({ appointment, position, onClose, onViewDetails }) => {
  const popoverRef = useRef(null)
  const [profileData, setProfileData] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [errorProfile, setErrorProfile] = useState(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose()
      }
    }

    const fetchProfile = async () => {
      setLoadingProfile(true)
      setErrorProfile(null)
      try {
        const data = await appointmentService.getAppointmentAndUserProfile(appointment.id_cita)
        setProfileData(data)
      } catch (err) {
        console.error("Error fetching appointment and user profile:", err)
        setErrorProfile("Error al cargar el perfil del paciente.")
      } finally {
        setLoadingProfile(false)
      }
    }

    if (appointment?.id_cita) {
      fetchProfile()
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [appointment, onClose])

  if (!appointment) return null

  const { cita, usuario, perfil } = profileData || {}

  return (
    <div ref={popoverRef} className="appointment-popover" style={{ left: position.x, top: position.y }}>
      <div className="popover-header">
        <h3 className="popover-title">Detalles de la Cita</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="popover-close-button">
          <X className="icon-small" />
        </Button>
      </div>
      <div className="popover-content">
        {loadingProfile ? (
          <p className="popover-loading-message">Cargando detalles...</p>
        ) : errorProfile ? (
          <p className="popover-error-message">{errorProfile}</p>
        ) : (
          <>
            <div className="popover-section">
              <div className="popover-patient-info">
                <Avatar className="popover-avatar">
                  <AvatarFallback>{getInitials(usuario?.nombre || "")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="popover-patient-name">{usuario?.nombre || "Paciente Desconocido"}</p>
                  <p className="popover-patient-email">{usuario?.email || "N/A"}</p>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(cita?.estado)} className="popover-status-badge">
                {cita?.estado || "Desconocido"}
              </Badge>
            </div>

            <div className="popover-section">
              <div className="popover-detail-item">
                <Calendar className="popover-icon" />
                <span>{format(new Date(cita?.fecha_hora), "PPP", { locale: es })}</span>
              </div>
              <div className="popover-detail-item">
                <Clock className="popover-icon" />
                <span>
                  {format(new Date(cita?.fecha_hora), "p", { locale: es })} ({cita?.duracion || 60} min)
                </span>
              </div>
              <div className="popover-detail-item">
                <Info className="popover-icon" />
                <span>Sesión {cita?.numero_sesion || 1}</span>
              </div>
            </div>

            {cita?.notes && (
              <div className="popover-section">
                <div className="popover-detail-item-block">
                  <FileText className="popover-icon popover-icon-top" />
                  <div>
                    <p className="popover-detail-label">Notas:</p>
                    <p className="popover-detail-value">{cita.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="popover-footer">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onViewDetails(appointment)
            onClose()
          }}
        >
          Ver Detalles
        </Button>
      </div>
    </div>
  )
}

export default AppointmentPopover
