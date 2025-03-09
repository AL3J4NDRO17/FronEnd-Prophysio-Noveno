import React from 'react'
import { Edit, Trash2, ImageIcon } from 'lucide-react'

export default function BlogGrid({ blogs, categories, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="blogAdmin-grid">
      {blogs.map((blog) => (
        <div key={blog.id} className="blogAdmin-card">
          <div className="blogAdmin-card-image">
            {blog.bannerImage ? (
              <img src={blog.bannerImage || "/placeholder.svg"} alt={blog.title} />
            ) : (
              <div className="blogAdmin-card-image-placeholder">
                <ImageIcon className="blogAdmin-icon" />
              </div>
            )}
            <div className={`blogAdmin-blog-status blogAdmin-blog-status-${blog.status}`}>
              {blog.status === "published" ? "Published" : "Draft"}
            </div>
          </div>
          <div className="blogAdmin-card-content">
            <div className="blogAdmin-card-category">
              {categories.find(cat => cat.id === Number(blog.categoryId))?.nombre || "Uncategorized"}
            </div>
            <h3 className="blogAdmin-card-title">{blog.title}</h3>
            <p className="blogAdmin-card-subtitle">{blog.effectsTitle}</p>
            <div className="blogAdmin-card-meta">
              <span>{blog.author}</span>
              <span>•</span>
              <span>{new Date(blog.publishDate || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="blogAdmin-card-actions">
            <button
              className="blogAdmin-icon-button-small"
              onClick={() => onStatusChange(blog)}
              title={blog.status === "published" ? "Change to draft" : "Publish"}
            >
              {blog.status === "published" ? (
                <Edit className="blogAdmin-icon-small" />
              ) : (
                <ImageIcon className="blogAdmin-icon-small" />
              )}
            </button>
            <button
              className="blogAdmin-icon-button-small"
              onClick={() => onEdit(blog)}
              title="Edit"
            >
              <Edit className="blogAdmin-icon-small" />
            </button>
            <button
              className="blogAdmin-icon-button-small"
              onClick={() => onDelete(blog.id)}
              title="Delete"
            >
              <Trash2 className="blogAdmin-icon-small" />
            </button>
            <button
              className="blogAdmin-icon-button-small"
              onClick={() => window.open(`/blog/${blog.id}`, "_blank")}
              title="Preview"
            >
              <ImageIcon className="blogAdmin-icon-small" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
