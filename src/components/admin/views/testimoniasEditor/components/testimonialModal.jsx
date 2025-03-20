"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { CloseButton } from "@uiButtons"

const TestimonialModal = ({ isOpen, onClose, onSave, testimonial = null }) => {
  const [formData, setFormData] = useState({
    id_testimonio: null,
    nombre_usuario: "",
    comentarios: "",
    puntaje: 5,
    aprobado: false,
    id_usuario: null,
    creado_por_admin: true,
    id_cita: null,
  })

  useEffect(() => {
    if (testimonial) {
      setFormData({
        id_testimonio: testimonial.id_testimonio || null,
        nombre_usuario: testimonial.nombre_usuario || "",
        comentarios: testimonial.comentarios || "",
        puntaje: testimonial.puntaje || 5,
        aprobado: testimonial.aprobado || false,
        id_usuario: testimonial.id_usuario || null,
        creado_por_admin: testimonial.creado_por_admin !== undefined ? testimonial.creado_por_admin : true,
        id_cita: testimonial.id_cita || null,
      });
    } else {
      // ✅ Si no hay testimonial, limpiar formData
      setFormData({
        id_testimonio: null,
        nombre_usuario: "",
        comentarios: "",
        puntaje: 5,
        aprobado: false,
        id_usuario: null,
        creado_por_admin: true,
        id_cita: null,
      });
    }
  }, [testimonial, isOpen]); // ✅ También escucha cuando `isOpen` cambia


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, puntaje: rating }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="adminDashboard-testimonials-modal-overlay">
      <div className="adminDashboard-testimonials-modal">
        <div className="adminDashboard-testimonials-modal-header">
          <h2>{formData.id_testimonio ? "Editar Testimonio" : "Nuevo Testimonio"}</h2>
          <CloseButton onClick={onClose} />
        </div>

        <div className="adminDashboard-testimonials-modal-content">
          <form className="adminDashboard-testimonials-form" onSubmit={handleSubmit}>
            <div className="adminDashboard-testimonials-form-group">
              <label htmlFor="nombre_usuario">Nombre del cliente*</label>
              <input
                type="text"
                id="nombre_usuario"
                name="nombre_usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
                placeholder="Nombre completo"
              />
            </div>

            <div className="adminDashboard-testimonials-form-group">
              <label>Puntuación*</label>
              <div className="adminDashboard-testimonials-rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`adminDashboard-testimonials-rating-star ${star <= formData.puntaje ? "active" : ""}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    <Star />
                  </button>
                ))}
              </div>
            </div>

            <div className="adminDashboard-testimonials-form-group">
              <label htmlFor="comentarios">Testimonio*</label>
              <textarea
                id="comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Escribe aquí el testimonio del cliente..."
              ></textarea>
            </div>

            <div className="adminDashboard-testimonials-form-group">
              <div className="adminDashboard-testimonials-checkbox-group">
                <input
                  type="checkbox"
                  id="aprobado"
                  name="aprobado"
                  checked={formData.aprobado}
                  onChange={handleChange}
                />
                <label htmlFor="aprobado">Testimonio aprobado</label>
              </div>
            </div>

            <div className="adminDashboard-testimonials-form-group">
              <div className="adminDashboard-testimonials-checkbox-group">
                <input
                  type="checkbox"
                  id="creado_por_admin"
                  name="creado_por_admin"
                  checked={formData.creado_por_admin}
                  onChange={handleChange}
                />
                <label htmlFor="creado_por_admin">Creado por administrador</label>
              </div>
            </div>

            <div className="adminDashboard-testimonials-form-actions">
              <button type="button" className="adminDashboard-secondary-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="adminDashboard-primary-button">
                {formData.id_testimonio ? "Actualizar testimonio" : "Crear testimonio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TestimonialModal

