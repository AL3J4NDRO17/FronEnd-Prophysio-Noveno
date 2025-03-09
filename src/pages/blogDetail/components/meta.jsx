import React from 'react'
import { Calendar, User, Tag, Share2, Heart, Facebook, Twitter, Linkedin, Mail } from 'lucide-react'


export default function BlogMeta({ 
  blog, 
  categoryName, 
  liked, 
  handleLike, 
  showShareOptions, 
  setShowShareOptions, 
  handleShare 
}) {
  return (
    <div className="publicBlogDetail-meta">
      <div className="publicBlogDetail-meta-left">
        <div className="publicBlogDetail-meta-item">
          <Calendar className="publicBlogDetail-meta-icon" />
          <span>{new Date(blog.publishDate || Date.now()).toLocaleDateString()}</span>
        </div>
        <div className="publicBlogDetail-meta-item">
          <User className="publicBlogDetail-meta-icon" />
          <span>{blog.author}</span>
        </div>
        {categoryName && (
          <div className="publicBlogDetail-meta-item">
            <Tag className="publicBlogDetail-meta-icon" />
            <span>{categoryName}</span>
          </div>
        )}
      </div>
      <div className="publicBlogDetail-meta-right">
        <button
          className={`publicBlogDetail-like-button ${liked ? "liked" : ""}`}
          onClick={handleLike}
          aria-label="Me gusta"
        >
          <Heart className="publicBlogDetail-meta-icon" />
          <span>{liked ? "Te gusta" : "Me gusta"}</span>
        </button>
        <div className="publicBlogDetail-share">
          <button
            className="publicBlogDetail-share-button"
            onClick={() => setShowShareOptions(!showShareOptions)}
            aria-label="Compartir"
          >
            <Share2 className="publicBlogDetail-meta-icon" />
            <span>Compartir</span>
          </button>
          {showShareOptions && (
            <div className="publicBlogDetail-share-options">
              <button
                className="publicBlogDetail-share-option facebook"
                onClick={() => handleShare("facebook")}
                aria-label="Compartir en Facebook"
              >
                <Facebook size={16} />
              </button>
              <button
                className="publicBlogDetail-share-option twitter"
                onClick={() => handleShare("twitter")}
                aria-label="Compartir en Twitter"
              >
                <Twitter size={16} />
              </button>
              <button
                className="publicBlogDetail-share-option linkedin"
                onClick={() => handleShare("linkedin")}
                aria-label="Compartir en LinkedIn"
              >
                <Linkedin size={16} />
              </button>
              <button
                className="publicBlogDetail-share-option email"
                onClick={() => handleShare("email")}
                aria-label="Compartir por email"
              >
                <Mail size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
