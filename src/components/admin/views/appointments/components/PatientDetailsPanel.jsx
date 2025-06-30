"use client"
import { X, Calendar, Mail, Phone, FileText, MessageSquare, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../public_ui/card"
import { Button } from "../../../../public_ui/button"
import { Badge } from "../../../../public_ui/badge"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../public_ui/dropdown-menu"
import { useEffect, useRef, useState } from "react"
import "../styles/AppointmentDetailsPanel.css" // Reutilizamos estilos
import { useCitas } from "../hooks/useCitas"
import { userService } from "../services/userService"

const PatientDetailsPanel = ({ isOpen, onClose, patientId, onScheduleAppointment }) => {
  const panelRef = useRef(null)
  const [isPanelVisible, setIsPanelVisible] = useState(false)
  const [patientProfile, setPatientProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)

  const { citas } = useCitas() // Para filtrar el historial de citas

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
      case "inasistencia": // Nuevo estado
        return "inasistencia" // Usar el nuevo estilo de badge
      default:
        return "default"
    }
  }

  // Filtrar historial de citas usando el id_usuario del objeto 'usuario' anidado
  const patientHistory = citas
    .filter((cita) => cita.id_usuario === patientId && cita.estado !== "cancelada") // Excluir citas canceladas
    .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime())
  console.log(patientProfile)
  return (
    <div className="appointmentsAdmin-details-panel-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className={`appointmentsAdmin-details-panel ${isPanelVisible ? "is-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="appointmentsAdmin-details-card">
          <CardHeader className="appointmentsAdmin-details-card-header">
            <CardTitle className="appointmentsAdmin-details-card-title">Detalles del Paciente</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="appointmentsAdmin-details-card-content">
            {profileLoading ? (
              <p>Cargando detalles del paciente...</p>
            ) : profileError ? (
              <p className="text-red-500">{profileError}</p>
            ) : (
              <div className="appointmentsAdmin-details-grid">
                {/* Columna Izquierda: Info Básica del Paciente */}
                <div className="appointmentsAdmin-details-section-spacing">
                  <div className="appointmentsAdmin-patient-info-header appointmentsAdmin-details-section-spacing">
                    <Avatar className="appointmentsAdmin-patient-avatar">
                      <AvatarFallback className="appointmentsAdmin-patient-avatar-fallback">
                        {getInitials(patientProfile?.nombre || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="appointmentsAdmin-patient-name">{patientProfile?.nombre || "N/A"}</p>
                      <p className="appointmentsAdmin-patient-meta">
                        {patientProfile?.perfil?.sexo === "Masculino"
                          ? "Masculino"
                          : patientProfile?.perfil?.sexo === "Femenino"
                            ? "Femenino"
                            : "N/A"}
                        , {patientProfile?.perfil?.edad || "N/A"} años
                      </p>
                    </div>
                  </div>

                  {/* Botones de Acción del Paciente */}
                  <div className="appointmentsAdmin-patient-actions appointmentsAdmin-details-section-spacing">
                    <Button variant="primary" className="appointmentsAdmin-patient-action-button">
                      <Phone className="appointmentsAdmin-patient-action-icon" />
                      Llamar
                    </Button>
                    <Button variant="outline" className="appointmentsAdmin-patient-action-button bg-transparent">
                      <MessageSquare className="appointmentsAdmin-patient-action-icon" />
                      Mensaje
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onScheduleAppointment(patientProfile.usuario)}>
                          Agendar Nueva Cita
                        </DropdownMenuItem>
                        {/* Puedes añadir más opciones aquí */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Detalles de Contacto */}
                  <h4 className="appointmentsAdmin-subsection-title">Contacto</h4>
                  <div className="appointmentsAdmin-details-contact-grid appointmentsAdmin-details-section-spacing">
                    <div className="appointmentsAdmin-detail-item">
                      <Mail className="appointmentsAdmin-detail-icon" />
                      <div>
                        <p className="appointmentsAdmin-detail-label">Email</p>
                        <p className="appointmentsAdmin-detail-value">{patientProfile?.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="appointmentsAdmin-detail-item">
                      <Phone className="appointmentsAdmin-detail-icon" />
                      <div>
                        <p className="appointmentsAdmin-detail-label">Teléfono</p>
                        <p className="appointmentsAdmin-detail-value">{patientProfile?.perfil?.telefono || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detalles Adicionales del Paciente */}
                  <h4 className="appointmentsAdmin-subsection-title">Información Adicional</h4>
                  <div className="appointmentsAdmin-patient-details appointmentsAdmin-details-section-spacing">
                    
                    <div className="appointmentsAdmin-detail-item-start">
                      <FileText className="appointmentsAdmin-detail-icon appointmentsAdmin-detail-icon-top" />
                      <div>
                        <p className="appointmentsAdmin-detail-label">Historial Médico</p>
                        <p className="appointmentsAdmin-detail-value">
                          {patientProfile?.perfil?.historial_medico || "Sin información."}
                        </p>
                      </div>
                    </div>
                    {/* Añadir más campos del perfil si son relevantes */}
                  </div>
                </div>

                {/* Columna Derecha: Historial de Citas */}
                <div className="appointmentsAdmin-details-right-column appointmentsAdmin-details-section-spacing">
                  <h4 className="appointmentsAdmin-subsection-title">Historial de Citas</h4>
                  {patientHistory.length > 0 ? (
                    <div className="space-y-4">
                      {patientHistory.map((histCita) => (
                        <Card key={histCita.id_cita} className="appointmentsAdmin-history-card">
                          <CardTitle className="appointmentsAdmin-history-card-title">
                            <span>Sesión {histCita.numero_sesion}</span>
                            <Badge variant={getStatusBadgeVariant(histCita.estado)}>{histCita.estado}</Badge>
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-500">
                            {formatDate(histCita.fecha_hora)} - {formatTime(histCita.fecha_hora)}
                          </CardDescription>
                          {histCita.notes ? (
                            histCita.notes.split("|").map((line, index) => (
                              <p key={index} className="text-sm text-gray-600 mt-2">
                                {line.trim()}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 mt-2">Sin notas.</p>
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
          <div className="appointmentsAdmin-modal-footer-panel">
            <Button onClick={() => onScheduleAppointment(patientProfile.usuario)}>Agendar Nueva Cita</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PatientDetailsPanel
