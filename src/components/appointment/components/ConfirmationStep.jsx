"use client"

import { CheckCircle, Loader } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../public_ui/card"

export default function ConfirmationStep({ loading }) {
  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Confirmación de Cita</CardTitle>
        <CardDescription>
          {loading ? "Procesando su cita..." : "Su cita ha sido agendada exitosamente."}
        </CardDescription>
      </CardHeader>
      <CardContent className="publicAppointment-confirmation-content">
        {loading ? (
          <Loader className="publicAppointment-confirmation-icon loading-icon" />
        ) : (
          <CheckCircle className="publicAppointment-confirmation-icon success-icon" />
        )}
        <p className="publicAppointment-confirmation-text-lg">
          {loading ? "Por favor, espere..." : "¡Gracias por agendar su cita!"}
        </p>
        {!loading && (
          <p className="publicAppointment-confirmation-text-base">
            Recibirá un correo electrónico de confirmación con los detalles.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
