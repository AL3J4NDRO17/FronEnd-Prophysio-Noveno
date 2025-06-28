"use client"

import "../styles/blogRecentPosts.css"
import { useBlogs } from "../hooks/useClientBlog"
import { useNavigate } from "react-router-dom"
import { FileText } from "lucide-react" // Importa un icono de Lucide React

export default function BlogRecentPosts() {
  const { blogs, isLoading, error } = useBlogs()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="blog-recent-posts">
        <h2 className="recent-posts-title">Post Recientes</h2>
        <div className="no-recent-posts-placeholder">
          <FileText className="lucide-icon" size={48} />
          <p>Cargando posts recientes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-recent-posts">
        <h2 className="recent-posts-title">Post Recientes</h2>
        <div className="no-recent-posts-placeholder">
          <FileText className="lucide-icon" size={48} />
          <p>Error al cargar posts recientes.</p>
        </div>
      </div>
    )
  }

  const recentPosts =
    blogs
      ?.filter((blog) => blog.status !== "draft") // Filtra los blogs con estado 'draft'
      .slice() // Hace una copia para evitar mutaciones en el array original
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Ordena por fecha de creación
      .slice(0, 3) || [] // Obtiene los 3 más recientes y asegura que sea un array
  // Nota: Se añadió .getTime() para asegurar la comparación numérica de fechas.

  if (recentPosts.length === 0) {
    return (
      <section className="blog-recent-posts">
        <h2 className="recent-posts-title">Post Recientes</h2>
        <div className="no-recent-posts-placeholder">
          <FileText className="lucide-icon" size={48} />
          <p>No hay posts recientes disponibles en este momento.</p>
        </div>
      </section>
    )
  }

  function stripHtmlTags(str) {
    return str ? str.replace(/<[^>]*>/g, "") : "" // Esto elimina todas las etiquetas HTML y maneja undefined/null
  }

  return (
    <section className="blog-recent-posts">
      <h2 className="recent-posts-title">Post Recientes</h2>
      <ul className="recent-posts-list">
        {recentPosts.map((post, index) => (
          <li
            key={post.id}
            className="recent-post-item"
            onClick={() => navigate(`/blog/${post.id}`)}
            style={{ cursor: "pointer" }}
          >
            <span className="post-number">{index + 1}</span>
            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-meta">
                {stripHtmlTags(post.mainContent)
                  ? `${stripHtmlTags(post.mainContent).substring(0, 100)}...`
                  : "No disponible"}
              </p>

              <p className="post-meta">
                {post.category} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
