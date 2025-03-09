import { Calendar } from "lucide-react"


export default function ScheduleAppointmentBanner() {
  return (
    <div className="schedule-appointment-banner">
      <div className="schedule-appointment-content">
        <Calendar className="schedule-appointment-icon" />
        <h3 className="schedule-appointment-title">¿Listo para mejorar tu salud?</h3>
        <p className="schedule-appointment-text">Agenda una cita con nuestros expertos hoy mismo</p>
      
      </div>
    </div>
  )
}

