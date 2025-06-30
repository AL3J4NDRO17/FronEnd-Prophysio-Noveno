"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../public_ui/card"
import { Button } from "../../public_ui/button"
import { Input } from "../../public_ui/input"
import { Label } from "../../public_ui/label"

export default function TermsAndConditionsStep({ onNext, formData, onFormChange }) {
  const handleCheckboxChange = (e) => {
    onFormChange("termsAccepted", e.target.checked)
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Términos y Condiciones</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="publicAppointment-text-sm publicAppointment-text-secondary mb-4">
          Por favor, lea y acepte nuestros términos y condiciones para continuar.
        </p>
        <div className="publicAppointment-form-group">
          <Label htmlFor="terms">
            <Input
              type="checkbox"
              id="terms"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Acepto los términos y condiciones.
          </Label>
        </div>
        <p className="publicAppointment-text-xs publicAppointment-text-tertiary">
          Al marcar esta casilla, usted acepta nuestra política de privacidad y los términos de servicio.
        </p>
      </CardContent>
      <CardFooter className="publicAppointment-card-footer-between">
        <div></div> {/* Espacio para alinear el botón a la derecha */}
        <Button onClick={onNext} disabled={!formData.termsAccepted}>
          Siguiente
        </Button>
      </CardFooter>
    </Card>
  )
}
