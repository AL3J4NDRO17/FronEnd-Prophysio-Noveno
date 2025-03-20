"use client"

import { useState, useEffect } from "react"
import {
  X,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Tag,
  Eye,
  Save,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Edit,
} from "lucide-react"
import { Resizable } from "re-resizable"
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import { useBlogEditor } from "./hooks/blogEditorHook"

import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

export default function BlogModal({ isOpen, onClose, existingBlog, categories }) {
  const [activeTab, setActiveTab] = useState("editor")
  const [contentImageSize, setContentImageSize] = useState({ width: 300, height: 200 })
  const [isHovered, setIsHovered] = useState(false)

  // Usamos el hook de blog editor
  const { blogData, setBlogData, handleInputChange, handleStyleChange, handlePublish, isLoading, isError, error } =
    useBlogEditor(existingBlog, onClose, contentImageSize)

  // Inicializamos el tamaño de la imagen de contenido
  useEffect(() => {
    if (existingBlog?.contentimagedimensions) {
      setContentImageSize(existingBlog.contentimagedimensions)
    }
  }, [existingBlog])

  // Función para manejar la subida de la imagen del banner
  const handleBannerUpload = async (fileItems) => {
    if (fileItems.length > 0 && fileItems[0].file instanceof File) {
      const file = fileItems[0].file
      localStorage.setItem("tempBannerImg", URL.createObjectURL(file))
      setBlogData((prev) => ({
        ...prev,
        bannerImage: file,
      }))
    }
  }

  // Función para manejar la subida de la imagen de contenido
  const handleContentImageUpload = async (fileItems) => {
    if (fileItems.length > 0 && fileItems[0].file instanceof File) {
      const file = fileItems[0].file
      localStorage.setItem("tempContentImg", URL.createObjectURL(file))
      setBlogData((prev) => ({
        ...prev,
        contentImage: file,
      }))
    }
  }

  // Función para manejar el redimensionamiento de la imagen
  const handleResize = (e, direction, ref, d) => {
    const newSize = {
      width: contentImageSize.width + d.width,
      height: contentImageSize.height + d.height,
    }

    setContentImageSize(newSize)
    setBlogData((prev) => ({
      ...prev,
      contentimagedimensions: newSize,
    }))
  }


  if (!isOpen) return null

  return (
    <div className="adminDashboard-editor-overlay">
      <div className="adminDashboard-editor">
        <div className="adminDashboard-editor-header">
          <div className="adminDashboard-editor-header-left">
            <h2>{existingBlog ? "Editar artículo" : "Crear nuevo artículo"}</h2>
            <div className="adminDashboard-editor-status">
              <span className={`adminDashboard-editor-status-badge adminDashboard-editor-status-${blogData.status}`}>
                {blogData.status === "published" ? "Publicado" : "Borrador"}
              </span>
              <div className="adminDashboard-editor-status-select">
                <select
                  value={blogData.status}
                  onChange={(e) => setBlogData({ ...blogData, status: e.target.value })}
                  className="adminDashboard-select adminDashboard-select-sm"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  {/* <option value="scheduled">Programado</option> */}
                </select>
              </div>
            </div>
          </div>
          <div className="adminDashboard-editor-header-right">
            <button
              className="adminDashboard-secondary-button"
              onClick={() => setActiveTab(activeTab === "editor" ? "preview" : "editor")}
            >
              {activeTab === "editor" ? (
                <>
                  <Eye className="adminDashboard-button-icon" />
                  Vista previa
                </>
              ) : (
                <>
                  <Edit className="adminDashboard-button-icon" />
                  Editor
                </>
              )}
            </button>
            <button className="adminDashboard-primary-button" onClick={handlePublish} disabled={isLoading}>
              <Save className="adminDashboard-button-icon" />
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
            <button
              className="adminDashboard-icon-button-small"
              onClick={() => {
                localStorage.clear()
                onClose()
              }}
            >
              <X className="adminDashboard-icon-small" />
            </button>
          </div>
        </div>

        <div className="adminDashboard-editor-container">
          <div className="adminDashboard-editor-sidebar">
            <div className="adminDashboard-editor-sidebar-section">
              <h3>Formato de texto</h3>
              <div className="adminDashboard-form-group">
                <label>Fuente</label>
                <select
                  value={blogData.textStyle?.fontFamily || "Arial"}
                  onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
                  className="adminDashboard-select"
                >
                  {["Arial", "Helvetica", "Times New Roman", "Courier", "Verdana", "Georgia"].map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div className="adminDashboard-form-group">
                <label>Tamaño</label>
                <select
                  value={blogData.textStyle?.fontSize || "16px"}
                  onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                  className="adminDashboard-select"
                >
                  {["12px", "14px", "16px", "18px", "20px", "24px"].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="adminDashboard-form-group">
                <label>Color</label>
                <div className="adminDashboard-color-picker-container">
                  <input
                    type="color"
                    value={blogData.textStyle?.color || "#000000"}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="adminDashboard-color-picker"
                  />
                  <span className="adminDashboard-color-value">{blogData.textStyle?.color || "#000000"}</span>
                </div>
              </div>

              <div className="adminDashboard-form-group">
                <label>Alineación</label>
                <div className="adminDashboard-alignment-buttons">
                  <button
                    type="button"
                    className={`adminDashboard-alignment-button ${blogData.textStyle?.textAlign === "left" ? "active" : ""}`}
                    onClick={() => handleStyleChange("textAlign", "left")}
                  >
                    <AlignLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className={`adminDashboard-alignment-button ${blogData.textStyle?.textAlign === "center" ? "active" : ""}`}
                    onClick={() => handleStyleChange("textAlign", "center")}
                  >
                    <AlignCenter size={16} />
                  </button>
                  <button
                    type="button"
                    className={`adminDashboard-alignment-button ${blogData.textStyle?.textAlign === "right" ? "active" : ""}`}
                    onClick={() => handleStyleChange("textAlign", "right")}
                  >
                    <AlignRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="adminDashboard-editor-sidebar-section">
              <h3>Categoría</h3>
              <div className="adminDashboard-form-group">
                <select
                  className="adminDashboard-select"
                  name="categoryId"
                  value={blogData.categoryId || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories &&
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                </select>
              </div>
            </div>

           

            <div className="adminDashboard-editor-sidebar-section">
              <h3>Autor</h3>
              <div className="adminDashboard-form-group">
                <input
                  type="text"
                  name="author"
                  className="adminDashboard-input"
                  placeholder="Nombre del autor"
                  value={blogData.author || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="adminDashboard-editor-main">
            {activeTab === "editor" ? (
              <div className="adminDashboard-editor-content">
                {/* Banner/Image Upload */}
                <div className="adminDashboard-editor-banner">
                  <FilePond
                    files={blogData.bannerImage ? [{ source: blogData.bannerImage }] : []}
                    onupdatefiles={(fileItems) => handleBannerUpload(fileItems)}
                    allowMultiple={false}
                    maxFiles={1}
                    name="bannerImage"
                    labelIdle="Arrastra una imagen o haz clic para seleccionar"
                    acceptedFileTypes={["image/*"]}
                    stylePanelLayout="compact"
                    imagePreviewHeight={100}
                  />
                  <input
                    type="text"
                    name="bannerTitle"
                    placeholder="Título del Banner"
                    value={blogData.bannerTitle || ""}
                    onChange={handleInputChange}
                    className="adminDashboard-input"
                    style={{ marginTop: "10px" }}
                  />
                </div>

                {/* Text Styling Toolbar */}
                <div className="adminDashboard-editor-toolbar">
                  <div className="adminDashboard-editor-toolbar-group">
                    <button type="button" className="adminDashboard-editor-toolbar-button">
                      <Bold className="adminDashboard-editor-toolbar-icon" />
                    </button>
                    <button type="button" className="adminDashboard-editor-toolbar-button">
                      <Italic className="adminDashboard-editor-toolbar-icon" />
                    </button>
                  </div>

                  <div className="adminDashboard-editor-toolbar-group">
                    <button type="button" className="adminDashboard-editor-toolbar-button">
                      <List className="adminDashboard-editor-toolbar-icon" />
                    </button>
                    <button type="button" className="adminDashboard-editor-toolbar-button">
                      <ListOrdered className="adminDashboard-editor-toolbar-icon" />
                    </button>
                  </div>

                  <div className="adminDashboard-editor-toolbar-group">
                    <button type="button" className="adminDashboard-editor-toolbar-button">
                      <Link className="adminDashboard-editor-toolbar-icon" />
                    </button>
                    <button type="button" className="adminDashboard-editor-toolbar-button">
                      <ImageIcon className="adminDashboard-editor-toolbar-icon" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="adminDashboard-editor-title">
                  <input
                    type="text"
                    className="adminDashboard-editor-title-input"
                    placeholder="Título del artículo"
                    name="title"
                    value={blogData.title || ""}
                    onChange={handleInputChange}
                    required
                    style={blogData.textStyle}
                  />
                </div>

                {/* Main Content */}
                <div className="adminDashboard-editor-body">
                  <textarea
                    className="adminDashboard-editor-textarea"
                    placeholder="Contenido principal del artículo..."
                    name="mainContent"
                    value={blogData.mainContent || ""}
                    onChange={handleInputChange}
                    rows={8}
                    required
                    style={blogData.textStyle}
                  />
                </div>

                {/* Effects Title and Content */}
                <div className="adminDashboard-editor-title" style={{ marginTop: "20px" }}>
                  <input
                    type="text"
                    className="adminDashboard-editor-subtitle-input"
                    placeholder="Título de los efectos"
                    name="effectsTitle"
                    value={blogData.effectsTitle || ""}
                    onChange={handleInputChange}
                    style={blogData.textStyle}
                  />
                </div>

                <div className="adminDashboard-editor-effects">
                  <div className="adminDashboard-editor-effects-content">
                    <textarea
                      className="adminDashboard-editor-textarea"
                      placeholder="Contenido de los efectos..."
                      name="effectsContent"
                      value={blogData.effectsContent || ""}
                      onChange={handleInputChange}
                      rows={6}
                      style={blogData.textStyle}
                    />
                  </div>

                  <div className="adminDashboard-editor-effects-image">
                    <FilePond
                      files={blogData.contentImage ? [{ source: blogData.contentImage }] : []}
                      onupdatefiles={(fileItems) => handleContentImageUpload(fileItems)}
                      allowMultiple={false}
                      maxFiles={1}
                      name="contentImage"
                      labelIdle="Imagen de contenido"
                      acceptedFileTypes={["image/*"]}
                      stylePanelLayout="compact"
                      imagePreviewHeight={100}
                    />
                    {blogData.contentImage && (
                      <div className="adminDashboard-image-dimensions">
                        <p>
                          Tamaño: {contentImageSize.width}px × {contentImageSize.height}px
                        </p>
                        <p className="adminDashboard-image-resize-hint">
                          Puedes redimensionar la imagen en la vista previa
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {isError && (
                  <div className="adminDashboard-error-message">
                    Error: {error?.message || "Ocurrió un error al guardar el blog"}
                  </div>
                )}
              </div>
            ) : (
              <div className="adminDashboard-editor-preview">
                {/* Banner Preview */}
                <div className="adminDashboard-preview-banner" style={{ backgroundColor: "#666" }}>
                  {blogData.bannerImage && (
                    <img
                      src={localStorage.getItem("tempBannerImg") || blogData.bannerImage}
                      alt="Banner"
                      className="adminDashboard-preview-banner-image"
                    />
                  )}
                  <h1 className="adminDashboard-preview-banner-title">{blogData.bannerTitle || "Titulo del banner"}</h1>
                </div>

                <div className="adminDashboard-preview-content">
                  <div className="adminDashboard-preview-date">{new Date().toLocaleDateString()}</div>
                  <h1 className="adminDashboard-preview-title" style={blogData.textStyle}>
                    {blogData.title || "Titulo del blog"}
                  </h1>

                  <div className="adminDashboard-preview-body">
                    {blogData.mainContent ? (
                      blogData.mainContent.split("\n").map((paragraph, index) =>
                        paragraph ? (
                          <p key={index} style={blogData.textStyle}>
                            {paragraph}
                          </p>
                        ) : (
                          <br key={index} />
                        ),
                      )
                    ) : (
                      <p className="adminDashboard-preview-placeholder">El contenido principal aparecerá aquí...</p>
                    )}
                  </div>

                  <h2 className="adminDashboard-preview-subtitle" style={blogData.textStyle}>
                    {blogData.effectsTitle || "Subtitulo del blog"}
                  </h2>

                  <div className="adminDashboard-preview-effects">
                    <div className="adminDashboard-preview-effects-content">
                      {blogData.effectsContent ? (
                        blogData.effectsContent.split("\n").map((paragraph, index) =>
                          paragraph ? (
                            <p key={index} style={blogData.textStyle}>
                              {paragraph}
                            </p>
                          ) : (
                            <br key={index} />
                          ),
                        )
                      ) : (
                        <p className="adminDashboard-preview-placeholder">
                          El contenido de los efectos aparecerá aquí...
                        </p>
                      )}
                    </div>

                    {blogData.contentImage && (
                      <div
                        className="adminDashboard-preview-effects-image"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <Resizable
                          size={contentImageSize}
                          onResizeStop={handleResize}
                          className="adminDashboard-resizable"
                          enable={{
                            top: true,
                            right: true,
                            bottom: true,
                            left: true,
                            topRight: true,
                            bottomRight: true,
                            bottomLeft: true,
                            topLeft: true,
                          }}
                        >
                          <img
                            src={localStorage.getItem("tempContentImg") || blogData.contentImage}
                            alt="Content"
                            className="adminDashboard-preview-content-image"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Resizable>
                      </div>
                    )}
                  </div>

                  <div className="adminDashboard-preview-meta">
                    {blogData.author && <span className="adminDashboard-preview-author">Por {blogData.author}</span>}
                    {blogData.categoryId && categories && (
                      <span className="adminDashboard-preview-category">
                        {categories.find((cat) => cat.id === Number(blogData.categoryId))?.nombre || "Categoría"}
                      </span>
                    )}
                  </div>

                 
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

