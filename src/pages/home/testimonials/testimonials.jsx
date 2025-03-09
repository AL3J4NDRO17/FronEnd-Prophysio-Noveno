"use client"
import { Star } from "lucide-react"
import FadeInSection from "../../../utils/animations/fadeInSection"
import "./testimonials.css"

const testimonials = [
  {
    id: 1,
    content:
      "Después de mi lesión deportiva, pensé que no podría volver a jugar. Gracias al equipo de rehabilitación, no solo me recuperé, sino que regresé más fuerte que antes.",
    author: "Carlos Rodríguez",
    detail: "Deportista Profesional",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    content:
      "Después de mi lesión deportiva, pensé que no podría volver a jugar. Gracias al equipo de rehabilitación, no solo me recuperé, sino que regresé más fuerte que antes.",
    author: "Carlos Rodríguez",
    detail: "Deportista Profesional",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    content:
      "Después de mi lesión deportiva, pensé que no podría volver a jugar. Gracias al equipo de rehabilitación, no solo me recuperé, sino que regresé más fuerte que antes.",
    author: "Carlos Rodríguez",
    detail: "Deportista Profesional",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    content:
      "Después de mi lesión deportiva, pensé que no podría volver a jugar. Gracias al equipo de rehabilitación, no solo me recuperé, sino que regresé más fuerte que antes.",
    author: "Carlos Rodríguez",
    detail: "Deportista Profesional",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    content:
      "Después de mi lesión deportiva, pensé que no podría volver a jugar. Gracias al equipo de rehabilitación, no solo me recuperé, sino que regresé más fuerte que antes.",
    author: "Carlos Rodríguez",
    detail: "Deportista Profesional",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  // ... (otros testimonios)
]

const TestimonialsSection = () => {
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
            {testimonials.map((testimonial) => (
              <article key={testimonial.id} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-footer">
                  <div className="testimonial-author">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={`Avatar de ${testimonial.author}`}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <span className="author-name">{testimonial.author}</span>
                      <span className="author-detail">{testimonial.detail}</span>
                    </div>
                  </div>
                  <div className="rating" aria-label={`Calificación: ${testimonial.rating} de 5 estrellas`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={i < testimonial.rating ? "filled" : ""} size={16} />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

export default TestimonialsSection

