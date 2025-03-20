"use client"

import { Plus } from "lucide-react"
import TestimonialCard from "./testimonialCard"
import AdminLoader from "@uiLoader"

const TestimonialsList = ({ testimonials, isLoading, onEdit, onDelete, onToggleAprobado, onAddNew }) => {

  if (isLoading) {
    return <AdminLoader text="Cargando testimonios" />
  }

  if (testimonials.length === 0) {
    return (
      <div className="adminDashboard-testimonials-empty">
        <p>No se encontraron testimonios</p>
        <button className="adminDashboard-secondary-button" onClick={onAddNew}>
          <Plus className="adminDashboard-button-icon" />
          Agregar testimonio
        </button>
      </div>
    )
  }

  return (
    <div className="adminDashboard-testimonials-grid">
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id_testimonio}
          testimonial={testimonial}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAprobado={onToggleAprobado}  // ✅ Ahora se está pasando correctamente
        />


      ))}
    </div>
  )
}

export default TestimonialsList

