"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@dialog" // Importación corregida
import { Button } from "@button" // Importación corregida
import { Input } from "@input" // Importación corregida
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@select" // Importación corregida
import { Label } from "@label" // Importación corregida
import "../styles/WorkHoursModal.css" // Importar el CSS
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"

const generateDaysOfWeekOptions = () => {
  const options = []
  // Crear una fecha de referencia para cada día de la semana, empezando por el lunes
  // 4 de enero de 2021 fue un lunes. Usamos una fecha fija para asegurar el orden.
  const mondayRef = new Date("2021-01-04T12:00:00Z")

  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayRef)
    date.setDate(mondayRef.getDate() + i) // Añadir días para obtener Martes, Miércoles, etc.

    options.push({
      value: format(date, "EEEE", { locale: enUS }), // Valor en inglés (ej. "Monday")
      label: format(date, "EEEE", { locale: es }), // Etiqueta en español (ej. "Lunes")
    })
  }
  console.log("opciones",options)
  return options
}

const daysOfWeek = generateDaysOfWeekOptions()
console.log(daysOfWeek)
export default function WorkHoursModal({ isOpen, onClose, currentWorkHours, onSave }) {
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    if (isOpen && currentWorkHours) {
      // Mapear los días a inglés para el estado interno del modal
      const mappedHours = currentWorkHours.map((h) => ({
        ...h,
        dia:
          h.dia === "Lunes"
            ? "Monday"
            : h.dia === "Martes"
              ? "Tuesday"
              : h.dia === "Miércoles"
                ? "Wednesday"
                : h.dia === "Jueves"
                  ? "Thursday"
                  : h.dia === "Viernes"
                    ? "Friday"
                    : h.dia === "Sábado"
                      ? "Saturday"
                      : h.dia === "Domingo"
                        ? "Sunday"
                        : h.dia,
      }))
      setSchedules(mappedHours)
    }
  }, [isOpen, currentWorkHours])

  // Añadir un console.log para depurar el estado de los horarios
  useEffect(() => {
    console.log("Estado actual de schedules en WorkHoursModal:", schedules)
  }, [schedules])

  const handleDayChange = (index, value) => {
    const newSchedules = [...schedules]
    newSchedules[index].dia = value
    setSchedules(newSchedules)
  }

  const handleTimeChange = (index, field, value) => {
    const newSchedules = [...schedules]
    newSchedules[index][field] = value
    setSchedules(newSchedules)
  }

  const handleDurationChange = (index, value) => {
    const newSchedules = [...schedules]
    newSchedules[index].duracion_sesion = value
    setSchedules(newSchedules)
  }

  const addScheduleBlock = () => {
    // CAMBIO: Inicializar 'dia' como undefined para que el placeholder funcione correctamente
    setSchedules([...schedules, { id: null, dia: undefined, hora_inicio: "", hora_fin: "", duracion_sesion: "" }])
  }

  const removeScheduleBlock = (index) => {
    const newSchedules = schedules.filter((_, i) => i !== index)
    setSchedules(newSchedules)
  }

  const handleSave = () => {
    // Validar que no haya bloques vacíos o incompletos
    const isValid = schedules.every(
      (s) => s.dia && s.hora_inicio && s.hora_fin && s.duracion_sesion !== undefined && s.duracion_sesion !== "",
    )
    if (!isValid) {
      alert("Por favor, completa todos los campos de los horarios.")
      return
    }
    onSave(schedules)
  }

  if (!isOpen) return null

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent className="work-hours-modal-content">
        <DialogHeader>
          <DialogTitle className="work-hours-modal-title">Configurar Horario Laboral</DialogTitle>
        </DialogHeader>
        <div className="work-hours-modal-body">
          {schedules.length === 0 && (
            <p className="text-center text-gray-500">No hay horarios configurados. Añade uno.</p>
          )}
          {schedules.map((schedule, index) => (
            <div key={index} className="schedule-block">
              <div className="schedule-inputs">
                <div className="form-group">
                  <Label htmlFor={`day-${index}`}>Día</Label>
                  {/* CAMBIO: Eliminar || "" ya que 'undefined' es el valor esperado para no seleccionado */}
                  <Select onValueChange={(value) => handleDayChange(index, value)} value={schedule.dia}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un día" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <Label htmlFor={`start-time-${index}`}>Hora Inicio</Label>
                  <Input
                    id={`start-time-${index}`}
                    type="time"
                    value={schedule.hora_inicio || ""}
                    onChange={(e) => handleTimeChange(index, "hora_inicio", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor={`end-time-${index}`}>Hora Fin</Label>
                  <Input
                    id={`end-time-${index}`}
                    type="time"
                    value={schedule.hora_fin || ""}
                    onChange={(e) => handleTimeChange(index, "hora_fin", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor={`duration-${index}`}>Duración Sesión</Label>
                  <Select
                    onValueChange={(value) => handleDurationChange(index, Number.parseInt(value))}
                    value={schedule.duracion_sesion ? String(schedule.duracion_sesion) : ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Duración" />
                    </SelectTrigger>
                    <SelectContent>
                      {[15, 30, 45, 60].map((duration) => (
                        <SelectItem key={duration} value={String(duration)}>
                          {duration} min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeScheduleBlock(index)}>
                Eliminar
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addScheduleBlock} className="add-block-button bg-transparent">
            Añadir Bloque de Horario
          </Button>
        </div>
        <DialogFooter className="work-hours-modal-footer">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Horario</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
