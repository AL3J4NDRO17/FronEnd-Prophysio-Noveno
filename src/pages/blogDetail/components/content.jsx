export default function BlogContent({ blog }) {
  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, ''); // Esto elimina todas las etiquetas HTML
  }

  return (
    <div className="publicBlogDetail-content">
      <p dangerouslySetInnerHTML={{ __html: blog.title || "" }} className="publicBlogDetail-effects-title"></p>
      <div
        className="publicBlogDetail-main-content"
        style={blog.textStyle || {}}
        dangerouslySetInnerHTML={{ __html: blog.mainContent || "" }}
      />

      {/* Sección de efectos */}
      {(blog.effectsTitle || blog.effectsContent) && (
        <div className="publicBlogDetail-effects">
          {blog.effectsTitle && (
            <h2
              dangerouslySetInnerHTML={{ __html: blog.effectsTitle || "" }}
              className="publicBlogDetail-effects-title" style={blog.textStyle || {}}>
            </h2>
          )}

          <div className="publicBlogDetail-effects-container">
            <div
              className="publicBlogDetail-effects-content"
              style={blog.textStyle || {}}
              dangerouslySetInnerHTML={{ __html: blog.effectsContent || "" }}
            />

            {blog.contentImage && (
              <div className="publicBlogDetail-effects-image" >

                <img
                  src={blog.contentImage || "/placeholder.svg"}
                  alt={blog.effectsTitle || "Imagen ilustrativa"}
                  style={
                    blog.contentimagedimensions
                      ? {
                        width: `${blog.contentimagedimensions.width}px`,
                        height: `${blog.contentimagedimensions.height}px`,
                        objectFit: "cover",
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

