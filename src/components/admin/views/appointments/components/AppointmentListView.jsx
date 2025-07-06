"use client"

import { useMemo } from "react"
import { Eye, CalendarDays, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@button"
import { Avatar, AvatarFallback } from "@avatar"
import { format } from "date-fns"
import { es } from "date-fns/locale/es"
import "../styles/AppointmentListView.css"
// Helper to get initials
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Helper para formatear fecha y hora
const formatDateTime = (isoString) => {
  const date = new Date(isoString)
  return format(date, "dd MMMM yyyy HH:mm", { locale: es })
}

export default function AppointmentsListView({
  citas,
  onViewAppointmentDetails,
  onEditAppointment,
  onCancelAppointment,
  onPostponeAppointment,
  onMarkAttended,
  onMarkNoShow,
}) {
  const sortedCitas = useMemo(() => {
    return [...citas].sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
  }, [citas])

  return (
    <div className="appointments-list-view-container">
      {sortedCitas.length === 0 ? (
        <p className="text-center text-gray-500">No hay citas para mostrar en la lista.</p>
      ) : (
        <table className="appointments-list-table">
          <thead>
            <tr>
              <th className="appointments-list-th">Paciente</th>
              <th className="appointments-list-th">Fecha y Hora</th>
              <th className="appointments-list-th">Estado</th>
              <th className="appointments-list-th appointments-list-td-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedCitas.map((cita) => (
              <tr key={cita.id_cita}>
                <td className="appointments-list-td" data-label="Paciente">
                  <div className="appointments-list-patient-info">
                    <Avatar>
                      <AvatarFallback className="appointments-list-avatar">
                        {getInitials(cita.usuario?.nombre || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>{cita.usuario?.nombre || "Paciente Desconocido"}</div>
                  </div>
                </td>
                <td className="appointments-list-td" data-label="Fecha y Hora">
                  {formatDateTime(cita.fecha_hora)}
                </td>
                <td className="appointments-list-td" data-label="Estado">
                  <span className={`appointments-list-badge ${cita.estado}`}>{cita.estado}</span>
                </td>
                <td className="appointments-list-td appointments-list-td-actions" data-label="Acciones">
                  <div className="appointments-list-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewAppointmentDetails(cita)}
                      title="Ver Detalles"
                    >
                      <Eye className="appointmentsAdmin-icon-sm" />
                    </Button>
                    {cita.estado === "pendiente" || cita.estado === "confirmada" || cita.estado === "postergada" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPostponeAppointment(cita)}
                          title="Postergar Cita"
                        >
                          <CalendarDays className="appointmentsAdmin-icon-sm" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onCancelAppointment(cita)}
                          title="Cancelar Cita"
                        >
                          <XCircle className="appointmentsAdmin-icon-sm" />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onMarkAttended(cita.id_cita)}
                          title="Marcar como Asistida"
                        >
                          <CheckCircle className="appointmentsAdmin-icon-sm" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkNoShow(cita.id_cita)}
                          title="Marcar como Inasistencia"
                        >
                          <XCircle className="appointmentsAdmin-icon-sm" />
                        </Button>
                      </>
                    ) : null}
                    {/* Puedes añadir un botón de editar si lo necesitas */}
                    {/* <Button variant="outline" size="sm" onClick={() => onEditAppointment(cita)} title="Editar Cita">
                      <Edit className="appointmentsAdmin-icon-sm" />
                    </Button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
