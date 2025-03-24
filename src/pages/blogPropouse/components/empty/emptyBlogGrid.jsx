"use client"

import { BookOpen, FileText, PenTool, Coffee, Lightbulb, Plus } from "lucide-react"
import "./emptyBlogGrid.css"

const EmptyBlogState = ({ onCreateNew }) => {
  return (
    <div className="adminDashboard-empty-blog-container">
      <div className="adminDashboard-empty-blog-illustration">
        <div className="adminDashboard-empty-blog-character">
          <div className="adminDashboard-empty-blog-head">
            <div className="adminDashboard-empty-blog-face">
              <div className="adminDashboard-empty-blog-eyes"></div>
              <div className="adminDashboard-empty-blog-mouth"></div>
            </div>
          </div>
          <div className="adminDashboard-empty-blog-body">
            <div className="adminDashboard-empty-blog-arm adminDashboard-empty-blog-arm-left">
              <Coffee className="adminDashboard-empty-blog-coffee" />
            </div>
            <div className="adminDashboard-empty-blog-arm adminDashboard-empty-blog-arm-right">
              <PenTool className="adminDashboard-empty-blog-pen" />
            </div>
          </div>
        </div>

        <div className="adminDashboard-empty-blog-thought-bubble">
          <Lightbulb className="adminDashboard-empty-blog-idea" />
          <div className="adminDashboard-empty-blog-dots">
            <div className="adminDashboard-empty-blog-dot"></div>
            <div className="adminDashboard-empty-blog-dot"></div>
            <div className="adminDashboard-empty-blog-dot"></div>
          </div>
        </div>

        <div className="adminDashboard-empty-blog-papers">
          <FileText className="adminDashboard-empty-blog-paper" />
          <BookOpen className="adminDashboard-empty-blog-book" />
        </div>
      </div>

      <h2 className="adminDashboard-empty-blog-title">¡Aquí no hay nada que ver... todavía!</h2>
      <p className="adminDashboard-empty-blog-message">
        Parece que nuestro escritor está tomando un café mientras piensa en el próximo artículo increíble.
        <br />
        ¿Por qué no ser el primero en compartir conocimiento?
      </p>

      <div className="adminDashboard-empty-blog-tips">
        <h3>Consejos para empezar:</h3>
        <ul>
          <li>Escribe sobre temas que te apasionen</li>
          <li>Incluye imágenes para hacer tu contenido más atractivo</li>
          <li>Mantén un tono conversacional y amigable</li>
          <li>Comparte experiencias personales o casos de estudio</li>
        </ul>
      </div>
    </div>
  )
}

export default EmptyBlogState

