"use client"

import { useState, useEffect } from "react"

import { X, Eye, Save, Edit, Upload } from "lucide-react"

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
  const [filePondAttachedFiles, setFilePondAttachedFiles] = useState([]) // State for FilePond of attached images
  const [filePondBannerFile, setFilePondBannerFile] = useState([]) // State for FilePond of banner image

  const { blogData, setBlogData, handleInputChange, handlePublish, isLoading, isError, error } = useBlogEditor(
    existingBlog,
    onClose,
  )

  // Initialize FilePond files and blogData.attachedImages from existingBlog
  useEffect(() => {
    if (existingBlog) {
      // Initialize banner image for FilePond and blogData
      if (existingBlog.bannerImage) {
        setFilePondBannerFile([{ source: existingBlog.bannerImage }])
        setBlogData((prev) => ({ ...prev, bannerImage: existingBlog.bannerImage }))
      } else {
        setFilePondBannerFile([])
        setBlogData((prev) => ({ ...prev, bannerImage: null }))
      }

      // Initialize attached images for FilePond and blogData
      if (existingBlog.attachedImages) {
        setFilePondAttachedFiles(existingBlog.attachedImages.map((url) => ({ source: url })))
        setBlogData((prev) => ({ ...prev, attachedImages: existingBlog.attachedImages }))
      } else {
        setFilePondAttachedFiles([])
        setBlogData((prev) => ({ ...prev, attachedImages: [] }))
      }
    } else {
      // Reset states for new blog creation
      setFilePondBannerFile([])
      setFilePondAttachedFiles([])
      setBlogData({
        bannerTitle: "",
        bannerImage: null,
        title: "",
        mainContent: "",
        author: "",
        categoryId: "",
        status: "draft",
        attachedImages: [], // Ensure attachedImages is initialized
      })
    }
  }, [existingBlog, setBlogData])

  const handleBannerUpload = (fileItems) => {
    setFilePondBannerFile(fileItems) // Update FilePond's internal state for banner

    if (fileItems.length > 0 && fileItems[0].file instanceof File) {
      setBlogData((prev) => ({
        ...prev,
        bannerImage: fileItems[0].file, // Store the actual File object
      }))
    } else if (fileItems.length === 0) {
      setBlogData((prev) => ({
        ...prev,
        bannerImage: null, // Clear banner image if removed
      }))
    } else if (fileItems.length > 0 && typeof fileItems[0].source === "string") {
      setBlogData((prev) => ({
        ...prev,
        bannerImage: fileItems[0].source, // Store the URL if it's an existing image
      }))
    }
  }

  const handleAttachedImagesUpload = (fileItems) => {
    setFilePondAttachedFiles(fileItems) // Update FilePond's internal state

    const newAttachedImagesForBlogData = fileItems.map((item) => {
      if (item.file instanceof File) {
        return item.file // Store the actual File object for new uploads
      }
      return item.source // Store the URL for existing images
    })

    setBlogData((prev) => ({
      ...prev,
      attachedImages: newAttachedImagesForBlogData, // This will now contain a mix of File objects and URLs
    }))
  }

  const handleTitleChange = (value) => {
    setBlogData((prev) => ({
      ...prev,
      title: value,
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
                    files={filePondBannerFile} // Use filePondBannerFile for FilePond's display
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
                    onChange={handleTitleChange}
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
                    files={filePondAttachedFiles} // Use filePondAttachedFiles for FilePond's display
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
