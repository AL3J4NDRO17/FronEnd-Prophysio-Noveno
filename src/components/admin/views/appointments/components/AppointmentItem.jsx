"use client"
import "../styles/AppointmentItem.css" // CSS específico

const AppointmentItem = ({ cita, onEdit, onDelete, onCancel, onPostpone }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no especificada"
    try {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      return dateString // Devuelve el string original si hay error
    }
  }

  return (
    <li className={`AppointmentItem-item AppointmentItem-status-${cita.estado?.toLowerCase() || "pendiente"}`}>
      <div className="AppointmentItem-info">
        <h3 className="AppointmentItem-patientName">{cita.nombre_paciente || "Paciente no asignado"}</h3>
        <p className="AppointmentItem-dateTime">Fecha: {formatDate(cita.fecha_cita)}</p>
        <p className="AppointmentItem-status">
          Estado: <span className="AppointmentItem-statusBadge">{cita.estado || "Pendiente"}</span>
        </p>
        {cita.motivo_cancelacion && (
          <p className="AppointmentItem-reason">Motivo cancelación: {cita.motivo_cancelacion}</p>
        )}
        {cita.motivo_postergacion && (
          <p className="AppointmentItem-reason">Motivo postergación: {cita.motivo_postergacion}</p>
        )}
      </div>
      <div className="AppointmentItem-actions">
        <button onClick={onEdit} className="AppointmentItem-button AppointmentItem-editButton">
          Editar
        </button>
        <button onClick={onDelete} className="AppointmentItem-button AppointmentItem-deleteButton">
          Eliminar
        </button>
        {cita.estado !== "cancelada" &&
          cita.estado !== "completada" && ( // Solo mostrar si no está cancelada o completada
            <>
              <button onClick={onCancel} className="AppointmentItem-button AppointmentItem-cancelButton">
                Cancelar Cita
              </button>
              <button onClick={onPostpone} className="AppointmentItem-button AppointmentItem-postponeButton">
                Postergar Cita
              </button>
            </>
          )}
      </div>
    </li>
  )
}

export default AppointmentItem
