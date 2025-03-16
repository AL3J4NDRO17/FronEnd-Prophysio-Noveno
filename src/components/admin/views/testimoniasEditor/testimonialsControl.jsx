"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar,
  Check,
  X,
  Filter,
  MoreVertical,
  Settings,
  Clock,
} from "lucide-react"
import AdminLoader from "@uiLoader"
import "./styles/testimonialsControl.css"

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(null)
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  // Datos de ejemplo para testimonios
  const mockTestimonials = [
    {
      id: 1,
      name: "María García",
      avatar: null,
      rating: 5,
      text: "Excelente atención y profesionalismo. Después de 5 sesiones, mi dolor de espalda ha mejorado notablemente. Recomiendo ampliamente este servicio.",
      date: "2024-03-10",
      status: "published",
      service: "Fisioterapia",
      email: "maria.garcia@example.com",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      avatar: null,
      rating: 4,
      text: "Muy buena experiencia. El terapeuta fue muy atento y me explicó detalladamente el tratamiento. Aún estoy en proceso pero noto mejoría.",
      date: "2024-03-05",
      status: "published",
      service: "Rehabilitación",
      email: "carlos.rodriguez@example.com",
    },
    {
      id: 3,
      name: "Ana Martínez",
      avatar: null,
      rating: 5,
      text: "Increíble servicio. Me atendieron de emergencia y resolvieron mi problema en pocas sesiones. El personal es muy amable y las instalaciones son excelentes.",
      date: "2024-02-28",
      status: "published",
      service: "Terapia Manual",
      email: "ana.martinez@example.com",
    },
    {
      id: 4,
      name: "Roberto Sánchez",
      avatar: null,
      rating: 3,
      text: "El servicio es bueno, pero tuve que esperar más tiempo del programado para mi cita. La terapia ha sido efectiva pero creo que podrían mejorar la puntualidad.",
      date: "2024-02-20",
      status: "pending",
      service: "Fisioterapia Deportiva",
      email: "roberto.sanchez@example.com",
    },
    {
      id: 5,
      name: "Laura Fernández",
      avatar: null,
      rating: 5,
      text: "Llevo años con problemas de cervicales y es el único lugar donde he notado mejoría real. Los ejercicios que me enseñaron para hacer en casa han sido clave.",
      date: "2024-02-15",
      status: "pending",
      service: "Fisioterapia",
      email: "laura.fernandez@example.com",
    },
  ]

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonials(mockTestimonials)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Función para abrir el modal de edición/creación
  const handleOpenModal = (testimonial = null) => {
    setCurrentTestimonial(
      testimonial || {
        name: "",
        rating: 5,
        text: "",
        service: "",
        email: "",
        status: "pending",
      },
    )
    setIsModalOpen(true)
  }

  // Función para guardar un testimonio
  const handleSaveTestimonial = (testimonial) => {
    setIsLoading(true)

    // Simular guardado en la base de datos
    setTimeout(() => {
      if (testimonial.id) {
        // Actualizar testimonio existente
        setTestimonials(
          testimonials.map((t) =>
            t.id === testimonial.id
              ? { ...testimonial, date: testimonial.date || new Date().toISOString().split("T")[0] }
              : t,
          ),
        )
      } else {
        // Crear nuevo testimonio
        const newTestimonial = {
          ...testimonial,
          id: Math.max(0, ...testimonials.map((t) => t.id)) + 1,
          date: new Date().toISOString().split("T")[0],
        }
        setTestimonials([...testimonials, newTestimonial])
      }

      setIsModalOpen(false)
      setIsLoading(false)
    }, 800)
  }

  // Función para eliminar un testimonio
  const handleDeleteTestimonial = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este testimonio?")) {
      setIsLoading(true)

      // Simular eliminación
      setTimeout(() => {
        setTestimonials(testimonials.filter((t) => t.id !== id))
        setIsLoading(false)
      }, 600)
    }
  }

  // Función para cambiar el estado de un testimonio
  const handleToggleStatus = (id) => {
    setTestimonials(
      testimonials.map((t) => (t.id === id ? { ...t, status: t.status === "published" ? "pending" : "published" } : t)),
    )
  }

  // Filtrar y ordenar testimonios
  const filteredTestimonials = testimonials
    .filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.service.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || t.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let compareA, compareB

      switch (sortBy) {
        case "name":
          compareA = a.name
          compareB = b.name
          break
        case "rating":
          compareA = a.rating
          compareB = b.rating
          break
        case "service":
          compareA = a.service
          compareB = b.service
          break
        case "date":
        default:
          compareA = new Date(a.date)
          compareB = new Date(b.date)
      }

      return sortOrder === "asc" ? (compareA > compareB ? 1 : -1) : compareA < compareB ? 1 : -1
    })

  // Renderizar estrellas según la calificación
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`adminDashboard-testimonial-star ${index < rating ? "adminDashboard-testimonial-star-filled" : ""}`}
        />
      ))
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Obtener iniciales del nombre
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="adminDashboard-testimonials-container">
      {/* Header */}
      <div className="adminDashboard-testimonials-header">
        <div className="adminDashboard-testimonials-title">
          <h1>Gestión de Testimonios</h1>
          <p className="adminDashboard-testimonials-subtitle">Administra los testimonios de tus clientes</p>
        </div>
        <div className="adminDashboard-header-actions">
          <button className="adminDashboard-primary-button" onClick={() => handleOpenModal()}>
            <Plus className="adminDashboard-button-icon" />
            Nuevo Testimonio
          </button>
          <button className="adminDashboard-icon-button">
            <Settings className="adminDashboard-icon" />
          </button>
          <button className="adminDashboard-icon-button">
            <MoreVertical className="adminDashboard-icon" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="adminDashboard-testimonials-filters">
        <div className="adminDashboard-search-container">
          <Search className="adminDashboard-search-icon" />
          <input
            type="text"
            placeholder="Buscar testimonios..."
            className="adminDashboard-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="adminDashboard-testimonials-filter-actions">
          <div className="adminDashboard-filter-group">
            <Filter className="adminDashboard-filter-icon" />
            <select
              className="adminDashboard-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>

          <div className="adminDashboard-filter-group">
            <select className="adminDashboard-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Fecha</option>
              <option value="name">Nombre</option>
              <option value="rating">Calificación</option>
              <option value="service">Servicio</option>
            </select>
            <button
              className="adminDashboard-sort-button"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      {isLoading ? (
        <AdminLoader text="Cargando testimonios" />
      ) : (
        <div className="adminDashboard-testimonials-grid">
          {filteredTestimonials.length > 0 ? (
            filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="adminDashboard-testimonial-card">
                <div className="adminDashboard-testimonial-header">
                  <div className="adminDashboard-testimonial-user">
                    <div className="adminDashboard-testimonial-avatar">
                      {testimonial.avatar ? (
                        <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      ) : (
                        <div className="adminDashboard-testimonial-avatar-fallback">
                          {getInitials(testimonial.name)}
                        </div>
                      )}
                    </div>
                    <div className="adminDashboard-testimonial-user-info">
                      <h3 className="adminDashboard-testimonial-name">{testimonial.name}</h3>
                      <div className="adminDashboard-testimonial-meta">
                        <span className="adminDashboard-testimonial-service">{testimonial.service}</span>
                        <span className="adminDashboard-testimonial-date">
                          <Calendar className="adminDashboard-testimonial-meta-icon" />
                          {formatDate(testimonial.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="adminDashboard-testimonial-status">
                    <span
                      className={`adminDashboard-testimonial-badge adminDashboard-testimonial-badge-${testimonial.status}`}
                    >
                      {testimonial.status === "published" ? "Publicado" : "Pendiente"}
                    </span>
                  </div>
                </div>

                <div className="adminDashboard-testimonial-rating">{renderStars(testimonial.rating)}</div>

                <div className="adminDashboard-testimonial-content">
                  <p>{testimonial.text}</p>
                </div>

                <div className="adminDashboard-testimonial-actions">
                  <button
                    className="adminDashboard-icon-button-small"
                    onClick={() => handleToggleStatus(testimonial.id)}
                    title={testimonial.status === "published" ? "Marcar como pendiente" : "Publicar"}
                  >
                    {testimonial.status === "published" ? (
                      <X className="adminDashboard-icon-small" />
                    ) : (
                      <Check className="adminDashboard-icon-small" />
                    )}
                  </button>
                  <button
                    className="adminDashboard-icon-button-small"
                    onClick={() => handleOpenModal(testimonial)}
                    title="Editar"
                  >
                    <Edit className="adminDashboard-icon-small" />
                  </button>
                  <button
                    className="adminDashboard-icon-button-small"
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="adminDashboard-icon-small" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="adminDashboard-testimonials-empty">
              <p>No se encontraron testimonios</p>
              <button className="adminDashboard-secondary-button" onClick={() => handleOpenModal()}>
                <Plus className="adminDashboard-button-icon" />
                Agregar testimonio
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear/editar testimonios */}
      {isModalOpen && (
        <div className="adminDashboard-testimonials-modal-overlay">
          <div className="adminDashboard-testimonials-modal">
            <div className="adminDashboard-testimonials-modal-header">
              <h2>{currentTestimonial.id ? "Editar Testimonio" : "Nuevo Testimonio"}</h2>
              <button className="adminDashboard-icon-button-small" onClick={() => setIsModalOpen(false)}>
                <X className="adminDashboard-icon-small" />
              </button>
            </div>

            <div className="adminDashboard-testimonials-modal-content">
              <TestimonialForm
                testimonial={currentTestimonial}
                onSave={handleSaveTestimonial}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="adminDashboard-testimonials-stats">
        <div className="adminDashboard-testimonials-stats-card">
          <div className="adminDashboard-testimonials-stats-header">
            <h3>Estado de testimonios</h3>
          </div>
          <div className="adminDashboard-testimonials-stats-content">
            <div className="adminDashboard-testimonials-stats-item">
              <div className="adminDashboard-testimonials-stats-icon adminDashboard-testimonials-stats-icon-success">
                <Check />
              </div>
              <div className="adminDashboard-testimonials-stats-info">
                <span className="adminDashboard-testimonials-stats-label">Publicados</span>
                <span className="adminDashboard-testimonials-stats-value">
                  {testimonials.filter((t) => t.status === "published").length}
                </span>
              </div>
            </div>
            <div className="adminDashboard-testimonials-stats-item">
              <div className="adminDashboard-testimonials-stats-icon adminDashboard-testimonials-stats-icon-warning">
                <Clock />
              </div>
              <div className="adminDashboard-testimonials-stats-info">
                <span className="adminDashboard-testimonials-stats-label">Pendientes</span>
                <span className="adminDashboard-testimonials-stats-value">
                  {testimonials.filter((t) => t.status === "pending").length}
                </span>
              </div>
            </div>
            <div className="adminDashboard-testimonials-stats-item">
              <div className="adminDashboard-testimonials-stats-icon adminDashboard-testimonials-stats-icon-info">
                <Star />
              </div>
              <div className="adminDashboard-testimonials-stats-info">
                <span className="adminDashboard-testimonials-stats-label">Calificación promedio</span>
                <span className="adminDashboard-testimonials-stats-value">
                  {testimonials.length > 0
                    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                    : "0.0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de formulario para crear/editar testimonios
const TestimonialForm = ({ testimonial, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: testimonial.id || null,
    name: testimonial.name || "",
    email: testimonial.email || "",
    service: testimonial.service || "",
    rating: testimonial.rating || 5,
    text: testimonial.text || "",
    status: testimonial.status || "pending",
    date: testimonial.date || new Date().toISOString().split("T")[0],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form className="adminDashboard-testimonials-form" onSubmit={handleSubmit}>
      <div className="adminDashboard-testimonials-form-row">
        <div className="adminDashboard-testimonials-form-group">
          <label htmlFor="name">Nombre del cliente*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nombre completo"
          />
        </div>

        <div className="adminDashboard-testimonials-form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </div>
      </div>

      <div className="adminDashboard-testimonials-form-row">
        <div className="adminDashboard-testimonials-form-group">
          <label htmlFor="service">Servicio recibido*</label>
          <input
            type="text"
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            placeholder="Ej: Fisioterapia, Rehabilitación, etc."
          />
        </div>

        <div className="adminDashboard-testimonials-form-group">
          <label>Calificación*</label>
          <div className="adminDashboard-testimonials-rating-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`adminDashboard-testimonials-rating-star ${star <= formData.rating ? "active" : ""}`}
                onClick={() => handleRatingChange(star)}
              >
                <Star />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="adminDashboard-testimonials-form-group">
        <label htmlFor="text">Testimonio*</label>
        <textarea
          id="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Escribe aquí el testimonio del cliente..."
        ></textarea>
      </div>

      <div className="adminDashboard-testimonials-form-group">
        <label htmlFor="status">Estado</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pendiente</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <div className="adminDashboard-testimonials-form-actions">
        <button type="button" className="adminDashboard-secondary-button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="adminDashboard-primary-button">
          {testimonial.id ? "Actualizar testimonio" : "Crear testimonio"}
        </button>
      </div>
    </form>
  )
}

export default TestimonialsManager

