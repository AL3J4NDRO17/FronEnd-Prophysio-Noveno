
export default function BlogContent({ blog }) {
  console.log(blog)
  return (
    <div className="publicBlogDetail-content">
      <div className="publicBlogDetail-body">
        {blog.mainContent ? (
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: blog.mainContent }} />
        ) : (
          <p className="publicBlogDetail-placeholder-text">El contenido principal aparecerá aquí...</p>
        )}
      </div>

      {blog.attachedImages && blog.attachedImages.length > 0 && (
        <div className="publicBlogDetail-attached-images-section">
          <h2 className="publicBlogDetail-attached-images-title">IMÁGENES ADJUNTAS</h2>
          <div className="publicBlogDetail-attached-images-grid">
            {blog.attachedImages.map((image, index) => (
              <div key={index} className="publicBlogDetail-attached-image-item">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Imagen adjunta ${index + 1}`}
                  className="publicBlogDetail-attached-image"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
