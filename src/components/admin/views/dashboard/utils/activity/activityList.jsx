import { Users, FileText, MessageSquare, ClipboardCheck } from "lucide-react"

export default function ActivityList() {
  const activities = [
    {
      icon: Users,
      color: "blue",
      text: "Nuevo paciente",
      action: "registrado",
      time: "Hace 25 minutos",
    },
    {
      icon: FileText,
      color: "green",
      text: "Nuevo artículo",
      action: "publicado en el blog",
      time: "Hace 1 hora",
    },
    {
      icon: MessageSquare,
      color: "purple",
      text: "Nuevo testimonio",
      action: "recibido",
      time: "Hace 3 horas",
    },
    {
      icon: ClipboardCheck,
      color: "amber",
      text: "Auditoría mensual",
      action: "completada",
      time: "Hace 5 horas",
    },
  ]

  return (
    <div className="adminDashboard-card">
      <div className="adminDashboard-card-header-full">
        <h3 className="adminDashboard-card-title-large">Actividad reciente</h3>
        <p className="adminDashboard-card-description">Últimas actualizaciones</p>
      </div>
      <div className="adminDashboard-card-content-full">
        <div className="adminDashboard-activity-list">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div key={index} className="adminDashboard-activity-item">
                <div className={`adminDashboard-activity-icon adminDashboard-activity-icon-${activity.color}`}>
                  <Icon className="adminDashboard-icon-small" />
                </div>
                <div className="adminDashboard-activity-info">
                  <p className="adminDashboard-activity-text">
                    <span className="adminDashboard-activity-highlight">{activity.text}</span> {activity.action}
                  </p>
                  <p className="adminDashboard-activity-time">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="adminDashboard-card-footer">
        <button className="adminDashboard-text-button adminDashboard-text-button-full">Ver toda la actividad</button>
      </div>
    </div>
  )
}

