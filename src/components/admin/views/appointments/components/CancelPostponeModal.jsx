"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import "../styles/CancelPostponeModal.css"

// Alinear con el orden que funciona para el usuario: Lunes (0) a Domingo (6)
const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const SPANISH_DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const isSlotWithinWorkHours = (dateTime, clinicWorkHours, appointmentDuration) => {
  const selectedDate = new Date(dateTime)
  const selectedDayIndex = selectedDate.getDay()
  const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[selectedDayIndex]

  const daySchedules = clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameEnglish)

  if (daySchedules.length === 0) {
    Swal.fire("Error", `La clínica no trabaja los ${SPANISH_DAYS_OF_WEEK[selectedDayIndex]}s.`, "error")
    return false
  }

  const newAppStartTime = selectedDate.getTime()
  let isWithinWorkHours = false
  let isDuringLunchBreak = false // Nuevo flag para la hora de comida

  for (const schedule of daySchedules) {
    const workStartTimeParts = schedule.hora_inicio.split(":").map(Number)
    const workEndTimeParts = schedule.hora_fin.split(":").map(Number)

    const workStartDateTime = new Date(selectedDate)
    workStartDateTime.setHours(workStartTimeParts[0], workStartTimeParts[1], 0, 0)

    const workEndDateTime = new Date(selectedDate)
    workEndDateTime.setHours(workEndTimeParts[0], workEndTimeParts[1], 0, 0)

    // Check if the new appointment's start time falls within this schedule block
    if (newAppStartTime >= workStartDateTime.getTime() && newAppStartTime < workEndDateTime.getTime()) {
      const newAppEndTime = newAppStartTime + appointmentDuration * 60 * 1000

      // Verificar si la cita se superpone con la hora de comida
      if (schedule.hora_comida_inicio && schedule.hora_comida_fin) {
        const [lunchStartH, lunchStartM] = schedule.hora_comida_inicio.split(":").map(Number)
        const [lunchEndH, lunchEndM] = schedule.hora_comida_fin.split(":").map(Number)
        const lunchStartDateTime = new Date(selectedDate)
        lunchStartDateTime.setHours(lunchStartH, lunchStartM, 0, 0)
        const lunchEndDateTime = new Date(selectedDate)
        lunchEndDateTime.setHours(lunchEndH, lunchEndM, 0, 0)

        if (
          (newAppStartTime < lunchEndDateTime.getTime() && newAppEndTime > lunchStartDateTime.getTime()) ||
          newAppStartTime === lunchStartDateTime.getTime() ||
          newAppEndTime === lunchEndDateTime.getTime()
        ) {
          isDuringLunchBreak = true
          break
        }
      }

      if (newAppEndTime <= workEndDateTime.getTime()) {
        isWithinWorkHours = true
        break
      }
    }
  }

  if (isDuringLunchBreak) {
    Swal.fire("Error", "La nueva fecha y hora caen dentro de la hora de comida de la clínica.", "error")
    return false
  }

  if (!isWithinWorkHours) {
    Swal.fire(
      "Error",
      "La nueva fecha y hora están fuera del horario laboral de la clínica para este día o la duración excede el bloque.",
      "error",
    )
    return false
  }
  return true
}

const CancelPostponeModal = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentFechaHora,
  mode,
  clinicWorkHours,
  appointmentDuration,
}) => {
  const [motivo, setMotivo] = useState("")
  const [nuevaFecha, setNuevaFecha] = useState("")
  const [nuevaHora, setNuevaHora] = useState("")

  useEffect(() => {
    setMotivo("")
    setNuevaFecha("")
    setNuevaHora("")
  }, [isOpen, mode])

  const handleSubmit = async () => {
    if (!motivo) {
      Swal.fire("Error", "El motivo es obligatorio.", "error")
      return
    }
    if (mode === "postpone") {
      if (!nuevaFecha || !nuevaHora) {
        Swal.fire("Error", "La nueva fecha y hora son obligatorias para postergar.", "error")
        return
      }

      const combinedNewDateTime = `${nuevaFecha}T${nuevaHora}:00`
      const newAppointmentDateTime = new Date(combinedNewDateTime)

      if (newAppointmentDateTime < new Date(appointmentFechaHora)) {
        Swal.fire("Error", "La nueva fecha no puede ser anterior a la fecha original de la cita.", "error")
        return
      }

      // Validar que el nuevo slot esté dentro del horario laboral
      if (!isSlotWithinWorkHours(newAppointmentDateTime, clinicWorkHours, appointmentDuration)) {
        return
      }

      onConfirm({ motivo, nuevaFecha: newAppointmentDateTime.toISOString() })
    } else {
      onConfirm({ motivo })
    }
  }

  if (!isOpen) return null

  const title = mode === "cancel" ? "Cancelar Cita" : "Postergar Cita"
  const confirmButtonText = mode === "cancel" ? "Sí, Cancelar Cita" : "Sí, Postergar Cita"

  return (
    <div className="CancelPostponeModal-overlay">
      <div className={`CancelPostponeModal-content CancelPostponeModal-content--${mode}`}>
        <h2>{title}</h2>
        <div className="CancelPostponeModal-formGroup">
          <label htmlFor="motivo">Motivo:</label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows="3"
            placeholder={mode === "cancel" ? "Ej: Paciente solicitó cancelación..." : "Ej: Terapeuta no disponible..."}
            required
          />
        </div>

        {mode === "postpone" && (
          <>
            <div className="CancelPostponeModal-formGroup">
              <label htmlFor="nuevaFecha">Nueva Fecha:</label>
              <input
                type="date"
                id="nuevaFecha"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
                required
              />
            </div>
            <div className="CancelPostponeModal-formGroup">
              <label htmlFor="nuevaHora">Nueva Hora:</label>
              <input
                type="time"
                id="nuevaHora"
                value={nuevaHora}
                onChange={(e) => setNuevaHora(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="CancelPostponeModal-actions">
          <button onClick={handleSubmit} className="CancelPostponeModal-confirmButton">
            {confirmButtonText}
          </button>
          <button onClick={onClose} className="CancelPostponeModal-cancelButton">
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}
export default CancelPostponeModal
