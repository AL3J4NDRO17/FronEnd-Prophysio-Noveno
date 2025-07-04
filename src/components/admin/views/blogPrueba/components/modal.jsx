"use client"

import { useState, useEffect } from "react"

import { X, Eye, Save, Edit } from "lucide-react"

import { Resizable } from "re-resizable"

import { FilePond, registerPlugin } from "react-filepond"

import FilePondPluginImagePreview from "filepond-plugin-image-preview"

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

import { useBlogEditor } from "../hooks/blogEditorHook"

import RichTextEditor from "./textEditor"

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

  // Manejar cambios en el contenido del editor de texto enriquecido para el contenido principal
  const handleMainContentChange = (content) => {
    setBlogData((prev) => ({
      ...prev,
      mainContent: content,
    }))
  }

  // Manejar cambios en el contenido de efectos del editor de texto enriquecido
  const handleEffectsContentChange = (content) => {
    setBlogData((prev) => ({
      ...prev,
      effectsContent: content,
    }))
  }

  // Nuevas funciones para manejar los cambios de los títulos con RichTextEditor
  const handleBannerTitleChange = (content) => {
    setBlogData((prev) => ({
      ...prev,
      bannerTitle: content,
    }))
  }

  const handleTitleChange = (content) => {
    setBlogData((prev) => ({
      ...prev,
      title: content,
    }))
  }

  const handleEffectsTitleChange = (content) => {
    setBlogData((prev) => ({
      ...prev,
      effectsTitle: content,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="blogAdmin-editor-overlay">
      <div className="blogAdmin-editor">
        <div className="blogAdmin-editor-header">
          <div className="blogAdmin-editor-header-left">
            <h2>{existingBlog ? "Editar artículo" : "Crear nuevo artículo"}</h2>
            <div className="blogAdmin-editor-status">
              <span className={`blogAdmin-editor-status-badge blogAdmin-editor-status-${blogData.status}`}>
                {blogData.status === "published" ? "Publicado" : "Borrador"}
              </span>
              <div className="blogAdmin-editor-status-select">
                <select
                  value={blogData.status}
                  onChange={(e) => setBlogData({ ...blogData, status: e.target.value })}
                  className="blogAdmin-select blogAdmin-select-sm"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </div>
          </div>
          <div className="blogAdmin-editor-header-right">
            <button
              className="blogAdmin-secondary-button"
              onClick={() => setActiveTab(activeTab === "editor" ? "preview" : "editor")}
            >
              {activeTab === "editor" ? (
                <>
                  <Eye className="blogAdmin-button-icon" />
                  Vista previa
                </>
              ) : (
                <>
                  <Edit className="blogAdmin-button-icon" />
                  Editor
                </>
              )}
            </button>
            <button className="blogAdmin-primary-button" onClick={handlePublish} disabled={isLoading}>
              <Save className="blogAdmin-button-icon" />
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
            <button
              className="blogAdmin-icon-button-small"
              onClick={() => {
                localStorage.clear()
                onClose()
              }}
            >
              <X className="blogAdmin-icon-small" />
            </button>
          </div>
        </div>
        <div className="blogAdmin-editor-container">
          <div className="blogAdmin-editor-sidebar">
            <div className="blogAdmin-editor-sidebar-section">
              <h3>Categoría</h3>
              <div className="blogAdmin-form-group">
                <select
                  className="blogAdmin-select"
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
            <div className="blogAdmin-editor-sidebar-section">
              <h3>Autor</h3>
              <div className="blogAdmin-form-group">
                <input
                  type="text"
                  name="author"
                  className="blogAdmin-input"
                  placeholder="Nombre del autor"
                  value={blogData.author || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="blogAdmin-editor-main">
            {activeTab === "editor" ? (
              <div className="blogAdmin-editor-content">
                {/* Banner/Image Upload */}
                <div className="blogAdmin-editor-banner">
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
                  <RichTextEditor
                    value={blogData.bannerTitle || ""}
                    onChange={handleBannerTitleChange}
                    placeholder="Título del Banner"
                  />
                </div>
                {/* Title */}
                <div className="blogAdmin-editor-title">
                  <RichTextEditor
                    value={blogData.title || ""}
                    onChange={handleTitleChange}
                    placeholder="Título del artículo"
                  />
                </div>
                {/* Main Content - Rich Text Editor */}
                <div className="blogAdmin-editor-body">
                  <RichTextEditor
                    value={blogData.mainContent || ""}
                    onChange={handleMainContentChange}
                    placeholder="Contenido principal del artículo..."
                  />
                </div>
                {/* Effects Title and Content */}
                <div className="blogAdmin-editor-title" style={{ marginTop: "20px" }}>
                  <RichTextEditor
                    value={blogData.effectsTitle || ""}
                    onChange={handleEffectsTitleChange}
                    placeholder="Subtitulo del articulo"
                  />
                </div>
                <div className="blogAdmin-editor-effects">
                  <div className="blogAdmin-editor-effects-content">
                    {/* Effects Content - Rich Text Editor */}
                    <RichTextEditor
                      value={blogData.effectsContent || ""}
                      onChange={handleEffectsContentChange}
                      placeholder="Subcontenido del articulo"
                    />
                  </div>
                  <div className="blogAdmin-editor-effects-image">
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
                      <div className="blogAdmin-image-dimensions">
                        <p>
                          Tamaño: {contentImageSize.width}px × {contentImageSize.height}px
                        </p>
                        <p className="blogAdmin-image-resize-hint">Puedes redimensionar la imagen en la vista previa</p>
                      </div>
                    )}
                  </div>
                </div>
                {isError && (
                  <div className="blogAdmin-error-message">
                    Error: {error?.message || "Ocurrió un error al guardar el blog"}
                  </div>
                )}
              </div>
            ) : (
              <div className="blogAdmin-editor-preview">
                {/* Banner Preview */}
                <div className="blogAdmin-preview-banner" style={{ backgroundColor: "#666" }}>
                  {blogData.bannerImage && (
                    <img
                      src={localStorage.getItem("tempBannerImg") || blogData.bannerImage}
                      alt="Banner"
                      className="blogAdmin-preview-banner-image"
                    />
                  )}
                  <h1 className="blogAdmin-preview-banner-title">
                    {blogData.bannerTitle && <div dangerouslySetInnerHTML={{ __html: blogData.bannerTitle }} />}
                  </h1>
                </div>
                <div className="blogAdmin-preview-content">
                  <div className="blogAdmin-preview-date">{new Date().toLocaleDateString()}</div>
                  <h1 className="blogAdmin-preview-title" style={blogData.textStyle}>
                    {blogData.title && <div dangerouslySetInnerHTML={{ __html: blogData.title }} />}
                  </h1>
                  <div className="blogAdmin-preview-body">
                    {blogData.mainContent ? (
                      <div dangerouslySetInnerHTML={{ __html: blogData.mainContent }} />
                    ) : (
                      <p className="blogAdmin-preview-placeholder">El contenido principal aparecerá aquí...</p>
                    )}
                  </div>
                  <h2 className="blogAdmin-preview-subtitle" style={blogData.textStyle}>
                    {blogData.effectsTitle && <div dangerouslySetInnerHTML={{ __html: blogData.effectsTitle }} />}
                  </h2>
                  <div className="blogAdmin-preview-effects">
                    <div className="blogAdmin-preview-effects-content">
                      {blogData.effectsContent ? (
                        <div dangerouslySetInnerHTML={{ __html: blogData.effectsContent }} />
                      ) : (
                        <p className="blogAdmin-preview-placeholder">El subcontenido del articulo aparecerá aquí...</p>
                      )}
                    </div>
                    {blogData.contentImage && (
                      <div
                        className="blogAdmin-preview-effects-image"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <Resizable
                          size={contentImageSize}
                          onResizeStop={handleResize}
                          className="blogAdmin-resizable"
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
                            className="blogAdmin-preview-content-image"
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
                  <div className="blogAdmin-preview-meta">
                    {blogData.author && <span className="blogAdmin-preview-author">Por {blogData.author}</span>}
                    {blogData.categoryId && categories && (
                      <span className="blogAdmin-preview-category">
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
