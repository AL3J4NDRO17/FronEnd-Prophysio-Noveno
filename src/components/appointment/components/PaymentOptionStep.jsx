"use client"
import { Button } from "../../public_ui/button"
import { Input } from "../../public_ui/input"
import { Label } from "../../public_ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../public_ui/card"
import { toast } from "react-toastify"

const PaymentOptionStep = ({ onNext, onPrev, formData, onFormChange, loading }) => {
  // 'onSubmit' ya no se recibe
  const handleChange = (e) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  const handleConfirm = () => {
    if (!formData.metodo_pago) {
      toast.error("Por favor, seleccione un método de pago.")
      return
    }
    onNext() // Ahora onNext avanza al paso de resumen
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Paso 4: Opciones de Pago</CardTitle>
        <CardDescription>Seleccione cómo desea realizar el pago de su cita.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="publicAppointment-form-group">
          <Label>Método de Pago:</Label>
          <div className="publicAppointment-radio-group">
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="pago_online"
                name="metodo_pago"
                value="online"
                checked={formData.metodo_pago === "online"}
                onChange={handleChange}
              />
              <Label htmlFor="pago_online">Pagar en línea (Tarjeta de crédito/débito)</Label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="radio"
                id="pago_al_finalizar"
                name="metodo_pago"
                value="al_finalizar"
                checked={formData.metodo_pago === "al_finalizar"}
                onChange={handleChange}
              />
              <Label htmlFor="pago_al_finalizar">Pagar al finalizar la cita (Efectivo/Transferencia)</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent className="publicAppointment-card-footer-between">
        <Button variant="outline" onClick={onPrev}>
          Anterior
        </Button>
        <Button onClick={handleConfirm} disabled={loading}>
          Siguiente {/* El texto del botón ahora es "Siguiente" */}
        </Button>
      </CardContent>
    </Card>
  )
}
export default PaymentOptionStep
