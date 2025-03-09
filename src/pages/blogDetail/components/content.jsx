import React from 'react'

export default function BlogContent({ blog }) {
  return (
    <div className="publicBlogDetail-content">
      <div className="publicBlogDetail-main-content" style={blog.textStyle || {}}>
        {blog.mainContent &&
          blog.mainContent
            .split("\n")
            .map((paragraph, index) => (paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />))}
      </div>

      {/* Sección de efectos */}
      {(blog.effectsTitle || blog.effectsContent) && (
        <div className="publicBlogDetail-effects">
          {blog.effectsTitle && (
            <h2 className="publicBlogDetail-effects-title" style={blog.textStyle || {}}>
              {blog.effectsTitle}
            </h2>
          )}

          <div className="publicBlogDetail-effects-container">
            <div className="publicBlogDetail-effects-content" style={blog.textStyle || {}}>
              {blog.effectsContent &&
                blog.effectsContent
                  .split("\n")
                  .map((paragraph, index) => (paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />))}
            </div>

            {blog.contentImage && (
              <div className="publicBlogDetail-effects-image">
                <img
                  src={blog.contentImage || "/placeholder.svg"}
                  alt={blog.effectsTitle || "Imagen ilustrativa"}
                  style={
                    blog.contentimagedimensions
                      ? {
                        width: `${blog.contentimagedimensions.width}px`,
                        height: `${blog.contentimagedimensions.height}px`,
                      }
                      : {}
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
