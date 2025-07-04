"use client"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import "./textEditor.css"

const RichTextEditor = ({ value, onChange, placeholder }) => {
  // Configuración de los módulos del editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", { script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }, { direction: "rtl" }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],
      ["clean"],
    ],
  }

  // Formatos permitidos
  const formats = [
    "header", "font", "size",
    "bold", "italic", "underline", "strike", "script",
    "color", "background",
    "align", "direction",
    "list", "bullet", "indent",
    "blockquote", "code-block",
    "link", "image", "video", "formula"

  ]

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}

export default RichTextEditor

