"use client"

import { useState } from "react"
import { Pen, Trash2, X, ChevronDown, Plus } from "lucide-react"
import "./styles/testimonialsControl.css"

const AdminTestimonials = () => {
  const [showModal, setShowModal] = useState(false)
  const [testimonios] = useState([
    {
      id: 1,
      nombre: "Maria Garcia",
      especialidad: "Cardiología",
      testimonio: "Excelente atención en cardiología. El Dr. Rodríguez f...",
      calificacion: 5,
      fecha: "14 feb 2024",
    },
    {
      id: 2,
      nombre: "Juan Martinez",
      especialidad: "Odontología",
      testimonio: "Muy buena experiencia en odontología. Tratamiento ...",
      calificacion: 4,
      fecha: "9 feb 2024",
    },
    {
      id: 3,
      nombre: "Ana López",
      especialidad: "Pediatría",
      testimonio: "El pediatra fue muy paciente con mi hijo. Ambiente a...",
      calificacion: 5,
      fecha: "7 feb 2024",
    },
  ])

  const StarRating = ({ rating }) => {
    return (
      <div className="adminTestimonials-starRating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`adminTestimonials-star ${star <= rating ? "adminTestimonials-filled" : ""}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="adminTestimonials-container">
      <h1>Gestión de Testimonios</h1>

      <div className="adminTestimonials-controls">
        <div className="adminTestimonials-selectWrapper">
          <select defaultValue="">
            <option value="" disabled>
              Filtrar por...
            </option>
            <option>Todas las especialidades</option>
            <option>Cardiología</option>
            <option>Odontología</option>
            <option>Pediatría</option>
          </select>
          <ChevronDown className="adminTestimonials-selectIcon" />
        </div>

        <div className="adminTestimonials-selectWrapper">
          <select defaultValue="">
            <option value="" disabled>
              Ordenar por
            </option>
            <option>Fecha</option>
            <option>Calificación</option>
            <option>Nombre</option>
          </select>
          <ChevronDown className="adminTestimonials-selectIcon" />
        </div>

        <button className="adminTestimonials-btnDescendente">Descendente</button>

        <button className="adminTestimonials-btnNuevo" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nuevo Testimonio
        </button>
      </div>

      <div className="adminTestimonials-tableContainer">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Testimonio</th>
              <th>Calificación</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {testimonios.map((testimonio) => (
              <tr key={testimonio.id}>
                <td>{testimonio.nombre}</td>
                <td>{testimonio.especialidad}</td>
                <td>{testimonio.testimonio}</td>
                <td>
                  <StarRating rating={testimonio.calificacion} />
                </td>
                <td>{testimonio.fecha}</td>
                <td>
                  <div className="adminTestimonials-actions">
                    <button className="adminTestimonials-btnEdit">
                      <Pen size={16} />
                    </button>
                    <button className="adminTestimonials-btnDelete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="adminTestimonials-modalOverlay">
          <div className="adminTestimonials-modal">
            <div className="adminTestimonials-modalHeader">
              <h2>Nuevo Testimonio</h2>
              <button className="adminTestimonials-btnClose" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="adminTestimonials-form">
              <div className="adminTestimonials-formGroup">
                <label>Nombre</label>
                <input type="text" placeholder="Nombre del paciente" />
              </div>

              <div className="adminTestimonials-formGroup">
                <label>Especialidad</label>
                <div className="adminTestimonials-selectWrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Selecciona una especialidad
                    </option>
                    <option>Cardiología</option>
                    <option>Odontología</option>
                    <option>Pediatría</option>
                  </select>
                  <ChevronDown className="adminTestimonials-selectIcon" />
                </div>
              </div>

              <div className="adminTestimonials-formGroup">
                <label>Testimonio</label>
                <textarea placeholder="Escribe el testimonio aquí..." rows={4}></textarea>
              </div>

              <div className="adminTestimonials-formGroup">
                <label>Calificación</label>
                <div className="adminTestimonials-starRatingInput">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="adminTestimonials-star">
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="adminTestimonials-btnCrear">
                Crear Testimonio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTestimonials

