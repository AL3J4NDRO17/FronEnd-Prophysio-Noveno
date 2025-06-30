"use client"

import { MoreVertical, Edit, Trash, Eye, CheckCircle, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../public_ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
import { Badge } from "../../../../public_ui/badge"

const AppointmentItemRow = ({
  cita,
  onEdit,
  onDelete,
  onCancel,
  onPostpone,
  onViewPatientHistory,
  onMarkAttended, // Nueva prop
  onMarkNoShow, // Nueva prop
  getInitials,
}) => {
  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (e) {
      return "Hora inválida"
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmada":
        return "confirmed"
      case "pendiente":
        return "pending"
      case "cancelada":
        return "cancelled"
      case "postergada":
        return "pending"
      case "completada":
        return "confirmed"
      case "inasistencia": // Nuevo estado
        return "inasistencia" // Usar el nuevo estilo de badge
      default:
        return "default"
    }
  }

  const isActionable = cita.estado !== "cancelada" && cita.estado !== "completada" && cita.estado !== "inasistencia"
  const isCompletedOrNoShow = cita.estado === "completada" || cita.estado === "inasistencia"

  return (
    <tr>
      <td className="appointmentsAdmin-td appointmentsAdmin-td-time">{formatTime(cita.fecha_hora)}</td>
      <td className="appointmentsAdmin-td">
        <div className="appointmentsAdmin-patient-info">
          <Avatar>
            <AvatarFallback>{getInitials(cita.nombre_paciente)}</AvatarFallback>
          </Avatar>
          <div>{cita.nombre_paciente || "N/A"}</div>
        </div>
      </td>
      <td className="appointmentsAdmin-td">{cita.numero_sesion || "N/A"}</td>
      <td className="appointmentsAdmin-td">{cita.duracion ? `${cita.duracion} min` : "N/A"}</td>
      <td className="appointmentsAdmin-td">
        <Badge variant={getStatusBadgeVariant(cita.estado)}>{cita.estado || "Pendiente"}</Badge>
      </td>
      <td className="appointmentsAdmin-td appointmentsAdmin-td-actions">
        <div className="appointmentsAdmin-actions">
          <button onClick={onEdit} className="appointmentsAdmin-btn appointmentsAdmin-btn-icon" title="Editar">
            <Edit className="appointmentsAdmin-icon-sm" />
          </button>
          <button onClick={onDelete} className="appointmentsAdmin-btn appointmentsAdmin-btn-icon" title="Eliminar">
            <Trash className="appointmentsAdmin-icon-sm" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon" title="Más opciones">
                <MoreVertical className="appointmentsAdmin-icon-sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isActionable && (
                <>
                  <DropdownMenuItem onClick={onCancel}>Cancelar Cita</DropdownMenuItem>
                  <DropdownMenuItem onClick={onPostpone}>Postergar Cita</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onMarkAttended(cita)}>
                    <CheckCircle className="appointmentsAdmin-icon-sm mr-2" />
                    Marcar como Asistida
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onMarkNoShow(cita)}>
                    <XCircle className="appointmentsAdmin-icon-sm mr-2" />
                    Marcar como Inasistencia
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => onViewPatientHistory(cita)}>
                <Eye className="appointmentsAdmin-icon-sm mr-2" />
                Ver Detalles/Historial
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

export default AppointmentItemRow
