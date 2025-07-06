"use client"
import { X, Mail, Phone, FileText, MessageSquare, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../public_ui/card"
import { Button } from "../../../../public_ui/button"
import { Badge } from "../../../../public_ui/badge"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../public_ui/dropdown-menu"
import { useEffect, useRef, useState } from "react"
import "../styles/PatientDetailsPanel.css"
import { useCitas } from "../hooks/useCitas"
import { userService } from "../services/userService"

const PatientDetailsPanel = ({ isOpen, onClose, patientId, onScheduleAppointment }) => {
  const panelRef = useRef(null)
  const [isPanelVisible, setIsPanelVisible] = useState(false)
  const [patientProfile, setPatientProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)

  const { citas } = useCitas()

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen && patientId) {
      const timer = setTimeout(() => {
        setIsPanelVisible(true)
      }, 10)
      document.addEventListener("keydown", handleEscape)

      const fetchPatientProfile = async () => {
        setProfileLoading(true)
        setProfileError(null)
        try {
          const data = await userService.getPatientProfile(patientId)
          setPatientProfile(data)
        } catch (err) {
          console.error("Error al cargar el perfil del paciente:", err)
          setProfileError("No se pudo cargar el perfil del paciente.")
        } finally {
          setProfileLoading(false)
        }
      }
      fetchPatientProfile()

      return () => {
        clearTimeout(timer)
        document.removeEventListener("keydown", handleEscape)
        setPatientProfile(null)
        setProfileLoading(true)
        setProfileError(null)
      }
    } else {
      setIsPanelVisible(false)
      document.removeEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose, patientId])

  if (!isOpen || !patientId) return null

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada"
    try {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString("es-ES", options)
    } catch (e) {
      return dateString
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return "No especificada"
    try {
      return new Date(dateString).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })
    } catch (e) {
      return dateString
    }
  }

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

  const patientHistory = citas
    .filter((cita) => cita.id_usuario === patientId && cita.estado !== "cancelada")
    .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime())

  return (
    <div className="patient-details-panel-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className={`patient-details-panel ${isPanelVisible ? "is-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="patient-details-card">
          <CardHeader className="patient-details-card-header">
            <CardTitle className="patient-details-card-title">Detalles del Paciente</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="icon-medium" />
            </Button>
          </CardHeader>
          <CardContent className="patient-details-card-content">
            {profileLoading ? (
              <p>Cargando detalles del paciente...</p>
            ) : profileError ? (
              <p className="text-red-500">{profileError}</p>
            ) : (
              <div className="patient-details-grid">
                <div className="patient-details-section-spacing">
                  <div className="patient-info-header patient-details-section-spacing">
                    <Avatar className="patient-avatar">
                      <AvatarFallback className="patient-avatar-fallback">
                        {getInitials(patientProfile?.nombre || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="patient-name">{patientProfile?.nombre || "N/A"}</p>
                      <p className="patient-meta">
                        {patientProfile?.perfil?.sexo === "Masculino"
                          ? "Masculino"
                          : patientProfile?.perfil?.sexo === "Femenino"
                            ? "Femenino"
                            : "N/A"}
                        , {patientProfile?.perfil?.edad || "N/A"} años
                      </p>
                    </div>
                  </div>

                  <div className="patient-actions patient-details-section-spacing">
                    <Button variant="primary" className="patient-action-button">
                      <Phone className="patient-action-icon" />
                      Llamar
                    </Button>
                    <Button variant="outline" className="patient-action-button bg-transparent">
                      <MessageSquare className="patient-action-icon" />
                      Mensaje
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="icon-small" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onScheduleAppointment(patientProfile)}>
                          Agendar Nueva Cita
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h4 className="patient-subsection-title">Contacto</h4>
                  <div className="patient-contact-grid patient-details-section-spacing">
                    <div className="patient-detail-item">
                      <Mail className="patient-detail-icon" />
                      <div>
                        <p className="patient-detail-label">Email</p>
                        <p className="patient-detail-value">{patientProfile?.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="patient-detail-item">
                      <Phone className="patient-detail-icon" />
                      <div>
                        <p className="patient-detail-label">Teléfono</p>
                        <p className="patient-detail-value">{patientProfile?.perfil?.telefono || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="patient-subsection-title">Información Adicional</h4>
                  <div className="patient-additional-details patient-details-section-spacing">
                    <div className="patient-detail-item-start">
                      <FileText className="patient-detail-icon patient-detail-icon-top" />
                      <div>
                        <p className="patient-detail-label">Historial Médico</p>
                        <p className="patient-detail-value">
                          {patientProfile?.perfil?.historial_medico || "Sin información."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="patient-details-right-column patient-details-section-spacing">
                  <h4 className="patient-subsection-title">Historial de Citas</h4>
                  {patientHistory.length > 0 ? (
                    <div className="patient-history-list">
                      {patientHistory.map((histCita) => (
                        <Card key={histCita.id_cita} className="patient-history-card">
                          <CardTitle className="patient-history-card-title">
                            <span>Sesión {histCita.numero_sesion}</span>
                            <Badge variant={getStatusBadgeVariant(histCita.estado)}>{histCita.estado}</Badge>
                          </CardTitle>
                          <CardDescription className="patient-history-date">
                            {formatDate(histCita.fecha_hora)} - {formatTime(histCita.fecha_hora)}
                          </CardDescription>
                          {histCita.notes ? (
                            histCita.notes.split("|").map((line, index) => (
                              <p key={index} className="patient-history-notes">
                                {line.trim()}
                              </p>
                            ))
                          ) : (
                            <p className="patient-history-notes">Sin notas.</p>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay citas registradas para este paciente.</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <div className="patient-details-footer">
            <Button onClick={() => onScheduleAppointment(patientProfile)}>Agendar Nueva Cita</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PatientDetailsPanel
