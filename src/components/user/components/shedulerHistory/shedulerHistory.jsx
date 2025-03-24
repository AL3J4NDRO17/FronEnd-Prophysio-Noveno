"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, User, FileText, Check, X } from "lucide-react"

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: "2023-05-15",
      time: "10:00 AM",
      doctor: "Dra. María Rodríguez",
      specialty: "Fisioterapia",
      location: "Consultorio 103",
      status: "completed",
      notes: "Terapia de rehabilitación para hombro. Se recomienda continuar con ejercicios en casa.",
    },
    {
      id: 2,
      date: "2023-06-02",
      time: "11:30 AM",
      doctor: "Dr. Juan Pérez",
      specialty: "Fisioterapia",
      location: "Consultorio 205",
      status: "completed",
      notes: "Seguimiento de rehabilitación. Mejora notable en movilidad.",
    },
    {
      id: 3,
      date: "2023-07-10",
      time: "09:15 AM",
      doctor: "Dra. María Rodríguez",
      specialty: "Fisioterapia",
      location: "Consultorio 103",
      status: "cancelled",
      notes: "Cita cancelada por el paciente.",
    },
    {
      id: 4,
      date: "2023-08-22",
      time: "16:00 PM",
      doctor: "Dr. Carlos Gómez",
      specialty: "Fisioterapia",
      location: "Consultorio 110",
      status: "completed",
      notes: "Evaluación final. Alta médica con recomendaciones de ejercicios preventivos.",
    },
  ])

  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [filter, setFilter] = useState("all")

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true
    return appointment.status === filter
  })

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
  }

  const closeDetails = () => {
    setSelectedAppointment(null)
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completada"
      case "cancelled":
        return "Cancelada"
      case "upcoming":
        return "Próxima"
      default:
        return status
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed"
      case "cancelled":
        return "status-cancelled"
      case "upcoming":
        return "status-upcoming"
      default:
        return ""
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="appointment-history">
      <div className="appointment-history-header">
        <h2>Historial de Citas</h2>
        <div className="appointment-history-filters">
          <button
            className={`appointment-history-filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={`appointment-history-filter ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completadas
          </button>
          <button
            className={`appointment-history-filter ${filter === "cancelled" ? "active" : ""}`}
            onClick={() => setFilter("cancelled")}
          >
            Canceladas
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="appointment-history-empty">
          <p>No hay citas que coincidan con el filtro seleccionado.</p>
        </div>
      ) : (
        <div className="appointment-history-list">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-card-header">
                <div className="appointment-card-date">
                  <Calendar size={16} />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className={`appointment-card-status ${getStatusClass(appointment.status)}`}>
                  {appointment.status === "completed" ? <Check size={14} /> : <X size={14} />}
                  <span>{getStatusLabel(appointment.status)}</span>
                </div>
              </div>
              <div className="appointment-card-body">
                <div className="appointment-card-info">
                  <div className="appointment-card-info-item">
                    <Clock size={16} />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="appointment-card-info-item">
                    <User size={16} />
                    <span>{appointment.doctor}</span>
                  </div>
                  <div className="appointment-card-info-item">
                    <MapPin size={16} />
                    <span>{appointment.location}</span>
                  </div>
                </div>
                <button className="appointment-card-details-button" onClick={() => handleViewDetails(appointment)}>
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <div className="appointment-details-modal">
          <div className="appointment-details-content">
            <button className="appointment-details-close" onClick={closeDetails}>
              &times;
            </button>
            <h3>Detalles de la Cita</h3>

            <div className="appointment-details-info">
              <div className="appointment-details-row">
                <div className="appointment-details-label">Fecha:</div>
                <div className="appointment-details-value">{formatDate(selectedAppointment.date)}</div>
              </div>
              <div className="appointment-details-row">
                <div className="appointment-details-label">Hora:</div>
                <div className="appointment-details-value">{selectedAppointment.time}</div>
              </div>
              <div className="appointment-details-row">
                <div className="appointment-details-label">Especialista:</div>
                <div className="appointment-details-value">{selectedAppointment.doctor}</div>
              </div>
              <div className="appointment-details-row">
                <div className="appointment-details-label">Especialidad:</div>
                <div className="appointment-details-value">{selectedAppointment.specialty}</div>
              </div>
              <div className="appointment-details-row">
                <div className="appointment-details-label">Ubicación:</div>
                <div className="appointment-details-value">{selectedAppointment.location}</div>
              </div>
              <div className="appointment-details-row">
                <div className="appointment-details-label">Estado:</div>
                <div className={`appointment-details-status ${getStatusClass(selectedAppointment.status)}`}>
                  {getStatusLabel(selectedAppointment.status)}
                </div>
              </div>
            </div>

            <div className="appointment-details-notes">
              <h4>Notas del Especialista</h4>
              <p>{selectedAppointment.notes}</p>
            </div>

            <div className="appointment-details-actions">
              <button className="appointment-details-download">
                <FileText size={16} />
                <span>Descargar Resumen</span>
              </button>
            </div>
          </div>
          <div className="appointment-details-overlay" onClick={closeDetails}></div>
        </div>
      )}
    </div>
  )
}

export default AppointmentHistory

