export default function TestimonialsList() {
    const testimonials = [
      {
        initials: "CM",
        name: "Carlos Mendoza",
        text: "El tratamiento que recibí fue excelente. Después de solo 5 sesiones, mi dolor de espalda desapareció por completo. Recomiendo ampliamente este centro.",
      },
      {
        initials: "RL",
        name: "Rosa López",
        text: "Increíble atención personalizada. Los terapeutas son muy profesionales y atentos a cada detalle. Mi recuperación fue mucho más rápida de lo esperado.",
      },
    ]
  
    return (
      <div className="adminDashboard-card">
        <div className="adminDashboard-card-header-full">
          <h3 className="adminDashboard-card-title-large">Testimonios destacados</h3>
          <p className="adminDashboard-card-description">Lo que dicen nuestros pacientes</p>
        </div>
        <div className="adminDashboard-card-content-full">
          <div className="adminDashboard-testimonials-list">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="adminDashboard-testimonial-item">
                <div className="adminDashboard-testimonial-header">
                  <div className="adminDashboard-avatar">
                    <div className="adminDashboard-avatar-fallback">{testimonial.initials}</div>
                  </div>
                  <div>
                    <p className="adminDashboard-testimonial-name">{testimonial.name}</p>
                    <div className="adminDashboard-rating">
                      {[...Array(5)].map((_, starIndex) => (
                        <svg key={starIndex} className="adminDashboard-star" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="adminDashboard-testimonial-text">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="adminDashboard-card-footer">
          <button className="adminDashboard-text-button adminDashboard-text-button-full">
            Ver todos los testimonios
          </button>
        </div>
      </div>
    )
  }
  
  