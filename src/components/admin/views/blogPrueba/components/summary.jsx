import { CheckCircle, Clock } from "lucide-react"

export default function BlogSummary({ blogs = [] }) {
  // Calculate statistics
  const published = blogs.filter((blog) => blog.status === "published").length
  const drafts = blogs.filter((blog) => blog.status === "draft").length
  const scheduled = blogs.filter((blog) => blog.status === "scheduled").length

  // Calculate recent posts (example timeframes)
  const today = new Date()
  const thisWeek = blogs.filter((blog) => {
    const postDate = new Date(blog.publishDate)
    return postDate >= new Date(today.setDate(today.getDate() - 7))
  }).length

  const thisMonth = blogs.filter((blog) => {
    const postDate = new Date(blog.publishDate)
    return postDate.getMonth() === today.getMonth()
  }).length

  const total = blogs.length

  return (
    <div className="blogAdmin-summary-container">
      <div className="blogAdmin-summary-card">
        <h3 className="blogAdmin-summary-title">Estado de publicaciones</h3>
        <div className="blogAdmin-summary-list">
          <div className="blogAdmin-summary-item">
            <div className="blogAdmin-summary-item-icon published">
              <CheckCircle size={20} />
            </div>
            <span className="blogAdmin-summary-item-label">Publicados</span>
            <span className="blogAdmin-summary-item-value">{published}</span>
          </div>
          <div className="blogAdmin-summary-item">
            <div className="blogAdmin-summary-item-icon draft">
              <Clock size={20} />
            </div>
            <span className="blogAdmin-summary-item-label">Borradores</span>
            <span className="blogAdmin-summary-item-value">{drafts}</span>
          </div>
          <div className="blogAdmin-summary-item">
            <div className="blogAdmin-summary-item-icon scheduled">
              <Clock size={20} />
            </div>
            <span className="blogAdmin-summary-item-label">Programados</span>
            <span className="blogAdmin-summary-item-value">{scheduled}</span>
          </div>
        </div>
      </div>

      <div className="blogAdmin-summary-card">
        <h3 className="blogAdmin-summary-title">Resumen de actividad</h3>
        <div className="blogAdmin-summary-list">
          <div className="blogAdmin-summary-item">
            <div className="blogAdmin-summary-item-icon total">
              <CheckCircle size={20} />
            </div>
            <span className="blogAdmin-summary-item-label">Total posts</span>
            <span className="blogAdmin-summary-item-value">{total}</span>
          </div>
          <div className="blogAdmin-summary-item">
            <div className="blogAdmin-summary-item-icon week">
              <Clock size={20} />
            </div>
            <span className="blogAdmin-summary-item-label">Esta semana</span>
            <span className="blogAdmin-summary-item-value">{thisWeek}</span>
          </div>
          <div className="blogAdmin-summary-item">
            <div className="blogAdmin-summary-item-icon month">
              <Clock size={20} />
            </div>
            <span className="blogAdmin-summary-item-label">Este mes</span>
            <span className="blogAdmin-summary-item-value">{thisMonth}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

