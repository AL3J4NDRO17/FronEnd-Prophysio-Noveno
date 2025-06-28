"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../public_ui/card"
import { Button } from "../../public_ui/button"
import { Badge } from "../../public_ui/badge"
import { Calendar, Clock, Info } from "lucide-react"
import "../styles/userAppointmentsDetails.css"

const UserAppointmentDetails = ({ appointment, onCancel, onPostpone }) => {
  if (!appointment) {
    return (
      <Card className="publicAppointment-card-step">
        <CardHeader>
          <CardTitle>No hay citas activas</CardTitle>
          <CardDescription>No se encontró ninguna cita activa para su perfil.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="publicAppointment-text-sm publicAppointment-text-secondary">
            Si cree que esto es un error, por favor contacte a soporte.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no especificada"
    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
      return new Date(dateString).toLocaleDateString("es-ES", options)
    } catch (e) {
      return dateString // Devuelve el string original si hay error
    }
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
        return "pending" // Usando pending para postergada
      case "completada":
        return "confirmed" // Usando confirmed para completada
      default:
        return "default"
    }
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Su Cita Actual</CardTitle>
        <CardDescription>Detalles de su cita programada.</CardDescription>
      </CardHeader>
      <CardContent className="userAppointment-details-content">
        {" "}
        {/* Aplicar nueva clase */}
        <div className="userAppointment-detail-item">
          {" "}
          {/* Aplicar nueva clase */}
          <Calendar className="userAppointment-detail-icon" /> {/* Aplicar nueva clase */}
          <div>
            <p className="userAppointment-detail-label">Fecha y Hora:</p> {/* Aplicar nueva clase */}
            <p className="userAppointment-detail-value">{formatDate(appointment.fecha_hora)}</p>{" "}
            {/* Aplicar nueva clase */}
          </div>
        </div>
        <div className="userAppointment-detail-item">
          {" "}
          {/* Aplicar nueva clase */}
          <Clock className="userAppointment-detail-icon" /> {/* Aplicar nueva clase */}
          <div>
            <p className="userAppointment-detail-label">Duración:</p> {/* Aplicar nueva clase */}
            <p className="userAppointment-detail-value">
              {appointment.duracion ? `${appointment.duracion} minutos` : "60 mins"}
            </p>
          </div>
        </div>
        <div className="userAppointment-detail-item">
          {" "}
          {/* Aplicar nueva clase */}
          <Badge variant={getStatusBadgeVariant(appointment.estado)}>{appointment.estado || "Pendiente"}</Badge>
        </div>
        {appointment.notas && (
          <div className="publicAppointment-form-group">
            <p className="userAppointment-notes-label">Notas:</p> {/* Aplicar nueva clase */}
            <p className="userAppointment-notes-text">{appointment.notas}</p> {/* Aplicar nueva clase */}
          </div>
        )}
        {appointment.motivo_cancelacion && (
          <div className="publicAppointment-form-group">
            <p className="userAppointment-notes-label">Motivo de Cancelación:</p> {/* Aplicar nueva clase */}
            <p className="userAppointment-notes-text">{appointment.motivo_cancelacion}</p> {/* Aplicar nueva clase */}
          </div>
        )}
        {appointment.motivo_postergacion && (
          <div className="publicAppointment-form-group">
            <p className="userAppointment-notes-label">Motivo de Postergación:</p> {/* Aplicar nueva clase */}
            <p className="userAppointment-notes-text">{appointment.motivo_postergacion}</p> {/* Aplicar nueva clase */}
          </div>
        )}
      </CardContent>
      <CardFooter className="publicAppointment-card-footer-between">
        {appointment.estado !== "cancelada" && appointment.estado !== "completada" && (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancelar Cita
            </Button>
            <Button onClick={onPostpone}>Postergar Cita</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}



export default UserAppointmentDetails
