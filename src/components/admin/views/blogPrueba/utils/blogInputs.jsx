import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import { uploadImageToCloudinary } from "../services/cloudinaryService"

import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

const EditorInputs = ({
  blogData,
  setBlogData,
  handleInputChange,
  handleStyleChange,
  categoriesList,
  contentImageSize,
  
  
}) => {
  const fonts = ["Arial", "Helvetica", "Times New Roman", "Courier", "Verdana", "Georgia"]
  const handleBannerUpload = async (fileItems) => {
    if (fileItems.length > 0 && fileItems[0].file instanceof File) {
      const file = fileItems[0].file;
      localStorage.setItem("tempBannerImg",URL.createObjectURL(file))
      setBlogData(prev => ({
        ...prev,
        bannerImage: file, // Guardamos el archivo para subirlo más tarde
      }));
    }
  };

  const handleContentImageUpload = async (fileItems) => {
    if (fileItems.length > 0 && fileItems[0].file instanceof File) {
      const file = fileItems[0].file;
      localStorage.setItem("tempContentImg",URL.createObjectURL(file))
      setBlogData(prev => ({
        ...prev,
        contentImage: file, // Guardamos el archivo para subirlo más tarde
      }));
    }
  };
  console.log(blogData)

  return (
    <div className="editor-content">
      {/* Banner Section */}
      <div className="editor-section">
        <label>Banner Principal</label>
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
          value={blogData.bannerTitle}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>

      {/* Text Styling Toolbar */}
      <div className="editor-section toolbar">
        <select
          value={blogData.textStyle.fontFamily}
          onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
          className="toolbar-item"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <select
          value={blogData.textStyle.fontSize}
          onChange={(e) => handleStyleChange("fontSize", e.target.value)}
          className="toolbar-item"
        >
          {["12px", "14px", "16px", "18px", "20px", "24px"].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <input
          type="color"
          value={blogData.textStyle.color}
          onChange={(e) => handleStyleChange("color", e.target.value)}
          className="toolbar-item color-picker"
        />
        <select
          value={blogData.textStyle.textAlign}
          onChange={(e) => handleStyleChange("textAlign", e.target.value)}
          className="toolbar-item"
        >
          {["left", "center", "right", "justify"].map((align) => (
            <option key={align} value={align}>
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content Section */}
      <div className="editor-section">
        <input
          type="text"
          name="title"
          placeholder="Título del Blog"
          value={blogData.title}
          onChange={handleInputChange}
          className="input-field title-input"
          style={blogData.textStyle}
        />

        <textarea
          name="mainContent"
          placeholder="Contenido principal del blog..."
          value={blogData.mainContent}
          onChange={handleInputChange}
          className="input-field content-textarea"
          style={blogData.textStyle}
        />
      </div>

      {/* Effects Section */}
      <div className="editor-section">
        <input
          type="text"
          name="effectsTitle"
          placeholder="Título de los Efectos"
          value={blogData.effectsTitle}
          onChange={handleInputChange}
          className="input-field"
          style={blogData.textStyle}
        />

        <div className="effects-container">
          <textarea
            name="effectsContent"
            placeholder="Contenido de los efectos..."
            value={blogData.effectsContent}
            onChange={handleInputChange}
            className="input-field effects-textarea"
            style={blogData.textStyle}
          />

          <div>
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
              <p>
                Tamaño actual: {contentImageSize.width}px x {contentImageSize.height}px
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Author and Category Section */}
      <div className="editor-section meta-section">
        <input
          type="text"
          name="author"
          placeholder="Nombre del autor"
          value={blogData.author}
          onChange={handleInputChange}
          className="input-field author-input"
        />
        <select
          name="categoryId"
          value={blogData.categoryId}
          onChange={handleInputChange}
          className="input-field category-select"
        >
          <option value="">Selecciona una categoría</option>
          {categoriesList.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default EditorInputs

