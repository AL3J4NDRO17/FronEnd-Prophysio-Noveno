"use client"

import { useState } from "react"
import { Button } from "../../public_ui/button"
import { Input } from "../../public_ui/input"
import { Label } from "../../public_ui/label"
import { Select, SelectItem } from "../../public_ui/select"
import { Textarea } from "../../public_ui/textarea" // Nuevo Textarea
import { Calendar } from "../../public_ui/calendar" // Nuevo Calendar
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../public_ui/card" // Nuevo Card
import { toast } from "react-toastify"

const AppointmentDetailsStep = ({ onNext, onPrev, formData, onFormChange, workHours, existingAppointments }) => {
  const [showCalendar, setShowCalendar] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    // Si es un input de tipo 'file', pasa los archivos
    if (type === "file") {
      onFormChange(name, files)
    } else {
      onFormChange(name, value)
    }
  }

  const handleDateSelect = (date) => {
    onFormChange("fecha_cita", date.toISOString().split("T")[0]) // YYYY-MM-DD
    setShowCalendar(false)
  }

  // Array para mapear getDay() (0-6) a nombres de días en inglés
  const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const isTimeSlotAvailable = (dateTime, duration, appointments) => {
    const newAppStartTime = new Date(dateTime).getTime()
    const newAppEndTime = newAppStartTime + Number.parseInt(duration) * 60 * 1000

    // Check against work hours (already done in Calendar component, but good to re-check)
    const selectedDay = new Date(dateTime).getDay() // 0 for Sunday, 1 for Monday, etc.
    const dayName = ENGLISH_DAYS_OF_WEEK[selectedDay] // Obtiene el nombre del día en inglés

    if (!workHours.days.includes(dayName)) {
      toast.error(`La clínica no trabaja los ${dayName}s.`)
      return false
    }

    const workStartTimeParts = workHours.startTime.split(":")
    const workEndTimeParts = workHours.endTime.split(":")

    const workStartDateTime = new Date(dateTime)
    workStartDateTime.setHours(Number.parseInt(workStartTimeParts[0]), Number.parseInt(workStartTimeParts[1]), 0, 0)

    const workEndDateTime = new Date(dateTime)
    workEndDateTime.setHours(Number.parseInt(workEndTimeParts[0]), Number.parseInt(workEndTimeParts[1]), 0, 0)

    if (newAppStartTime < workStartDateTime.getTime() || newAppEndTime > workEndDateTime.getTime()) {
      toast.error(
        `El horario seleccionado está fuera del horario laboral (${workHours.startTime} - ${workHours.endTime}).`,
      )
      return false
    }

    // Check against existing appointments
    for (const app of appointments) {
      // Only consider 'pendiente' or 'confirmada' appointments for overlap
      if (app.estado === "cancelada" || app.estado === "completada") continue

      const existingAppStartTime = new Date(app.fecha_cita).getTime()
      const existingAppEndTime = existingAppStartTime + (app.duracion || 30) * 60 * 1000 // Assume 30 min if no duration

      // Check for overlap: (StartA < EndB) and (EndA > StartB)
      if (newAppStartTime < existingAppEndTime && newAppEndTime > existingAppStartTime) {
        toast.error("El horario seleccionado se superpone con otra cita existente.")
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    const { fecha_cita, hora_cita, motivo_consulta } = formData
    const defaultDuration = "30" // Usar una duración por defecto para la validación

    if (!fecha_cita || !hora_cita || !motivo_consulta) {
      toast.error("Por favor, complete la fecha, hora y motivo de la cita.")
      return
    }

    const combinedDateTime = `${fecha_cita}T${hora_cita}:00`
    if (!isTimeSlotAvailable(combinedDateTime, defaultDuration, existingAppointments)) {
      return // Error toast is shown by isTimeSlotAvailable
    }

    onNext()
  }

  // Time slots for the "Nueva Cita" modal, based on work hours
  const getTimeSlots = () => {
    const slots = []
    if (!workHours.startTime || !workHours.endTime) return slots

    const [startH, startM] = workHours.startTime.split(":").map(Number)
    const [endH, endM] = workHours.endTime.split(":").map(Number)
    const interval = 15 // 15 minute intervals

    let currentHour = startH
    let currentMinute = startM

    while (currentHour < endH || (currentHour === endH && currentMinute < endM)) {
      slots.push(`${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`)
      currentMinute += interval
      if (currentMinute >= 60) {
        currentHour++
        currentMinute %= 60
      }
    }
    // Add the exact end time if it's a valid slot
    if (currentHour === endH && currentMinute === endM) {
      slots.push(`${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`)
    }
    return slots
  }
  const timeSlots = getTimeSlots()

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Paso 3: Detalles de la Cita y Salud</CardTitle>
        <CardDescription>Proporcione información sobre su salud y la cita.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="publicAppointment-form-group">
          <Label htmlFor="alergias">¿Tiene alguna alergia? (Opcional)</Label>
          <Textarea
            id="alergias"
            name="alergias"
            value={formData.alergias || ""}
            onChange={handleChange}
            placeholder="Ej: Alergia a la penicilina, al látex, etc."
          />
        </div>

        <div className="publicAppointment-form-group">
          <Label htmlFor="fecha_cita">Fecha de la Cita</Label>
          <Input
            type="text" // Use text to prevent native date picker
            id="fecha_cita"
            name="fecha_cita"
            value={formData.fecha_cita || ""}
            readOnly
            onClick={() => setShowCalendar(true)}
            placeholder="Seleccione una fecha"
            required
          />
          {showCalendar && (
            <div className="publicAppointment-calendar-popover">
              <Calendar
                selectedDate={formData.fecha_cita ? new Date(formData.fecha_cita) : null}
                onSelect={handleDateSelect}
                workHours={workHours}
                minDate={new Date()} // Citas no pueden ser en el pasado
              />
              <Button variant="outline" onClick={() => setShowCalendar(false)} className="mt-2">
                Cerrar Calendario
              </Button>
            </div>
          )}
        </div>

        <div className="publicAppointment-form-group">
          <Label htmlFor="hora_cita">Hora de la Cita</Label>
          <Select
            id="hora_cita"
            name="hora_cita"
            value={formData.hora_cita || "00:00"}
            onChange={handleChange}
            required
          >
            <SelectItem value="00:00">Seleccione una hora</SelectItem>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Duración Estimada y Tiempo de Duración del Servicio eliminados según la solicitud */}
        {/* Campo de Tipo de Servicio eliminado según la solicitud */}

        <div className="publicAppointment-form-group">
          <Label htmlFor="motivo_consulta">Motivo de la Consulta</Label>
          <Textarea
            id="motivo_consulta"
            name="motivo_consulta"
            value={formData.motivo_consulta || ""}
            onChange={handleChange}
            placeholder="Describa brevemente el motivo de su consulta."
            required
          />
        </div>

        {/* Nuevo campo opcional para subir radiografías/imágenes */}
        <div className="publicAppointment-form-group">
          <Label htmlFor="radiografias">Radiografías/Imágenes (Opcional)</Label>
          <Input
            id="radiografias"
            name="radiografias"
            type="file"
            onChange={handleChange}
            multiple // Permite subir múltiples archivos
            accept="image/*,application/pdf" // Acepta imágenes y PDFs
          />
          <p className="publicAppointment-text-sm publicAppointment-text-secondary mt-1">
            Puede subir imágenes (JPG, PNG) o PDFs.
          </p>
        </div>
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

export default AppointmentDetailsStep
