"use client"

import { useState, useEffect } from "react"

import { X, Eye, Save, Edit, Upload } from 'lucide-react'

import { FilePond, registerPlugin } from "react-filepond"

import FilePondPluginImagePreview from "filepond-plugin-image-preview"

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

import { useBlogEditor } from "../hooks/blogEditorHook"

import RichTextEditor from "./textEditor"
import BlogDisplay from "./blogDisplay" // Importa el nuevo componente

import "filepond/dist/filepond.min.css"

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

export default function BlogModal({ isOpen, onClose, existingBlog, categories }) {
  const [activeTab, setActiveTab] = useState("editor")
  const [attachedFiles, setAttachedFiles] = useState([]) // Estado para FilePond de imágenes adjuntas

  const { blogData, setBlogData, handleInputChange, handlePublish, isLoading, isError, error } = useBlogEditor(
    existingBlog,
    onClose,
  )

  // Inicializar attachedFiles si hay un blog existente
  useEffect(() => {
    if (existingBlog?.attachedImages) {
      setAttachedFiles(existingBlog.attachedImages.map(url => ({ source: url })))
    }
  }, [existingBlog])

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

  const handleAttachedImagesUpload = (fileItems) => {
    const newImages = fileItems.map(item => {
      if (item.file instanceof File) {
        return URL.createObjectURL(item.file);
      }
      return item.source; // Para imágenes existentes
    });
    setAttachedFiles(fileItems); // Mantener el estado interno de FilePond
    setBlogData((prev) => ({
      ...prev,
      attachedImages: newImages,
    }));
  };

  const handleBannerTitleChange = (value) => {
    setBlogData((prev) => ({
      ...prev,
      bannerTitle: value,
    }))
  }

  const handleMainContentChange = (value) => {
    setBlogData((prev) => ({
      ...prev,
      mainContent: value,
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
            <button
              className="blogAdmin-secondary-button"
              onClick={() => {
                setBlogData((prev) => ({ ...prev, status: "draft" }))
                handlePublish()
              }}
              disabled={isLoading}
            >
              <Save className="blogAdmin-button-icon" />
              Guardar borrador
            </button>
            <button
              className="blogAdmin-primary-button"
              onClick={() => {
                setBlogData((prev) => ({ ...prev, status: "published" }))
                handlePublish()
              }}
              disabled={isLoading}
            >
              <Upload className="blogAdmin-button-icon" />
              {isLoading ? "Publicando..." : "Publicar"}
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
                <div className="blogAdmin-editor-body">
                  <RichTextEditor
                    value={blogData.mainContent || ""}
                    onChange={handleMainContentChange}
                    placeholder="Contenido principal del artículo..."
                  />
                </div>
                <div className="blogAdmin-editor-attached-images">
                  <h3>Imágenes Adjuntas</h3>
                  <FilePond
                    files={attachedFiles}
                    onupdatefiles={handleAttachedImagesUpload}
                    allowMultiple={true}
                    maxFiles={5} // Puedes ajustar el límite de imágenes adjuntas
                    name="attachedImages"
                    labelIdle="Arrastra imágenes o haz clic para seleccionar"
                    acceptedFileTypes={["image/*"]}
                    stylePanelLayout="compact"
                    imagePreviewHeight={100}
                  />
                </div>
                {isError && (
                  <div className="blogAdmin-error-message">
                    Error: {error?.message || "Ocurrió un error al guardar el blog"}
                  </div>
                )}
              </div>
            ) : (
              <BlogDisplay blogData={blogData} categories={categories} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
