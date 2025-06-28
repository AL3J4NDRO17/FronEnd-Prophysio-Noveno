"use client"

import { Button } from "../../public_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../public_ui/card"
import { Calendar, DollarSign, User, File, Hash } from "lucide-react" // Importar el icono File y Hash
import "../styles/SummaryStep.css"
// Cambiado: onNext en lugar de onSubmit
const SummaryStep = ({ onPrev, onNext, onSubmit, formData, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada"
    try {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString("es-ES", options)
    } catch (e) {
      return dateString
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return "No especificada"
    // Asume HH:MM
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "online":
        return "Pagar en línea (Tarjeta de crédito/débito)"
      case "al_finalizar":
        return "Pagar al finalizar la cita (Efectivo/Transferencia)"
      default:
        return "No especificado"
    }
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Paso 4: Resumen de la Cita</CardTitle> {/* Actualizado a Paso 4 */}
        <CardDescription>Por favor, revise los detalles de su cita antes de continuar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sección de Datos del Cliente */}
        <div className="publicAppointment-summary-section">
          <h3 className="publicAppointment-summary-heading">
            <User className="h-5 w-5 mr-2 text-teal-500" />
            Datos Personales
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

        {/* Sección de Detalles de la Cita */}
        <div className="publicAppointment-summary-section">
          <h3 className="publicAppointment-summary-heading">
            <Calendar className="h-5 w-5 mr-2 text-teal-500" />
            Detalles de la Cita
          </h3>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Fecha:</span>
            <span className="publicAppointment-summary-value">{formatDate(formData.fecha_cita)}</span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Hora:</span>
            <span className="publicAppointment-summary-value">{formatTime(formData.hora_cita)}</span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Motivo de Consulta:</span>
            <span className="publicAppointment-summary-value">{formData.motivo_consulta || "N/A"}</span>
          </div>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Alergias:</span>
            <span className="publicAppointment-summary-value">{formData.alergias || "Ninguna"}</span>
          </div>
          {formData.radiografias && (
            <div className="publicAppointment-summary-item">
              <span className="publicAppointment-summary-label flex items-center">
                <File className="h-4 w-4 mr-1 text-teal-500" />
                Radiografía/Imagen:
              </span>
              <span className="publicAppointment-summary-value">{formData.radiografias.name}</span>
            </div>
          )}
        </div>

        {/* Sección de Pago */}
        <div className="publicAppointment-summary-section">
          <h3 className="publicAppointment-summary-heading">
            <DollarSign className="h-5 w-5 mr-2 text-teal-500" />
            Método de Pago
          </h3>
          <div className="publicAppointment-summary-item">
            <span className="publicAppointment-summary-label">Método Seleccionado:</span>
            <span className="publicAppointment-summary-value">{getPaymentMethodLabel(formData.metodo_pago)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="publicAppointment-card-footer-between">
        <Button variant="outline" onClick={onPrev}>
          Anterior
        </Button>
        <Button
          onClick={async () => {
            await onSubmit()
            onNext()
          }}
          disabled={loading}
        >
          {loading ? "Confirmando..." : "Confirmar Cita"}
        </Button>

      </CardFooter>
    </Card>
  )
}

export default SummaryStep


