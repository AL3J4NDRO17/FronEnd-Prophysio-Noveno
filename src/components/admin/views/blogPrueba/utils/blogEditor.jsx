"use client"
import { useState, useEffect } from "react";
import { useBlogEditor } from "../hooks/blogEditorHook";
import EditorInputs from "./blogInputs";
import BlogPreview from "./blogPreview";
import "../styles/blogEditor.css";

const BlogEditor = ({ onClose, existingBlog, categories }) => {
  const [contentImageSize, setContentImageSize] = useState({ width: 300, height: 200 });

  const {
    blogData,
    setBlogData,
    handleInputChange,
    handleStyleChange,
    handlePublish,
    handleImageUpload,
    isLoading,
    isError,
    error
  } = useBlogEditor(existingBlog, onClose, contentImageSize);

  const categoriesList = categories && Array.isArray(categories) ? categories : [];

  useEffect(() => {
    console.log("Tamaño de la imagen actualizado:", contentImageSize);
  }, [contentImageSize]);

  const updateContentImageSize = (newSize) => {
    if (newSize?.width && newSize?.height) {
      setContentImageSize({
        width: Number(newSize.width) || 300,
        height: Number(newSize.height) || 200,
      });
    }
  };

  return (
    <div className="blog-editor-container">
      <div className="blog-editor">
        <div className="editor-header">
          <h2>{existingBlog ? "Editar Blog" : "Crear Nuevo Blog"}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <EditorInputs
          blogData={blogData}
          setBlogData={setBlogData}
          handleInputChange={handleInputChange}
          handleStyleChange={handleStyleChange}
          categoriesList={categoriesList}
          contentImageSize={contentImageSize}
          handleImageUpload={handleImageUpload}
        />

        <div className="editor-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="save-button" onClick={handlePublish} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
        {isError && <div className="error-message">Error: {error.message}</div>}
      </div>

      <BlogPreview
        blogData={blogData}
        categoriesList={categoriesList}
        updateContentImageSize={updateContentImageSize} // Ahora usa la función corregida
      />
    </div>
  );
};

export default BlogEditor;
