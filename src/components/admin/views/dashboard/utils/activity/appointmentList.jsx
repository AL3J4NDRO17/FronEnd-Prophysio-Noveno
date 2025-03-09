import { Calendar, MoreVertical } from "lucide-react"

export default function AppointmentsList() {
  const appointments = [
    {
      initials: "AM",
      name: "Ana Martínez",
      type: "Evaluación inicial",
      time: "10:00 AM",
      duration: "30 min",
    },
    {
      initials: "JL",
      name: "Juan López",
      type: "Terapia de rehabilitación",
      time: "11:30 AM",
      duration: "45 min",
    },
    {
      initials: "RC",
      name: "Roberto Campos",
      type: "Seguimiento",
      time: "2:15 PM",
      duration: "30 min",
    },
    {
      initials: "MT",
      name: "María Torres",
      type: "Masaje terapéutico",
      time: "4:00 PM",
      duration: "60 min",
    },
  ]

  return (
    <div className="adminDashboard-card adminDashboard-appointments-card">
      <div className="adminDashboard-card-header-full">
        <h3 className="adminDashboard-card-title-large">Citas próximas</h3>
        <p className="adminDashboard-card-description">Tienes 8 citas programadas para hoy</p>
      </div>
      <div className="adminDashboard-card-content-full">
        <div className="adminDashboard-appointments-list">
          {appointments.map((appointment, i) => (
            <div key={i} className="adminDashboard-appointment-item">
              <div className="adminDashboard-avatar">
                <div className="adminDashboard-avatar-fallback">{appointment.initials}</div>
              </div>
              <div className="adminDashboard-appointment-info">
                <p className="adminDashboard-appointment-name">{appointment.name}</p>
                <p className="adminDashboard-appointment-type">{appointment.type}</p>
              </div>
              <div className="adminDashboard-appointment-time">
                <p className="adminDashboard-appointment-hour">{appointment.time}</p>
                <p className="adminDashboard-appointment-duration">{appointment.duration}</p>
              </div>
              <button className="adminDashboard-icon-button-small">
                <MoreVertical className="adminDashboard-icon-small" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="adminDashboard-card-footer">
        <button className="adminDashboard-text-button">Ver todas las citas</button>
        <button className="adminDashboard-secondary-button-small">
          <Calendar className="adminDashboard-button-icon-small" />
          Calendario
        </button>
      </div>
    </div>
  )
}

