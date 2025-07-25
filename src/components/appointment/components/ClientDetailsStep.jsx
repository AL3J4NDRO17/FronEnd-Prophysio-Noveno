"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../public_ui/card"
import { Button } from "../../public_ui/button"
import { Input } from "../../public_ui/input"
import { Label } from "../../public_ui/label"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@select"

export default function ClientDetailsStep({ onNext, onPrev, formData, onFormChange }) {
  const handleChange = (e) => {
    onFormChange(e.target.name, e.target.value)
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Datos del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="publicAppointment-form-group">
          <Label htmlFor="nombre_paciente">Nombre Completo</Label>
          <Input
            id="nombre_paciente"
            name="nombre_paciente"
            value={formData.nombre_paciente}
            onChange={handleChange}
            required
          />
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="sexo">Sexo</Label>
          <Select value={formData.sexo} onValueChange={(value) => onFormChange("sexo", value)}>
            <SelectTrigger className="input">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Femenino">Femenino</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} required />
        </div>
        {/* El campo de email se ha eliminado del formulario según el NewAppointmentStepper */}
      </CardContent>
      <CardFooter className="publicAppointment-card-footer-between">
        <Button variant="outline" onClick={onPrev}>
          Anterior
        </Button>
        <Button onClick={onNext}>Siguiente</Button>
      </CardFooter>
    </Card>
  )
}
