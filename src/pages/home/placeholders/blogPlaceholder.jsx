import { FileText, BookOpen, Coffee, Lightbulb, Feather } from "lucide-react"
import "./blogPlaceholder.css" // Importa el CSS específico

export default function NoArticlesPlaceholder() {
  return (
    <div className="no-articles-placeholder">
      <div className="no-articles-placeholder-icon-group">
        <div className="no-articles-placeholder-main-circle"></div>
        <Lightbulb size={24} className="no-articles-placeholder-icon lightbulb" />
        <Coffee size={24} className="no-articles-placeholder-icon coffee" />
        <FileText size={24} className="no-articles-placeholder-icon document" />
        <BookOpen size={24} className="no-articles-placeholder-icon book" />
        <Feather size={24} className="no-articles-placeholder-icon feather" />
      </div>

      <h2 className="no-articles-placeholder-title">¡Aquí no hay nada que ver... todavía!</h2>
      <p className="no-articles-placeholder-message">
        Parece que nuestro escritor está tomando un café mientras piensa en el próximo artículo increíble.
      </p>
      <p className="no-articles-placeholder-message sub">Vuelve más tarde a consultar nuestros articulos</p>

    </div>
  )
}

