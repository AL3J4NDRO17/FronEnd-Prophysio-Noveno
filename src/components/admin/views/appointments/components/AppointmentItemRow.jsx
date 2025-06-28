"use client"

import { MoreVertical, Edit, Trash, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../public_ui/dropdown-menu" // Assuming shadcn components are available
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar" // Adjust the import path as necessary
import { Badge } from "../../../../public_ui/badge"

const AppointmentItemRow = ({
  cita,
  onEdit,
  onDelete,
  onCancel,
  onPostpone,
  onViewDetails,
  onViewPatientHistory,
  getInitials,
}) => {
  // Añadido onViewPatientHistory
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
      default:
        return "default"
    }
  }
  console.log("cita", cita)
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
      <td className="appointmentsAdmin-td">{cita.numero_sesion || "N/A"}</td> {/* Mostrar número de sesión */}
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
              {cita.estado !== "cancelada" && cita.estado !== "completada" && (
                <>
                  <DropdownMenuItem onClick={onCancel}>Cancelar Cita</DropdownMenuItem>
                  <DropdownMenuItem onClick={onPostpone}>Postergar Cita</DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => onViewPatientHistory(cita.id_paciente, cita.nombre_paciente)}>
                <Eye className="appointmentsAdmin-icon-sm mr-2" />
                Ver Historial de Citas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

export default AppointmentItemRow
