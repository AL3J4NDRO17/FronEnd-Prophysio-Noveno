export default function BlogContent({ blog }) {
  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, ''); // Esto elimina todas las etiquetas HTML
  }

  return (
    <div className="publicBlogDetail-content">
      <p className="publicBlogDetail-effects-title">{blog.title}</p>
      <div
        className="publicBlogDetail-main-content"
        style={blog.textStyle || {}}
        dangerouslySetInnerHTML={{ __html: blog.mainContent || "" }}
      />

      {/* Sección de efectos */}
      {(blog.effectsTitle || blog.effectsContent) && (
        <div className="publicBlogDetail-effects">
          {blog.effectsTitle && (
            <h2 className="publicBlogDetail-effects-title" style={blog.textStyle || {}}>
              {blog.effectsTitle}
            </h2>
          )}

          <div className="publicBlogDetail-effects-container">
            <div
              className="publicBlogDetail-effects-content"
              style={blog.textStyle || {}}
              dangerouslySetInnerHTML={{ __html: blog.effectsContent || "" }}
            />

            {blog.contentImage && (
              <div className="publicBlogDetail-effects-image" style={
                blog.contentimagedimensions
                  ? {
                    maxWidth: `${blog.contentimagedimensions.width}px`,
                    maxHeight: `${blog.contentimagedimensions.height}px`,
                  }
                  : {}
              } >

                <img
                  src={blog.contentImage || "/placeholder.svg"}
                  alt={blog.effectsTitle || "Imagen ilustrativa"}
                  
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

