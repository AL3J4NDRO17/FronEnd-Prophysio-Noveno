import { Link } from "react-router-dom"
import { Search } from 'lucide-react'

export default function RecentPostsSidebar({ recentPosts = [] }) {
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.round(diffMs / (1000 * 60))
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 60) {
      return `Última actualización ${diffMinutes} min Hoy`
    } else if (diffHours < 24) {
      return `Última actualización ${diffHours} hr Hoy`
    } else if (diffDays === 1) {
      return `Publicado a las ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} Ayer`
    } else {
      return `Publicado el ${date.toLocaleDateString()}`
    }
  }

  return (
    <div className="recent-posts-sidebar-container">
      <div className="recent-posts-search-container">
        <Search className="recent-posts-search-icon" />
        <input type="text" placeholder="Buscar publicaciones" className="recent-posts-search-input" />
      </div>

      <h2 className="recent-posts-title">PUBLICACIONES RECIENTES</h2>
      <ul className="recent-posts-list">
        {recentPosts.map((post) => (
          <li key={post.id} className="recent-posts-item">
            <Link to={`/blog/${post.id}`} className="recent-posts-link">
              <h3 className="recent-posts-item-title" dangerouslySetInnerHTML={{ __html: post.title  }} />
              <p className="recent-posts-item-meta">{formatRelativeTime(post.createdAt)}</p>
            </Link>
          </li>
        ))}
      </ul>
      <button className="recent-posts-view-more-button">VER MÁS PUBLICACIONES</button>
    </div>
  )
}
