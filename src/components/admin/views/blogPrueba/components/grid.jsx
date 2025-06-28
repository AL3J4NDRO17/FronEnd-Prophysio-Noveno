
import { Edit, Trash2, ImageIcon, Plus } from "lucide-react"
import Swal from "sweetalert2"
import { EditButton, PublishButton, UnpublishButton, DeleteButton, SeePreviewButton } from '@uiButtons'

const BlogGrid = ({ blogs, categories, handleEdit, handleDelete, handleStatusChange, setIsModalOpen }) => {

  if (blogs.length === 0) {
    return (
      <div className="adminDashboard-blog-empty">
        <p>No se encontraron blogs</p>
        <button className="adminDashboard-secondary-button" onClick={() => setIsModalOpen(true)}>
          <Plus className="adminDashboard-button-icon" />
          Agregar Blogs
        </button>
      </div>
    )
  }

  return (
    <div className="blogAdmin-blog-grid">
      {blogs.map((blog) => (
        <div key={blog.id} className="blogAdmin-blog-card">
          <div className="blogAdmin-blog-card-image">
            {blog.bannerImage ? (
              <img src={blog.bannerImage || "/placeholder.svg"} alt={blog.title} />
            ) : (
              <div className="blogAdmin-blog-card-image-placeholder">
                <ImageIcon className="blogAdmin-icon" />
              </div>
            )}
            <div className={`blogAdmin-blog-status blogAdmin-blog-status-${blog.status}`}>
              {blog.status === "published" ? "Publicado" : "Borrador"}
            </div>
          </div>
          <div className="blogAdmin-blog-card-content">
            <div className="blogAdmin-blog-card-category">
              {categories.find((cat) => cat.id === Number(blog.categoryId))?.nombre || "Sin categoría"}
            </div>
            <h3 className="blogAdmin-blog-card-title">{blog.title}</h3>
            <p className="blogAdmin-blog-card-subtitle">{blog.effectsTitle}</p>
            <div className="blogAdmin-blog-card-meta">
              <span>{blog.author}</span>
              <span>•</span>
              <span>{new Date(blog.publishDate || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="blogAdmin-blog-card-actions">
            <button
              className="blogAdmin-icon-button-small"
              onClick={() => handleStatusChange(blog)}
              title={blog.status === "published" ? "Cambiar a borrador" : "Publicar"}
            >
              {blog.status === "published" ? <UnpublishButton /> : <PublishButton />}
            </button>
            <button className="blogAdmin-icon-button-small" onClick={() => handleEdit(blog)} title="Editar">
              <EditButton />
            </button>
            <button
              className="blogAdmin-icon-button-small"
              onClick={() => handleDelete(blog.id)}
              title="Eliminar"
            >
              <DeleteButton />
            </button>
            <button className="blogAdmin-icon-button-small" onClick={() => window.open(`/blog/${blog.id}`, "_blank")} title="Vista previa">
              <SeePreviewButton />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogGrid
