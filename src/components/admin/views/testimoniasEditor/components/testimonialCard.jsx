"use client"

import { Star, Calendar } from "lucide-react"
import { EditButton, DeleteButton, PublishButton, UnpublishButton } from "@uiButtons"


const TestimonialCard = ({ testimonial, onEdit, onDelete, onToggleAprobado }) => {
    // Renderizar estrellas según la puntuación
    const renderStars = (puntaje) => {
        return Array(5)
            .fill(0)
            .map((_, index) => (
                <Star
                    key={index}
                    className={`adminDashboard-testimonial-star ${index < puntaje ? "adminDashboard-testimonial-star-filled" : ""}`}
                />
            ))
    }

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "Sin fecha"
        const options = { year: "numeric", month: "short", day: "numeric" }
        return new Date(dateString).toLocaleDateString("es-ES", options)
    }

    // Obtener iniciales del nombre
    const getInitials = (name) => {
        if (!name) return "??"
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <div className="adminDashboard-testimonial-card">
            <div className="adminDashboard-testimonial-header">
                <div className="adminDashboard-testimonial-user">
                    <div className="adminDashboard-testimonial-avatar">
                        <div className="adminDashboard-testimonial-avatar-fallback">{getInitials(testimonial.nombre_usuario)}</div>
                    </div>
                    <div className="adminDashboard-testimonial-user-info">
                        <h3 className="adminDashboard-testimonial-name">{testimonial.nombre_usuario}</h3>
                        <div className="adminDashboard-testimonial-meta">
                            <span className="adminDashboard-testimonial-date">
                                <Calendar className="adminDashboard-testimonial-meta-icon" />
                                {formatDate(testimonial.createdAt || testimonial.creado_el)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="adminDashboard-testimonial-status">
                    <span
                        className={`adminDashboard-testimonial-badge adminDashboard-testimonial-badge-${testimonial.aprobado ? "approved" : "pending"}`}
                    >
                        {testimonial.aprobado ? "Aprobado" : "Pendiente"}
                    </span>
                </div>
            </div>

            <div className="adminDashboard-testimonial-rating">{renderStars(testimonial.puntaje)}</div>

            <div className="adminDashboard-testimonial-content">
                <p>{testimonial.comentarios}</p>
            </div>

            <div className="adminDashboard-testimonial-actions testimonial-actions">
                {testimonial.aprobado ? (
                    <UnpublishButton
                        onClick={() => onToggleAprobado(testimonial.id_testimonio, false)}
                        title="Despublicar testimonio"
                    />
                ) : (
                    <PublishButton onClick={() => onToggleAprobado(testimonial.id_testimonio, true)} title="Aprobar testimonio" />
                )}
                <EditButton onClick={() => onEdit(testimonial)} />
                <DeleteButton onClick={() => onDelete(testimonial.id_testimonio)} />
            </div>
        </div>
    )
}

export default TestimonialCard

