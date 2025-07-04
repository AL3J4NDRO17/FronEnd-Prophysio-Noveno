import { ImageIcon } from "lucide-react"

export default function BlogDisplay({ blogData, categories }) {
  const categoryName = categories.find((cat) => cat.id === Number(blogData.categoryId))?.nombre || "Sin categoría"

  return (
    <div className="blogAdmin-preview-container">
      {/* Banner Section */}
      <div className="blogAdmin-preview-banner-display">
        {blogData.bannerImage ? (
          <img
            src={localStorage.getItem("tempBannerImg") || blogData.bannerImage}
            alt="Banner del Blog"
            className="blogAdmin-preview-banner-image-display "
          />
        ) : (
          <div className="blogAdmin-preview-banner-placeholder">
            <ImageIcon className="blogAdmin-icon-large" />
          </div>
        )}
        <h1 className="blogAdmin-preview-banner-title-display ql-editor">
          {blogData.bannerTitle && <div dangerouslySetInnerHTML={{ __html: blogData.title }} />}
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="blogAdmin-preview-content-display">
        <div className="blogAdmin-preview-meta-top">
          <span className="blogAdmin-preview-author-display">Por {blogData.author || "Desconocido"}</span>
          <span className="blogAdmin-preview-separator">•</span>
          <span className="blogAdmin-preview-date-display">
            {new Date(blogData.publishDate || Date.now()).toLocaleDateString()}
          </span>
          <span className="blogAdmin-preview-separator">•</span>
          <span className="blogAdmin-preview-category-display">{categoryName}</span>
        </div>

        <div className="blogAdmin-preview-body-display">
          {blogData.mainContent ? (
            <div className="blogAdmin-preview-body-display ql-editor" dangerouslySetInnerHTML={{ __html: blogData.mainContent }} />
          ) : (
            <p className="blogAdmin-preview-placeholder-text">El contenido principal aparecerá aquí...</p>
          )}
        </div>

        {/* Attached Images Section */}
        {blogData.attachedImages && blogData.attachedImages.length > 0 && (
          <div className="blogAdmin-attached-images-section">
            <h2 className="blogAdmin-attached-images-title">IMÁGENES ADJUNTAS</h2>
            <div className="blogAdmin-attached-images-grid">
              {blogData.attachedImages.map((image, index) => (
                <div key={index} className="blogAdmin-attached-image-item">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Imagen adjunta ${index + 1}`}
                    className="blogAdmin-attached-image"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
