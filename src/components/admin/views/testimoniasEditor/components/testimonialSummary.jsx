import { Check, Clock, Star } from "lucide-react"

const TestimonialsStats = ({ testimonials = [] }) => {
  // Calcular estadísticas
  const publishedCount = testimonials.filter((t) => t.estado === "published").length
  const pendingCount = testimonials.filter((t) => t.estado === "pending").length
  const averageRating =
    testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + (t.calificacion || 0), 0) / testimonials.length).toFixed(1)
      : "0.0"

  // Calcular distribución de calificaciones
  const ratingDistribution = [0, 0, 0, 0, 0] // Para 1-5 estrellas
  testimonials.forEach((t) => {
    if (t.calificacion && t.calificacion >= 1 && t.calificacion <= 5) {
      ratingDistribution[t.calificacion - 1]++
    }
  })

  return (
    <div className="adminDashboard-testimonials-stats-container">
      <div className="adminDashboard-testimonials-stats-row">
        <div className="adminDashboard-testimonials-stats-card">
          <div className="adminDashboard-testimonials-stats-header">
            <h3>Estado de testimonios</h3>
          </div>
          <div className="adminDashboard-testimonials-stats-content">
            <div className="adminDashboard-testimonials-stats-item">
              <div className="adminDashboard-testimonials-stats-icon adminDashboard-testimonials-stats-icon-success">
                <Check />
              </div>
              <div className="adminDashboard-testimonials-stats-info">
                <span className="adminDashboard-testimonials-stats-label">Publicados</span>
                <span className="adminDashboard-testimonials-stats-value">{publishedCount}</span>
              </div>
            </div>
            <div className="adminDashboard-testimonials-stats-item">
              <div className="adminDashboard-testimonials-stats-icon adminDashboard-testimonials-stats-icon-warning">
                <Clock />
              </div>
              <div className="adminDashboard-testimonials-stats-info">
                <span className="adminDashboard-testimonials-stats-label">Pendientes</span>
                <span className="adminDashboard-testimonials-stats-value">{pendingCount}</span>
              </div>
            </div>
            <div className="adminDashboard-testimonials-stats-item">
              <div className="adminDashboard-testimonials-stats-icon adminDashboard-testimonials-stats-icon-info">
                <Star />
              </div>
              <div className="adminDashboard-testimonials-stats-info">
                <span className="adminDashboard-testimonials-stats-label">Calificación promedio</span>
                <span className="adminDashboard-testimonials-stats-value">{averageRating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="adminDashboard-testimonials-stats-card">
          <div className="adminDashboard-testimonials-stats-header">
            <h3>Distribución de calificaciones</h3>
          </div>
          <div className="adminDashboard-testimonials-stats-content">
            <div className="adminDashboard-testimonials-rating-distribution">
              {ratingDistribution.map((count, index) => {
                const percentage = testimonials.length > 0 ? (count / testimonials.length) * 100 : 0

                return (
                  <div key={index} className="adminDashboard-testimonials-rating-bar-container">
                    <div className="adminDashboard-testimonials-rating-label">
                      <Star className="adminDashboard-testimonials-rating-star-small" />
                      <span>{index + 1}</span>
                    </div>
                    <div className="adminDashboard-testimonials-rating-bar">
                      <div
                        className="adminDashboard-testimonials-rating-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="adminDashboard-testimonials-rating-count">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialsStats

