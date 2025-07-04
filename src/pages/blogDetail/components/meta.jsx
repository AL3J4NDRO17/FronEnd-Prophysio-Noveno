"use client"

import { Eye, Heart, Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export default function BlogMeta({
  blog,
  categoryName,
  liked,
  handleLike,
  showShareOptions,
  setShowShareOptions,
  handleShare,
}) {
  const formatPublishDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="publicBlogDetail-meta">
      <div className="publicBlogDetail-meta-info">
        <span className="publicBlogDetail-author">Por {blog.author}</span>
        <span className="publicBlogDetail-separator">•</span>
        <span className="publicBlogDetail-date">{formatPublishDate(blog.createdAt)}</span>
        <span className="publicBlogDetail-separator">•</span>
        <span className="publicBlogDetail-category">{categoryName}</span>
      </div>
      <div className="publicBlogDetail-actions">
        <div className="publicBlogDetail-stats">
          <span className="publicBlogDetail-stat-item">
            <Eye size={16} /> {blog.views || 0}
          </span>
          <button onClick={handleLike} className={`publicBlogDetail-like-button ${liked ? "liked" : ""}`}>
            <Heart size={16} fill={liked ? "currentColor" : "none"} /> {blog.likes || 0}
          </button>
        </div>
        <div className="publicBlogDetail-share-container">
          <button onClick={() => setShowShareOptions(!showShareOptions)} className="publicBlogDetail-share-button">
            <Share2 size={16} /> Compartir
          </button>
          {showShareOptions && (
            <div className="publicBlogDetail-share-dropdown">
              <button onClick={() => handleShare("facebook")}>
                <Facebook size={16} /> Facebook
              </button>
              <button onClick={() => handleShare("twitter")}>
                <Twitter size={16} /> Twitter
              </button>
              <button onClick={() => handleShare("linkedin")}>
                <Linkedin size={16} /> LinkedIn
              </button>
              <button onClick={() => handleShare("email")}>
                <Mail size={16} /> Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
