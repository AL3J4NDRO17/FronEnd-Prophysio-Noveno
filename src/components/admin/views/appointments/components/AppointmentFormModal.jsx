"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import "../styles/AppointmentFormModal.css"

const AppointmentFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    nombre_paciente: "",
    fecha_cita: "",
    hora_cita: "", // Campo separado para la hora
    // tipo_servicio eliminado
    estado: "pendiente", // Estado por defecto
    notas: "",
  })

  useEffect(() => {
    if (initialData) {
      // Si hay fecha_cita, separarla en fecha y hora para los inputs
      let fecha = ""
      let hora = ""
      if (initialData.fecha_cita) {
        const dateObj = new Date(initialData.fecha_cita)
        fecha = dateObj.toISOString().split("T")[0] // YYYY-MM-DD
        hora = dateObj.toTimeString().split(" ")[0].substring(0, 5) // HH:MM
      }
      setFormData({
        nombre_paciente: initialData.nombre_paciente || "",
        fecha_cita: fecha,
        hora_cita: hora,
        tipo_servicio: initialData.tipo_servicio || "",
        estado: initialData.estado || "pendiente",
        notas: initialData.notas || "",
      })
    } else {
      // Resetear para nueva cita
      setFormData({
        nombre_paciente: "",
        fecha_cita: "",
        hora_cita: "",
        // tipo_servicio eliminado
        estado: "pendiente",
        notas: "",
      })
    }
  }, [initialData, isOpen]) // Re-ejecutar si initialData o isOpen cambian

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.fecha_cita || !formData.hora_cita) {
      Swal.fire("Error", "La fecha y hora de la cita son obligatorias.", "error")
      return
    }
    // Combinar fecha y hora en un solo string ISO para enviar al backend
    const fechaHoraISO = new Date(`${formData.fecha_cita}T${formData.hora_cita}:00`).toISOString()

    onSave({ ...formData, fecha_cita: fechaHoraISO })
  }

  if (!isOpen) return null

  // Usaremos Swal para el modal, ya que el usuario lo mencionó para alertas.
  // Sin embargo, para un formulario complejo, un modal custom es mejor.
  // Aquí simulo un modal con HTML/CSS para mantener la estructura.
  return (
    <div className="AppointmentFormModal-overlay">
      <div className="AppointmentFormModal-content">
        <h2>{initialData ? "Editar Cita" : "Agendar Nueva Cita"}</h2>
        <form onSubmit={handleSubmit} className="AppointmentFormModal-form">
          <div className="AppointmentFormModal-formGroup">
            <label htmlFor="nombre_paciente">Nombre del Paciente</label>
            <input
              type="text"
              id="nombre_paciente"
              name="nombre_paciente"
              value={formData.nombre_paciente}
              onChange={handleChange}
              required
            />
          </div>
          <div className="AppointmentFormModal-formGroup">
            <label htmlFor="fecha_cita">Fecha de Cita</label>
            <input
              type="date"
              id="fecha_cita"
              name="fecha_cita"
              value={formData.fecha_cita}
              onChange={handleChange}
              required
            />
          </div>
          <div className="AppointmentFormModal-formGroup">
            <label htmlFor="hora_cita">Hora de Cita</label>
            <input
              type="time"
              id="hora_cita"
              name="hora_cita"
              value={formData.hora_cita}
              onChange={handleChange}
              required
            />
          </div>
          <div className="AppointmentFormModal-formGroup">
            <label htmlFor="estado">Estado</label>
            <select id="estado" name="estado" value={formData.estado} onChange={handleChange}>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
              <option value="completada">Completada</option>
              <option value="postergada">Postergada</option>
            </select>
          </div>
          <div className="AppointmentFormModal-formGroup">
            <label htmlFor="notas">Notas Adicionales</label>
            <textarea id="notas" name="notas" value={formData.notas} onChange={handleChange} rows="3"></textarea>
          </div>
          <div className="AppointmentFormModal-actions">
            <button type="submit" className="AppointmentFormModal-saveButton">
              Guardar
            </button>
            <button type="button" onClick={onClose} className="AppointmentFormModal-cancelButton">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppointmentFormModal
