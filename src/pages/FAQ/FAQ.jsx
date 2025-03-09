"use client"

import { useState } from "react"
import "./FAQ.css"
import { ReactComponent as Icon } from "./assets/undraw_questions_g2px.svg"
export default function FaqSection() {
    const [activeSection, setActiveSection] = useState(null)

    const faqSections = [
        { id: 1, title: "Información General" },
        { id: 2, title: "Servicios y Tratamientos" },
        { id: 3, title: "Citas y Reservas" },
        { id: 4, title: "Costos y Pagos" },
        { id: 5, title: "Antes y Después de la Terapia" },
        { id: 6, title: "Instalaciones y Ubicación" },
        { id: 7, title: "Contacto y Horarios" },
    ]

    const toggleSection = (id) => {
        setActiveSection(activeSection === id ? null : id)
    }

    return (
        <div className="faq-container">
            <h1 className="faq-title">PREGUNTAS FRECUENTES</h1>

            <div className="faq-content">
                <div className="faq-sections">
                    {faqSections.map((section) => (
                        <div key={section.id} className="faq-accordion">
                            <button
                                className={`faq-button ${activeSection === section.id ? "faq-active" : ""}`}
                                onClick={() => toggleSection(section.id)}
                            >
                                {section.title}
                                <span className="faq-plus">+</span>
                            </button>
                            <div className={`faq-panel ${activeSection === section.id ? "faq-panel-open" : ""}`}>
                                <p>Contenido de {section.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="faq-help">


                    <Icon className="faq-help-image" />

                    <h3 className="faq-help-title">¿No se resolvió tu duda?</h3>
                    <p className="faq-help-subtitle">Puedes enviarnos cualquier duda que tengas</p>

                    <div className="faq-form">
                        <textarea className="faq-textarea" placeholder="Escribe aquí tu pregunta...." />
                        <button className="faq-submit">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

