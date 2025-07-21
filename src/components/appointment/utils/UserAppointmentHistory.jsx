"use client"

import { useOutletContext } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@card"
import { Badge } from "@badge"
import { Calendar, Clock, Info, CheckCircle, XCircle, AlertCircle, FastForward, FileText } from "lucide-react" // Renombrar User a UserIcon para evitar conflicto
import "../styles/userAppointmentHistory.css" // Estilos específicos de la tarjeta de cita
import { useCitas } from "../hooks/useCitas"

const getStatusBadge = (status) => {
    let className = "status-badge"
    let text = status
    let icon = <Info className="status-badge-icon" />

    switch (status) {
        case "completada":
            className += " status-badge-success"
            text = "Completada"
            icon = <CheckCircle className="status-badge-icon" />
            break
        case "cancelada":
            className += " status-badge-destructive"
            text = "Cancelada"
            icon = <XCircle className="status-badge-icon" />
            break
        case "inasistencia":
            className += " status-badge-warning"
            text = "Inasistencia"
            icon = <AlertCircle className="status-badge-icon" />
            break
        case "postergada":
            className += " status-badge-secondary"
            text = "Postergada"
            icon = <FastForward className="status-badge-icon" />
            break
        default:
            className += " status-badge-default"
            text = status
            icon = <Info className="status-badge-icon" />
    }

    return (
        <Badge className={className}>
            {icon}
            {text}
        </Badge>
    )
}

export default function UserAppointmentHistory() {
    const { user } = useOutletContext()
    const { citas, loading: citasLoading, error: citasError } = useCitas()

    const userId = user?.id_Perfil
    // Filtrar citas para el historial: completadas, canceladas, inasistencia, o postergadas que ya pasaron
    const userHistoryAppointments = citas.filter(
        (cita) =>
            cita.id_usuario === userId &&
            (cita.estado === "completada" ||
                cita.estado === "cancelada" ||
                cita.estado === "inasistencia" ||
                (cita.estado === "postergada" && parseISO(cita.fecha_hora) < new Date())),
    )

    // Ordenar citas por fecha_hora de la más reciente a la más antigua
    const sortedAppointments = [...userHistoryAppointments].sort((a, b) => {
        return parseISO(b.fecha_hora).getTime() - parseISO(a.fecha_hora).getTime()
    })

    return (
        <div className="user-dashboard-history-container">
            <div className="user-dashboard-header">
                <h2 className="user-dashboard-title">Tu Historial de Citas</h2>
                <p className="user-dashboard-description">
                    Aquí puedes revisar todas tus citas pasadas y su estado, así como los documentos asociados.
                </p>
            </div>

            {citasLoading ? (
                <p className="appointment-history-message">Cargando historial de citas...</p>
            ) : citasError ? (
                <p className="appointment-history-message">Error al cargar el historial: {citasError.message}</p>
            ) : !sortedAppointments || sortedAppointments.length === 0 ? (
                <p className="appointment-history-message">No tienes citas en tu historial.</p>
            ) : (
                <div className="appointment-history-grid">
                    {sortedAppointments.map((appointment) => (
                        <Card key={appointment.id_cita} className="appointment-card">
                            <CardHeader className="appointment-card-header">
                                <CardTitle className="appointment-card-title">
                                    Cita con {appointment.usuario?.nombre || "Paciente Desconocido"}
                                </CardTitle>
                                {getStatusBadge(appointment.estado)}
                            </CardHeader>
                            <CardContent className="appointment-card-content">
                                <div className="appointment-detail-item">
                                    <Calendar className="appointment-detail-icon" />
                                    <span>
                                        Fecha:{" "}
                                        {format(parseISO(appointment.fecha_hora), "EEEE, dd 'de' MMMM 'de' yyyy", {
                                            locale: es,
                                        })}
                                    </span>
                                </div>
                                <div className="appointment-detail-item">
                                    <Clock className="appointment-detail-icon" />
                                    <span>
                                        Hora: {format(parseISO(appointment.fecha_hora), "HH:mm", { locale: es })} (Duración:{" "}
                                        {appointment.duracion || 60} min)
                                    </span>
                                </div>
                                {appointment.notes && (
                                    <div className="appointment-detail-item">
                                        <Info className="appointment-detail-icon" />
                                        <p>
                                            Notas: <span className="appointment-notes-text">{appointment.notes}</span>
                                        </p>
                                    </div>
                                )}
                                {/* Mostrar radiografías asociadas al perfil del usuario */}
                                {appointment.usuario?.perfil?.radiografias && appointment.usuario.perfil.radiografias.length > 0 && (
                                    <div className="appointment-detail-item radiography-section">
                                        <FileText className="appointment-detail-icon" />
                                        <div className="radiography-content">
                                            <p className="radiography-title">Documentos/Radiografías del paciente:</p>
                                            <ul className="radiography-list">
                                                {appointment.usuario.perfil.radiografias.map((radiografia) => (
                                                    <li key={radiografia.id_radiografia} className="radiography-item">
                                                        <a
                                                            href={radiografia.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="appointment-link"
                                                        >
                                                            {radiografia.descripcion ||
                                                                `Documento ${format(parseISO(radiografia.fecha_subida), "dd/MM/yyyy")}`}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {appointment.motivo_cancelacion && (
                                    <div className="appointment-detail-item">
                                        <XCircle className="appointment-detail-icon red" />
                                        <p>
                                            Motivo Cancelación:{" "}
                                            <span className="appointment-reason-text red">{appointment.motivo_cancelacion}</span>
                                        </p>
                                    </div>
                                )}
                                {appointment.motivo_postergacion && (
                                    <div className="appointment-detail-item">
                                        <FastForward className="appointment-detail-icon blue" />
                                        <p>
                                            Motivo Postergación:{" "}
                                            <span className="appointment-reason-text blue">{appointment.motivo_postergacion}</span>
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
