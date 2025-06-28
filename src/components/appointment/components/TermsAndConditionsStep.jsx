                                                                                                                      "use client"
import { Button } from "../../public_ui/button"
import { Label } from "../../public_ui/label"
import { Checkbox } from "../../public_ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../public_ui/card" // Nuevo Card
import { toast } from "react-toastify"

const TermsAndConditionsStep = ({ onNext, formData, onFormChange }) => {
  const handleCheckboxChange = (checked) => {
    onFormChange("termsAccepted", checked)
  }

  const handleNext = () => {
    if (formData.termsAccepted) {
      onNext()
    } else {
      toast.error("Debe aceptar los términos y condiciones para continuar.")
    }
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Paso 1: Términos y Condiciones</CardTitle>
        <CardDescription>Por favor, lea y acepte nuestros términos y condiciones.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="publicAppointment-form-group">
          <p className="publicAppointment-text-sm publicAppointment-text-secondary">
            Al continuar, usted acepta que ha leído y comprendido la política de privacidad y los términos de servicio
            de PROphysio. Esto incluye el manejo de sus datos personales y de salud para la gestión de citas y
            tratamientos.
          </p>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox id="terms" checked={formData.termsAccepted || false} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="terms">Acepto los términos y condiciones</Label>
          </div>
        </div>
      </CardContent>
      <CardContent className="publicAppointment-card-footer-right">
        <Button onClick={handleNext} disabled={!formData.termsAccepted}>
          Siguiente
        </Button>
      </CardContent>
    </Card>
  )
}


export default TermsAndConditionsStep
