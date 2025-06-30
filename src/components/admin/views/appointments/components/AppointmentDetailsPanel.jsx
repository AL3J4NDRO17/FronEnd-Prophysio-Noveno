"use client"
import {
  X,
  User,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Stethoscope,
  MessageSquare,
  MoreVertical,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../public_ui/card"
import { Button } from "../../../../public_ui/button"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../public_ui/dropdown-menu"
import { useEffect, useRef, useState } from "react"
import "../styles/AppointmentDetailsPanel.css" // Ruta actualizada
import { useCitas } from "../hooks/useCitas" // Ruta actualizada
import { citaService } from "../services/appointment-service" // Ruta actualizada

const AppointmentDetailsPanel = ({ isOpen, onClose, appointment, onCancel, onPostpone }) => {
  const panelRef = useRef(null)
  const [isPanelVisible, setIsPanelVisible] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
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

    if (isOpen) {
      const timer = setTimeout(() => {
        setIsPanelVisible(true)
      }, 10)
      document.addEventListener("keydown", handleEscape)

      const fetchPatientProfile = async () => {
        setProfileLoading(true)
        setProfileError(null)
        try {
          if (appointment?.id_cita) {
            // La función obtenerPerfilPorCita ya devuelve el usuario anidado
            const data = await citaService.obtenerPerfilPorCita(appointment.id_cita)
            setPatientProfile(data)
          }
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
        setShowHistory(false)
      }
    } else {
      setIsPanelVisible(false)
      document.removeEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose, appointment?.id_cita])

  if (!isOpen || !appointment) return null

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

  // Filtrar historial de citas usando el id_usuario del objeto 'usuario' anidado
  const patientHistory = citas
    .filter((cita) => cita.id_usuario === appointment.id_usuario && cita.estado === "completada")
    .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime())

  return (
    <div className="appointmentsAdmin-details-panel-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className={`appointmentsAdmin-details-panel ${isPanelVisible ? "is-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="appointmentsAdmin-details-card">
          <CardHeader className="appointmentsAdmin-details-card-header">
            <CardTitle className="appointmentsAdmin-details-card-title">Detalles de la Cita</CardTitle>
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
                {/* Columna Izquierda: Detalles de la Cita */}
                <div className="appointmentsAdmin-details-section-spacing">
                  {/* Contacto de la Cita (asumiendo que son del paciente) */}
                  <div className="appointmentsAdmin-details-contact-grid">
                    <div className="appointmentsAdmin-detail-item">
                      <Mail className="appointmentsAdmin-detail-icon" />
                      <div>
                        <p className="appointmentsAdmin-detail-label">Email</p>
                        <p className="appointmentsAdmin-detail-value">{patientProfile?.usuario?.email || "N/A"}</p>
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

                  {/* Fecha y Hora */}
                  <div className="appointmentsAdmin-detail-item appointmentsAdmin-details-section-spacing">
                    <Calendar className="appointmentsAdmin-detail-icon" />
                    <div>
                      <p className="appointmentsAdmin-detail-label">Fecha y Hora</p>
                      <p className="appointmentsAdmin-detail-value">
                        {formatDate(appointment.fecha_hora)} - {formatTime(appointment.fecha_hora)}
                      </p>
                    </div>
                  </div>

                  {/* Tipo de Cita (usando Motivo de Consulta) */}
                  <div className="appointmentsAdmin-detail-item appointmentsAdmin-details-section-spacing">
                    <Stethoscope className="appointmentsAdmin-detail-icon" />
                    <div>
                      <p className="appointmentsAdmin-detail-label">Tipo de Cita</p>
                      <p className="appointmentsAdmin-detail-value">{appointment.notes || "N/A"}</p>
                    </div>
                  </div>

                  {/* Farmacéutico/Terapeuta (Placeholder) */}
                  <div className="appointmentsAdmin-detail-item appointmentsAdmin-details-section-spacing">
                    <User className="appointmentsAdmin-detail-icon" />
                    <div>
                      <p className="appointmentsAdmin-detail-label">Terapeuta</p>
                      <p className="appointmentsAdmin-detail-value">Dr. Juan Pérez</p> {/* Placeholder */}
                    </div>
                  </div>

                  {/* Costo (Placeholder) */}
                  <div className="appointmentsAdmin-detail-item appointmentsAdmin-details-section-spacing">
                    <DollarSign className="appointmentsAdmin-detail-icon" />
                    <div>
                      <p className="appointmentsAdmin-detail-label">Costo</p>
                      <p className="appointmentsAdmin-detail-value">$50.00</p> {/* Placeholder */}
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="appointmentsAdmin-detail-item-start appointmentsAdmin-details-section-spacing">
                    <FileText className="appointmentsAdmin-detail-icon appointmentsAdmin-detail-icon-top" />
                    <div>
                      <p className="appointmentsAdmin-detail-label">Notas</p>
                      {appointment.notes ? (
                        appointment.notes.split("|").map((line, index) => (
                          <p key={index} className="appointmentsAdmin-detail-value">
                            {line.trim()}
                          </p>
                        ))
                      ) : (
                        <p className="appointmentsAdmin-detail-value">Sin notas adicionales.</p>
                      )}
                    </div>
                  </div>

                  {/* Radiografías/Imágenes */}
                  {appointment.foto_documento && (
                    <div className="appointmentsAdmin-detail-item-start appointmentsAdmin-details-section-spacing">
                      <FileText className="appointmentsAdmin-detail-icon appointmentsAdmin-detail-icon-top" />
                      <div>
                        <p className="appointmentsAdmin-detail-label">Radiografía/Imagen</p>
                        <p className="appointmentsAdmin-detail-value">
                          {appointment.foto_documento || "Archivo adjunto"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Motivo de Cancelación/Postergación */}
                  {appointment.motivo_cancelacion && (
                    <div className="appointmentsAdmin-detail-item-start appointmentsAdmin-details-section-spacing">
                      <FileText className="appointmentsAdmin-detail-icon appointmentsAdmin-detail-icon-top" />
                      <div>
                        <p className="appointmentsAdmin-detail-label">Motivo de Cancelación</p>
                        <p className="appointmentsAdmin-detail-value">{appointment.motivo_cancelacion}</p>
                      </div>
                    </div>
                  )}
                  {appointment.motivo_postergacion && (
                    <div className="appointmentsAdmin-detail-item-start appointmentsAdmin-details-section-spacing">
                      <FileText className="appointmentsAdmin-detail-icon appointmentsAdmin-detail-icon-top" />
                      <div>
                        <p className="appointmentsAdmin-detail-label">Motivo de Postergación</p>
                        <p className="appointmentsAdmin-detail-value">{appointment.motivo_postergacion}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Columna Derecha: Detalles del Paciente / Historial */}
                <div className="appointmentsAdmin-details-right-column appointmentsAdmin-details-section-spacing">
                  {showHistory ? (
                    <>
                      <h4 className="appointmentsAdmin-subsection-title">Historial de Citas Completadas</h4>
                      <Button variant="outline" size="sm" onClick={() => setShowHistory(false)} className="mb-4">
                        Volver a Detalles del Paciente
                      </Button>
                      {patientHistory.length > 0 ? (
                        <div className="space-y-4">
                          {patientHistory.map((histCita) => (
                            <Card key={histCita.id_cita} className="p-3">
                              <CardTitle className="text-sm font-semibold mb-1">
                                Sesión {histCita.numero_sesion}
                              </CardTitle>
                              <CardDescription className="text-xs text-gray-500">
                                {formatDate(histCita.fecha_hora)} - {formatTime(histCita.fecha_hora)}
                              </CardDescription>
                              <p className="text-sm text-gray-600 mt-2">{histCita.notes || "Sin notas."}</p>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No hay citas completadas para este paciente.</p>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Info Básica del Paciente */}
                      <div className="appointmentsAdmin-patient-info-header appointmentsAdmin-details-section-spacing">
                        <Avatar className="appointmentsAdmin-patient-avatar">
                          <AvatarFallback className="appointmentsAdmin-patient-avatar-fallback">
                            {getInitials(patientProfile?.usuario?.nombre || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="appointmentsAdmin-patient-name">{patientProfile?.usuario?.nombre || "N/A"}</p>
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
                            <DropdownMenuItem>Abrir en Expediente</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowHistory(true)}>Ver Historial</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Detalles del Paciente */}
                      <div className="appointmentsAdmin-patient-details appointmentsAdmin-details-section-spacing">
                        <div className="appointmentsAdmin-detail-item">
                          <User className="appointmentsAdmin-detail-icon" />
                          <div>
                            <p className="appointmentsAdmin-detail-label">Nombre Completo</p>
                            <p className="appointmentsAdmin-detail-value">{patientProfile?.usuario?.nombre || "N/A"}</p>
                          </div>
                        </div>
                        <div className="appointmentsAdmin-detail-item">
                          <Calendar className="appointmentsAdmin-detail-icon" />
                          <div>
                            <p className="appointmentsAdmin-detail-label">Edad</p>
                            <p className="appointmentsAdmin-detail-value">{patientProfile?.perfil?.edad || "N/A"}</p>
                          </div>
                        </div>
                        <div className="appointmentsAdmin-detail-item-start">
                          <FileText className="appointmentsAdmin-detail-icon appointmentsAdmin-detail-icon-top" />
                          <div>
                            <p className="appointmentsAdmin-detail-label">Historial Médico</p>
                            <p className="appointmentsAdmin-detail-value">
                              {patientProfile?.perfil?.historial_medico || "Sin información."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <div className="appointmentsAdmin-modal-footer-panel">
            {appointment.estado !== "cancelada" && appointment.estado !== "completada" && (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Cancelar Cita
                </Button>
                <Button onClick={onPostpone}>Postergar Cita</Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}


export default AppointmentDetailsPanel
