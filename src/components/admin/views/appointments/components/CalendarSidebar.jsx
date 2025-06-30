"use client"
import { useState, useMemo } from "react"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../public_ui/card"
import { Badge } from "../../../../public_ui/badge"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
// Importar el CSS para la barra lateral

// Helper to get initials
const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?"
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
}


const CalendarSidebar = ({ citas }) => {
  const [activeTab, setActiveTab] = useState("queue") // 'queue' o 'history'

  const sortedCitas = useMemo(() => {
    return [...citas].sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
  }, [citas])

  const upcomingAppointments = useMemo(() => {
    return sortedCitas.filter((cita) => {
      const appDate = new Date(cita.fecha_hora)
      // Las citas futuras no deben ser canceladas, completadas o inasistencias
      return (
        appDate >= new Date() &&
        cita.estado !== "cancelada" &&
        cita.estado !== "completada" &&
        cita.estado !== "inasistencia"
      )
    })
  }, [sortedCitas])

  const pastAppointments = useMemo(() => {
    return sortedCitas.filter((cita) => {
      const appDate = new Date(cita.fecha_hora)
      // Las citas pasadas deben ser completadas o inasistencias, o simplemente haber pasado la fecha
      // Excluimos explícitamente las canceladas de aquí también si no quieres verlas en el historial
      return (
        (appDate < new Date() && cita.estado !== "cancelada") || // Si la fecha ya pasó Y NO está cancelada
        cita.estado === "completada" ||
        cita.estado === "inasistencia"
      )
    })
  }, [sortedCitas])

  const renderAppointmentItem = (appointment) => {
    const appDate = new Date(appointment.fecha_hora)
    let dateLabel = format(appDate, "dd MMM", { locale: es })
    if (isToday(appDate)) {
      dateLabel = "Hoy"
    } else if (isTomorrow(appDate)) {
      dateLabel = "Mañana"
    } else if (isPast(appDate)) {
      dateLabel = format(appDate, "dd MMM", { locale: es })
    }

    const timeLabel = format(appDate, "HH:mm", { locale: es })

    const getStatusVariant = (status) => {
      switch (status) {
        case "confirmada":
          return "success"
        case "pendiente":
          return "warning"
        case "cancelada":
          return "destructive"
        case "completada":
          return "default"
        case "postergada":
          return "info"
        case "inasistencia":
          return "secondary"
        default:
          return "default"
      }
    }

    return (
      <div key={appointment.id_cita} className="sidebar-appointment-item">
        <Avatar className="sidebar-appointment-avatar">
          <AvatarFallback>{getInitials(appointment.usuario?.nombre)}</AvatarFallback>
        </Avatar>
        <div className="sidebar-appointment-info">
          <span className="sidebar-appointment-patient-name">{appointment.usuario?.nombre}</span>
          <span className="sidebar-appointment-date-time">
            {dateLabel} - {timeLabel}
          </span>
        </div>
        <Badge variant={getStatusVariant(appointment.estado)} className="sidebar-appointment-status">
          {appointment.estado}
        </Badge>
      </div>
    )
  }

  return (
    <aside className="calendar-sidebar">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Cola de Pacientes</CardTitle>
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab-button ${activeTab === "queue" ? "active" : ""}`}
              onClick={() => setActiveTab("queue")}
            >
              Próximas ({upcomingAppointments.length})
            </button>
            <button
              className={`sidebar-tab-button ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Historial ({pastAppointments.length})
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {activeTab === "queue" && (
            <div className="sidebar-appointment-list">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(renderAppointmentItem)
              ) : (
                <p className="p-4 text-center text-gray-500">No hay próximas citas.</p>
              )}
            </div>
          )}
          {activeTab === "history" && (
            <div className="sidebar-appointment-list">
              {pastAppointments.length > 0 ? (
                pastAppointments.map(renderAppointmentItem)
              ) : (
                <p className="p-4 text-center text-gray-500">No hay historial de citas.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}

export default CalendarSidebar
