"use client"

import { useOutletContext } from "react-router-dom"
import { Calendar, Clock, FileText, User, Bell, ArrowRight } from "lucide-react"
import "./styles/welcome.css"

const Welcome = () => {


  // Obtener la hora actual para personalizar el saludo
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  // Datos de ejemplo para próximas citas
  const upcomingAppointments = [
    {
      id: 1,
      date: "2023-11-15",
      time: "10:00 AM",
      doctor: "Dra. María Rodríguez",
      specialty: "Fisioterapia",
      location: "Consultorio 103",
    },
    {
      id: 2,
      date: "2023-11-22",
      time: "11:30 AM",
      doctor: "Dr. Juan Pérez",
      specialty: "Fisioterapia",
      location: "Consultorio 205",
    },
  ]

  // Datos de ejemplo para actividad reciente
  const recentActivity = [
    {
      id: 1,
      type: "appointment_completed",
      date: "2023-11-01",
      description: "Cita completada con Dr. Carlos Gómez",
    },
    {
      id: 2,
      type: "medical_record_downloaded",
      date: "2023-10-28",
      description: "Descarga de historial médico",
    },
    {
      id: 3,
      type: "appointment_scheduled",
      date: "2023-10-25",
      description: "Nueva cita agendada para el 15 de noviembre",
    },
  ]

  // Datos de ejemplo para indicadores de salud
  const healthMetrics = [
    {
      id: 1,
      name: "Progreso de rehabilitación",
      value: 75,
      unit: "%",
      trend: "up",
    },
    {
      id: 2,
      name: "Sesiones completadas",
      value: 8,
      unit: "de 12",
      trend: "neutral",
    },
    {
      id: 3,
      name: "Días desde última cita",
      value: 5,
      unit: "días",
      trend: "down",
    },
  ]

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="welcome-dashboard">
      <div className="welcome-header">
        <div className="welcome-greeting">
          <h1>
            {getGreeting()}, {"Usuario".split(" ")[0]}!
          </h1>
          <p>Bienvenido a tu panel de control personal</p>
        </div>
        <div className="welcome-date">
          <p>
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="welcome-grid">
        <div className="welcome-section upcoming-appointments">
          <div className="welcome-section-header">
            <h2>Próximas Citas</h2>
            <button className="welcome-view-all" onClick={() => (window.location.href = "/dashboard/appointments")}>
              Ver todas <ArrowRight size={16} />
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="welcome-empty-state">
              <Calendar size={48} />
              <p>No tienes citas programadas</p>
              <button
                className="welcome-action-button"
                onClick={() => (window.location.href = "/dashboard/appointments")}
              >
                Agendar Cita
              </button>
            </div>
          ) : (
            <div className="welcome-appointments-list">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="welcome-appointment-card">
                  <div className="welcome-appointment-date">
                    <Calendar size={20} />
                    <div>
                      <p className="welcome-appointment-day">{formatDate(appointment.date)}</p>
                      <p className="welcome-appointment-time">{appointment.time}</p>
                    </div>
                  </div>
                  <div className="welcome-appointment-details">
                    <p className="welcome-appointment-doctor">{appointment.doctor}</p>
                    <p className="welcome-appointment-location">{appointment.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="welcome-section quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="welcome-quick-actions-grid">
            <button className="welcome-quick-action" onClick={() => (window.location.href = "/dashboard/appointments")}>
              <Calendar size={24} />
              <span>Agendar Cita</span>
            </button>
            <button
              className="welcome-quick-action"
              onClick={() => (window.location.href = "/dashboard/medical-history")}
            >
              <FileText size={24} />
              <span>Ver Historial</span>
            </button>
            <button className="welcome-quick-action" onClick={() => (window.location.href = "/dashboard/profile")}>
              <User size={24} />
              <span>Editar Perfil</span>
            </button>
            <button
              className="welcome-quick-action"
              onClick={() => (window.location.href = "/dashboard/notifications")}
            >
              <Bell size={24} />
              <span>Notificaciones</span>
            </button>
          </div>
        </div>

        <div className="welcome-section health-metrics">
          <h2>Tu Progreso</h2>
          <div className="welcome-metrics-grid">
            {healthMetrics.map((metric) => (
              <div key={metric.id} className="welcome-metric-card">
                <div className="welcome-metric-header">
                  <h3>{metric.name}</h3>
                  <span className={`welcome-metric-trend ${metric.trend}`}>
                    {metric.trend === "up" && "↑"}
                    {metric.trend === "down" && "↓"}
                    {metric.trend === "neutral" && "→"}
                  </span>
                </div>
                <div className="welcome-metric-value">
                  <span className="welcome-metric-number">{metric.value}</span>
                  <span className="welcome-metric-unit">{metric.unit}</span>
                </div>
                {metric.id === 1 && (
                  <div className="welcome-progress-bar">
                    <div className="welcome-progress-fill" style={{ width: `${metric.value}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="welcome-section recent-activity">
          <div className="welcome-section-header">
            <h2>Actividad Reciente</h2>
          </div>
          <div className="welcome-activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="welcome-activity-item">
                <div className="welcome-activity-icon">
                  {activity.type === "appointment_completed" && <Clock size={16} />}
                  {activity.type === "medical_record_downloaded" && <FileText size={16} />}
                  {activity.type === "appointment_scheduled" && <Calendar size={16} />}
                </div>
                <div className="welcome-activity-content">
                  <p className="welcome-activity-description">{activity.description}</p>
                  <p className="welcome-activity-date">{formatDate(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome

