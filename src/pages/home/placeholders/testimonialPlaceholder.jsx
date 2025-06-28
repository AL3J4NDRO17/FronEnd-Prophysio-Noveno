import { MessageSquare, Star } from "lucide-react"
import "./testimonialPlaceholder.css" // Importa el CSS específico para el placeholder

export default function TestimonialsPlaceholder() {
  return (
    <div className="testimonials-placeholder">
      <div className="testimonials-placeholder-icon-group">
        <MessageSquare className="testimonials-placeholder-main-icon" />
        <Star className="testimonials-placeholder-star-icon star-1" />
        <Star className="testimonials-placeholder-star-icon star-2" />
        <Star className="testimonials-placeholder-star-icon star-3" />
        <Star className="testimonials-placeholder-star-icon star-4" />
      </div>

      <h2 className="testimonials-placeholder-title">¡Aún no hay testimonios aquí!</h2>
      <p className="testimonials-placeholder-message">
        Nuestros pacientes están por compartir sus maravillosas experiencias.
      </p>
      <p className="testimonials-placeholder-message sub">¡Vuelve pronto para leer sus historias!</p>
    </div>
  )
}
