"use client"

import { useState, useEffect } from "react"
import { Resizable } from "re-resizable"
import { Maximize2 } from "lucide-react" // Importamos el ícono

const BlogPreview = ({ blogData, categoriesList, updateContentImageSize }) => {
  // Usamos un valor por defecto si blogData.contentimagedimensions no está presente
  const defaultDimensions = { width: 300, height: 200 };
  const initialDimensions = blogData.contentimagedimensions || defaultDimensions;

  const [contentImageSize, setContentImageSize] = useState(initialDimensions);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Si blogData.contentimagedimensions cambia, actualizamos el estado
    setContentImageSize(blogData.contentimagedimensions || defaultDimensions);
  }, [blogData.contentimagedimensions]);

  const handleResize = (e, direction, ref, d) => {
    const newSize = {
      width: contentImageSize.width + d.width,
      height: contentImageSize.height + d.height,
    };

    setContentImageSize(newSize); // Actualizamos el estado local de contentImageSize
    updateContentImageSize(newSize); // Actualizamos el tamaño en BlogEditor
  };

  return (
    <div className="blog-preview">
      <div className="preview-banner" style={{ backgroundColor: "#666" }}>
        {blogData.bannerImage && (
          <img
            src={localStorage.getItem("tempBannerImg") || blogData.bannerImage}  // Usamos la URL temporal o un placeholder si no hay imagen
            alt="Banner"
            className="preview-banner-image"
          />
        )}
        <h1 className="banner-title">{blogData.bannerTitle || "SEDENTARISMO"}</h1>
      </div>

      <div className="preview-content">
        <div className="preview-date">{new Date().toLocaleDateString()}</div>
        <h2 className="preview-title" style={blogData.textStyle}>
          {blogData.title || "¿QUE ES EL SEDENTARISMO?"}
        </h2>
        <p className="preview-main-content" style={blogData.textStyle}>
          {blogData.mainContent}
        </p>

        <h3 className="preview-effects-title" style={blogData.textStyle}>
          {blogData.effectsTitle || "Sus efectos en la salud"}
        </h3>
        <div className="preview-effects">
          <p style={blogData.textStyle}>{blogData.effectsContent}</p>
          {blogData.contentImage && (
            <div
              className="image-resize-container"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Resizable
                size={contentImageSize}  // Usamos contentImageSize que es el estado local
                onResizeStop={handleResize}
                className="rezisable"
                enable={{ top: true, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
              >
                <img
                  src={localStorage.getItem("tempContentImg") || blogData.contentImage}  // Usamos la URL temporal o un placeholder si no hay imagen
                  alt="Content"
                  className="preview-content-image"
                  style={{
                    width: "100%",  // La imagen ocupa el 100% del ancho del contenedor
                    height: "100%", // La imagen ocupa el 100% de la altura del contenedor
                    objectFit: "cover", // Asegura que la imagen cubra todo el contenedor sin deformarse
                  }}
                />
              </Resizable>
            </div>
          )}
        </div>

        <div className="preview-meta">
          <span className="preview-author">{blogData.author}</span>
          <span className="preview-category">
            {categoriesList.find((category) => category.id === Number(blogData.categoryId))?.nombre ||
              "Categoría no encontrada"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default BlogPreview
