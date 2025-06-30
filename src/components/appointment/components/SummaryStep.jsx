"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../public_ui/card"
import { Button } from "../../public_ui/button"
import { Calendar, DollarSign, FileText } from "lucide-react" // Importar iconos

export default function SummaryStep({ onPrev, onNext, onSubmit, formData, loading }) {
  const formatDate = (dateString, timeString) => {
    if (!dateString || !timeString) return "No especificado"
    try {
      const combinedDateTime = `${dateString}T${timeString}:00`
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
      return new Date(combinedDateTime).toLocaleDateString("es-ES", options)
    } catch (e) {
      return "Formato inválido"
    }
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Resumen de la Cita</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="publicAppointment-summary-section">
          <h3 className="publicAppointment-summary-heading">
            <FileText className="mr-2 h-5 w-5" />
            Datos del Cliente
          </h3>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Nombre:</span>
            <span className="publicAppointment-summary-value">{formData.nombre_paciente || "N/A"}</span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Sexo:</span>
            <span className="publicAppointment-summary-value">{formData.sexo || "N/A"}</span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Teléfono:</span>
            <span className="publicAppointment-summary-value">{formData.telefono || "N/A"}</span>
          </div>
        </div>

        <div className="publicAppointment-summary-section">
          <h3 className="publicAppointment-summary-heading">
            <Calendar className="mr-2 h-5 w-5" />
            Detalles de la Cita
          </h3>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Fecha y Hora:</span>
            <span className="publicAppointment-summary-value">
              {formatDate(formData.fecha_cita, formData.hora_cita)}
            </span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Motivo de Consulta:</span>
            <span className="publicAppointment-summary-value">{formData.motivo_consulta || "N/A"}</span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Alergias:</span>
            <span className="publicAppointment-summary-value">{formData.alergias || "Ninguna"}</span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Radiografías:</span>
            <span className="publicAppointment-summary-value">
              {formData.radiografias ? formData.radiografias.name : "No adjuntas"}
            </span>
          </div>
        </div>

        <div className="publicAppointment-summary-section">
          <h3 className="publicAppointment-summary-heading">
            <DollarSign className="mr-2 h-5 w-5" />
            Pago
          </h3>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Método de Pago:</span>
            <span className="publicAppointment-summary-value">{formData.metodo_pago || "No seleccionado"}</span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Estado:</span>
            <span className="publicAppointment-summary-value">{formData.estado || "Pendiente"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="publicAppointment-card-footer-between">
        <Button variant="outline" onClick={onPrev}>
          Anterior
        </Button>
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? "Agendando..." : "Confirmar Cita"}
        </Button>
      </CardFooter>
    </Card>
  )
}
