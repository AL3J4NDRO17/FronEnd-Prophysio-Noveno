"use client"

import { useState } from "react"
import { Button } from "../../public_ui/button"
import { Input } from "../../public_ui/input"
import { Label } from "../../public_ui/label"
import { toast } from "react-toastify"
import "../styles/CancelPostponeModal.css" // Asegúrate de tener este archivo CSS para estilos personalizados

export default function CancelPostponeModal({ isOpen, onClose, onConfirm, appointmentDate, mode, workHours }) {
  const [motivo, setMotivo] = useState("")
  const [nuevaFecha, setNuevaFecha] = useState("")
  const [nuevaHora, setNuevaHora] = useState("")

  if (!isOpen) return null

  const handleSubmit = () => {
    if (mode === "cancel") {
      if (!motivo) {
        toast.error("Por favor, ingrese un motivo para la cancelación.")
        return
      }
      onConfirm({ motivo })
    } else if (mode === "postpone") {
      if (!motivo || !nuevaFecha || !nuevaHora) {
        toast.error("Por favor, complete todos los campos para postergar la cita.")
        return
      }
      const combinedDateTime = `${nuevaFecha}T${nuevaHora}:00`
      onConfirm({ motivo, nuevaFecha: combinedDateTime })
    }
  }

  return (
    <div className="CancelPostponeModal-overlay">
      <div
        className={`CancelPostponeModal-content ${mode === "postpone" ? "CancelPostponeModal-content--postpone" : ""}`}
      >
        <h2>{mode === "cancel" ? "¿Cancelar Cita?" : "¿Postergar Cita?"}</h2>
        <div className="CancelPostponeModal-formGroup">
          <Label htmlFor="motivo">Motivo:</Label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={
              mode === "cancel" ? "Ingrese el motivo de la cancelación" : "Ingrese el motivo de la postergación"
            }
          ></textarea>
        </div>
        {mode === "postpone" && (
          <>
            <div className="CancelPostponeModal-formGroup">
              <Label htmlFor="nuevaFecha">Nueva Fecha:</Label>
              <Input type="date" id="nuevaFecha" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} />
            </div>
            <div className="CancelPostponeModal-formGroup">
              <Label htmlFor="nuevaHora">Nueva Hora:</Label>
              <Input type="time" id="nuevaHora" value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)} />
            </div>
            <p className="publicAppointment-text-xs publicAppointment-text-tertiary">
              Horario de atención: {workHours.startTime} - {workHours.endTime} de {workHours.days.join(", ")}.
            </p>
          </>
        )}
        <div className="CancelPostponeModal-actions">
          <Button className="CancelPostponeModal-cancelButton" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="CancelPostponeModal-confirmButton" onClick={handleSubmit}>
            {mode === "cancel" ? "Confirmar Cancelación" : "Confirmar Postergación"}
          </Button>
        </div>
      </div>
    </div>
  )
}
