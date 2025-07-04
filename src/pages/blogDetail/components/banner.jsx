import React from 'react'


export default function BlogBanner({ blog }) {
  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, ''); // Esto elimina todas las etiquetas HTML
  }

  return (
    <div className="publicBlogDetail-banner">
      {blog.bannerImage && (
        <img
          src={blog.bannerImage || "/placeholder.svg"}
          alt={blog.title}
          className="publicBlogDetail-banner-image"
        />
      )}
      <div className="publicBlogDetail-banner-overlay">
        <div className="publicBlogDetail-banner-content">
          <h1 dangerouslySetInnerHTML={{ __html: blog.bannerTitle || "" }} className="publicBlogDetail-title"></h1>

        </div>
      </div>
    </div>
  )
}
