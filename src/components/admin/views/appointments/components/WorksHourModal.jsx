"use client"

import { useState, useEffect } from "react"
// ¡IMPORTANTE! Asegúrate de que estos alias (@dialog, @button, etc.)
// estén correctamente configurados en tu tsconfig.json o next.config.mjs
// para que apunten a la ubicación real de tus componentes de UI.
// Basado en tu archivo dialog-zyKweK6gjovxcpBc2eNryyj7NJHArs.jsx,
// estos alias deben apuntar a tu implementación personalizada.
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@dialog"
import { Button } from "@button"
import { Input } from "@input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@select"
import { Label } from "@label"
import "../styles/WorkHoursModal.css"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"

const generateDaysOfWeekOptions = () => {
  const options = []
  const mondayRef = new Date("2021-01-04T12:00:00Z") // Lunes de referencia

  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayRef)
    date.setDate(mondayRef.getDate() + i)

    options.push({
      value: format(date, "EEEE", { locale: enUS }),
      label: format(date, "EEEE", { locale: es }),
    })
  }
  return options
}

const daysOfWeek = generateDaysOfWeekOptions()

export default function WorkHoursModal({ isOpen, onClose, currentWorkHours, onSave }) {
  console.log("WorkHoursModal: Prop isOpen =", isOpen) // Mantener para depuración

  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    if (isOpen && currentWorkHours) {
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
        hora_comida_inicio: h.hora_comida_inicio || null,
        hora_comida_fin: h.hora_comida_fin || null,
      }))
      setSchedules(mappedHours)
    }
  }, [isOpen, currentWorkHours])

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
    setSchedules([
      ...schedules,
      {
        id: null,
        dia: undefined,
        hora_inicio: "",
        hora_fin: "",
        hora_comida_inicio: null,
        hora_comida_fin: null,
        duracion_sesion: "",
      },
    ])
  }

  const removeScheduleBlock = (index) => {
    const newSchedules = schedules.filter((_, i) => i !== index)
    setSchedules(newSchedules)
  }

  const handleSave = () => {
    const isValid = schedules.every((s) => {
      if (!s.dia || !s.hora_inicio || !s.hora_fin || s.duracion_sesion === undefined || s.duracion_sesion === "") {
        return false
      }
      if ((s.hora_comida_inicio && !s.hora_comida_fin) || (!s.hora_comida_inicio && s.hora_comida_fin)) {
        return false
      }
      return true
    })

    if (!isValid) {
      alert(
        "Por favor, completa todos los campos obligatorios de los horarios y asegúrate de que las horas de comida estén completas o vacías.",
      )
      return
    }

    const schedulesToSave = schedules.map((s) => ({
      ...s,
      hora_comida_inicio: s.hora_comida_inicio === "" ? null : s.hora_comida_inicio,
      hora_comida_fin: s.hora_comida_fin === "" ? null : s.hora_comida_fin,
    }))

    onSave(schedulesToSave)
  }

  if (!isOpen) return null

  return (
    // ¡CAMBIO CLAVE AQUÍ! Volvemos a usar isOpen y onClose para tu Dialog personalizado
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
                  <Label htmlFor={`lunch-start-time-${index}`}>Comida Inicio (Opcional)</Label>
                  <Input
                    id={`lunch-start-time-${index}`}
                    type="time"
                    value={schedule.hora_comida_inicio || ""}
                    onChange={(e) => handleTimeChange(index, "hora_comida_inicio", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor={`lunch-end-time-${index}`}>Comida Fin (Opcional)</Label>
                  <Input
                    id={`lunch-end-time-${index}`}
                    type="time"
                    value={schedule.hora_comida_fin || ""}
                    onChange={(e) => handleTimeChange(index, "hora_comida_fin", e.target.value)}
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
