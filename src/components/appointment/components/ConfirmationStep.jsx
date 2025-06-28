"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../public_ui/card"
import { CheckCircle } from "lucide-react" // Icono para la confirmación

const ConfirmationStep = ({ onPrev, onSubmit, loading }) => {
  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Paso 5: Confirmación Final</CardTitle> {/* Actualizado a Paso 5 */}
        <CardDescription>Por favor, revise los detalles y confirme su cita.</CardDescription>
      </CardHeader>
      <CardContent className="publicAppointment-confirmation-content">
        <CheckCircle className="publicAppointment-confirmation-icon" />
        <p className="publicAppointment-confirmation-text-lg">¡Todo listo para confirmar!</p>
        <p className="publicAppointment-confirmation-text-base">
         Se ha finalizado el proceso de agendado de cita, por favor verifique el enlace que se le envio a su correo electronico para confirmar la cita...
        </p>
      </CardContent>
      
    </Card>
  )
}

export default ConfirmationStep
