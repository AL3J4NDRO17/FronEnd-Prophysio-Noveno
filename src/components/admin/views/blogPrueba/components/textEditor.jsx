"use client"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import "./textEditor.css"

const RichTextEditor = ({ value, onChange, placeholder }) => {
  // Configuración de los módulos del editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  }

  // Formatos permitidos
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",

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

