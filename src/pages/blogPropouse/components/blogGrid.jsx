"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCategories } from "../hooks/useClientCategories"
import "../styles/blogGrid.css"
import EmptyBlogState from "./empty/emptyBlogGrid"
export default function BlogGrid({ blogs = [] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const postsPerPage = 6
  const { categories } = useCategories()

  // Filtrar solo los blogs que están publicados
  const publishedBlogs = blogs.filter((blog) => blog.status === "published")

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = publishedBlogs.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(publishedBlogs.length / postsPerPage)

  // Función para obtener el nombre de la categoría por ID
  const getCategoryName = (categoryId) => {
    const category = categories?.find((cat) => cat.id === categoryId)
    return category ? category.nombre : "Sin categoría"
  }

  if (!publishedBlogs.length) {
    return <EmptyBlogState />
  }
  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '',); // Esto elimina todas las etiquetas HTML
  }

  return (
    <div className="blog-grid-container">
      <div className="tech_blog_posts_grid">

        {currentPosts.map((post) => (

          <article key={post.id} className="tech_blog_post_card">
            <img src={post.bannerImage || "/placeholder.svg"} alt={post.title} className="tech_blog_post_image" />
            <div className="tech_blog_post_content">
              <div className="tech_blog_post_meta">
                <span className="tech_blog_post_date">{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="tech_blog_post_category">{getCategoryName(post.categoryId)}</span>
              </div>
              <h3 dangerouslySetInnerHTML={{ __html: post.title || "" }}></h3>
              <p className="tech_blog_post_excerpt">
                {`${stripHtmlTags(post.mainContent).substring(0, 150)} ${stripHtmlTags(post.effectsContent).substring(0, 150)}`}
              </p>
              <div className="tech_blog_post_footer">
                <p className="tech_blog_post_author">Por: {post.author}</p>
              </div>
              <button onClick={() => navigate(`/blog/${post.id}`)} className="read-more-button">
                Leer más
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ⬅ Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente ➡
        </button>
      </div>
    </div>
  )
}

