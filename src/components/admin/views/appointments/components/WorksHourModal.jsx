"use client"

import { useState, useEffect } from "react"
import { Button } from "@Button"
import { Checkbox } from "@Checkbox"
import { Input } from "@Input"
import { Label } from "@Label"

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const DAY_TRANSLATIONS = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
}

const WorkHoursModal = ({ isOpen, onClose, currentWorkHours, onSave }) => {
  const [selectedDays, setSelectedDays] = useState(currentWorkHours.days || [])
  const [startTime, setStartTime] = useState(currentWorkHours.startTime || "09:00")
  const [endTime, setEndTime] = useState(currentWorkHours.endTime || "18:00")

  useEffect(() => {
    setSelectedDays(currentWorkHours.days || [])
    setStartTime(currentWorkHours.startTime || "09:00")
    setEndTime(currentWorkHours.endTime || "18:00")
  }, [currentWorkHours, isOpen])

  const handleDayToggle = (day) => {
    setSelectedDays((prevDays) => (prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]))
  }

  const handleSave = () => {
    // Basic validation
    if (selectedDays.length === 0) {
      alert("Debe seleccionar al menos un día laboral.")
      return
    }
    if (!startTime || !endTime) {
      alert("Debe especificar hora de inicio y fin.")
      return
    }
    if (startTime >= endTime) {
      alert("La hora de inicio debe ser anterior a la hora de fin.")
      return
    }
    onSave({ days: selectedDays, startTime, endTime })
  }

  if (!isOpen) return null

  return (
    <div className="appointmentsAdmin-modal-overlay">
      <div className="appointmentsAdmin-modal" style={{ maxWidth: "600px" }}>
        <div className="appointmentsAdmin-modal-header">
          <h2 className="appointmentsAdmin-modal-title">Ajustar Horario Laboral</h2>
          <p className="appointmentsAdmin-modal-description">
            Define los días y el rango horario en que se pueden agendar citas.
          </p>
        </div>
        <div className="appointmentsAdmin-modal-content">
          <div className="appointmentsAdmin-form-group" style={{ gridTemplateColumns: "1fr", gap: "1rem" }}>
            <Label className="appointmentsAdmin-form-label" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
              Días Laborales:
            </Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {ALL_DAYS.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label htmlFor={`day-${day}`} className="font-normal">
                    {DAY_TRANSLATIONS[day]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div
            className="appointmentsAdmin-form-group"
            style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "end" }}
          >
            <div>
              <Label htmlFor="startTime" className="appointmentsAdmin-form-label" style={{ textAlign: "left" }}>
                Hora Inicio:
              </Label>
              <Input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="appointmentsAdmin-form-input"
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="appointmentsAdmin-form-label" style={{ textAlign: "left" }}>
                Hora Fin:
              </Label>
              <Input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="appointmentsAdmin-form-input"
              />
            </div>
          </div>
        </div>
        <div className="appointmentsAdmin-modal-footer">
          <Button variant="outline" onClick={onClose} className="appointmentsAdmin-btn appointmentsAdmin-btn-outline">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="appointmentsAdmin-btn appointmentsAdmin-btn-primary">
            Guardar Horario
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WorkHoursModal
