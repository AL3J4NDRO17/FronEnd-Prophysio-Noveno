"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import "../styles/CancelPostponeModal.css"

const isSlotWithinWorkHours = (dateTime, workHoursConfig) => {
  const selectedDay = new Date(dateTime).getDay() // 0 for Sunday, 1 for Monday, etc.
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDay]

  if (!workHoursConfig.days.includes(dayName)) {
    Swal.fire("Error", `La clínica no trabaja los ${dayName}s.`, "error")
    return false
  }

  const newAppTime = new Date(dateTime).getTime()

  const workStartTimeParts = workHoursConfig.startTime.split(":")
  const workEndTimeParts = workHoursConfig.endTime.split(":")

  const workStartDateTime = new Date(dateTime)
  workStartDateTime.setHours(Number.parseInt(workStartTimeParts[0]), Number.parseInt(workStartTimeParts[1]), 0, 0)

  const workEndDateTime = new Date(dateTime)
  workEndDateTime.setHours(Number.parseInt(workEndTimeParts[0]), Number.parseInt(workEndTimeParts[1]), 0, 0)

  // For simplicity, just checking start time. A full check would consider duration.
  if (newAppTime < workStartDateTime.getTime() || newAppTime >= workEndDateTime.getTime()) {
    Swal.fire(
      "Error",
      `La nueva hora está fuera del horario laboral (${workHoursConfig.startTime} - ${workHoursConfig.endTime}).`,
      "error",
    )
    return false
  }
  return true
}

const CancelPostponeModal = ({ isOpen, onClose, onConfirm, appointmentDate, mode, workHours }) => {
  const [motivo, setMotivo] = useState("")
  const [nuevaFecha, setNuevaFecha] = useState("")
  const [nuevaHora, setNuevaHora] = useState("")

  useEffect(() => {
    // Resetear campos cuando el modal se abre o cambia el modo
    setMotivo("")
    setNuevaFecha("")
    setNuevaHora("")
  }, [isOpen, mode])

  const handleSubmit = async () => {
    if (!motivo) {
      Swal.fire("Error", "El motivo es obligatorio.", "error")
      return
    }
    if (mode === "postpone" && (!nuevaFecha || !nuevaHora)) {
      Swal.fire("Error", "La nueva fecha y hora son obligatorias para postergar.", "error")
      return
    }

    const details = { motivo }
    if (mode === "postpone") {
      const fechaHoraISO = new Date(`${nuevaFecha}T${nuevaHora}:00`).toISOString()
      details.nuevaFecha = fechaHoraISO

      // Validar que la nueva fecha no sea anterior a la fecha original de la cita
      if (new Date(details.nuevaFecha) < new Date(appointmentDate)) {
        Swal.fire("Error", "La nueva fecha no puede ser anterior a la fecha original de la cita.", "error")
        return
      }

      if (!isSlotWithinWorkHours(details.nuevaFecha, workHours)) {
        return // Stop if not within work hours
      }
    }

    onConfirm(details)
  }

  if (!isOpen) return null

  const title = mode === "cancel" ? "Cancelar Cita" : "Postergar Cita"
  const confirmButtonText = mode === "cancel" ? "Sí, Cancelar Cita" : "Sí, Postergar Cita"

  // Usaremos un modal custom simple para este formulario
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
