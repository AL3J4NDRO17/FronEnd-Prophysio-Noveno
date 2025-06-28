"use client"

import { useEffect } from "react"
import { Button } from "../../public_ui/button"
import { Input } from "../../public_ui/input"
import { Label } from "../../public_ui/label"
import { Select, SelectItem } from "../../public_ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../public_ui/card"
import { toast } from "react-toastify"

const ClientDetailsStep = ({ onNext, onPrev, formData, onFormChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  const handleNext = () => {
    if (!formData.nombre_paciente || !formData.sexo || !formData.telefono) {
      toast.error("Por favor, complete todos los campos obligatorios: Nombre, Sexo y Teléfono.")
      return
    }
    onNext()
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Paso 2: Datos del Cliente</CardTitle>
        <CardDescription>Por favor, complete sus datos personales.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="publicAppointment-form-group">
          <Label htmlFor="nombre_paciente">Nombre Completo</Label>
          <Input
            id="nombre_paciente"
            name="nombre_paciente"
            value={formData.nombre_paciente || ""} // Usa formData para el valor inicial
            onChange={handleChange}
            placeholder="Su nombre completo"
            required
          />
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="sexo">Sexo</Label>
          <Select id="sexo" name="sexo" value={formData.sexo || "Seleccione..."} onChange={handleChange} required>
            <SelectItem value="Seleccione...">Seleccione...</SelectItem>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="femenino">Femenino</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </Select>
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono || ""} // Usa formData para el valor inicial
            onChange={handleChange}
            placeholder="Ej: +52 55 1234 5678"
            required
          />
        </div>
        {/* Campo de Email eliminado según la solicitud */}
      </CardContent>
      <CardContent className="publicAppointment-card-footer-between">
        <Button variant="outline" onClick={onPrev}>
          Anterior
        </Button>
        <Button onClick={handleNext}>Siguiente</Button>
      </CardContent>
    </Card>
  )
}


export default ClientDetailsStep
