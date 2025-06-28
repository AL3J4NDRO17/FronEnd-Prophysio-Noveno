"use client"
import { FaStar, FaRegStar } from "react-icons/fa" // Mantener para las tarjetas de testimonios existentes

import FadeInSection from "../../../utils/animations/fadeInSection"
import useTestimonials from "./hooks/useHomeTestimonial"
import "./testimonials.css"
import TestimonialsPlaceholder from "../placeholders/testimonialPlaceholder" // Importa el nuevo componente placeholder

const TestimonialsSection = () => {
  const { testimonios, loading } = useTestimonials()

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <FadeInSection>
          <div className="testimonials-header">
            <h2 className="testimonials-title">Lo que dicen nuestros pacientes</h2>
            <p className="testimonials-subtitle">
              Descubre las experiencias de quienes han confiado en nuestro centro de rehabilitación
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="testimonials-row">
            {loading ? (
              <p>Cargando testimonios...</p>
            ) : testimonios?.length === 0 ? (
              <TestimonialsPlaceholder /> // Renderiza el placeholder si no hay testimonios
            ) : (
              testimonios?.map((testimonial) => {
                const encodedName = encodeURIComponent(testimonial.nombre_usuario || "Paciente")
                const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}`

                return (
                  <article key={testimonial.id} className="testimonial-card">
                    <div className="testimonial-author">
                      <img
                        src={avatarUrl || "/placeholder.svg"}
                        alt={`Avatar de ${testimonial.nombre_usuario}`}
                        className="author-avatar"
                      />
                      <div className="author-info">
                        <span className="author-name">{testimonial.nombre_usuario}</span>
                      </div>
                    </div>
                    <div className="rating" aria-label={`Calificación: ${testimonial.puntaje} de 5 estrellas`}>
                      {[...Array(5)].map((_, i) =>
                        i < testimonial.puntaje ? (
                          <FaStar key={i} color="#FFD700" size={16} />
                        ) : (
                          <FaRegStar key={i} color="#FFD700" size={16} />
                        ),
                      )}
                    </div>

                    <div className="testimonial-footer">
                      <div className="testimonial-content">
                        <p>"{testimonial.comentarios}"</p>
                      </div>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

export default TestimonialsSection
