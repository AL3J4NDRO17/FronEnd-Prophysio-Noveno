"use client"

import { useState } from "react"
import { Ban, AlertTriangle, Clock, User, Calendar, Search, RefreshCw } from "lucide-react"

const IncidentsSettings = () => {
  const [searchTerm, setSearchTerm] = useState("")

  // Datos estáticos para la tabla de usuarios bloqueados
  const blockedUsers = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      reason: "Comportamiento inapropiado",
      blockedAt: "2023-10-15T14:30:00",
      blockedBy: "Admin",
      status: "Permanente",
    },
    {
      id: 2,
      name: "María López",
      email: "maria.lopez@example.com",
      reason: "Spam repetitivo",
      blockedAt: "2023-11-05T09:15:00",
      blockedBy: "Moderador",
      status: "Temporal (30 días)",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      reason: "Violación de términos de servicio",
      blockedAt: "2023-12-01T16:45:00",
      blockedBy: "Sistema",
      status: "Permanente",
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      reason: "Múltiples reportes de usuarios",
      blockedAt: "2024-01-10T11:20:00",
      blockedBy: "Admin",
      status: "Temporal (7 días)",
    },
    {
      id: 5,
      name: "Roberto Sánchez",
      email: "roberto.sanchez@example.com",
      reason: "Intento de acceso no autorizado",
      blockedAt: "2024-02-18T08:05:00",
      blockedBy: "Sistema",
      status: "Permanente",
    },
  ]

  // Datos estáticos para el logger
  const logEntries = [
    {
      id: 1,
      timestamp: "2024-03-01T08:30:45",
      level: "INFO",
      message: "Usuario admin inició sesión",
      source: "AuthService",
    },
    {
      id: 2,
      timestamp: "2024-03-01T09:15:22",
      level: "WARNING",
      message: "Intento fallido de inicio de sesión para usuario: roberto.sanchez@example.com",
      source: "AuthService",
    },
    {
      id: 3,
      timestamp: "2024-03-01T10:05:17",
      level: "ERROR",
      message: "Error en la conexión a la base de datos",
      source: "DatabaseService",
    },
    {
      id: 4,
      timestamp: "2024-03-01T11:30:05",
      level: "INFO",
      message: "Usuario bloqueado: ana.martinez@example.com",
      source: "UserService",
    },
    {
      id: 5,
      timestamp: "2024-03-01T12:45:33",
      level: "INFO",
      message: "Backup del sistema completado",
      source: "BackupService",
    },
    {
      id: 6,
      timestamp: "2024-03-01T14:20:11",
      level: "WARNING",
      message: "Uso elevado de CPU detectado",
      source: "MonitoringService",
    },
    {
      id: 7,
      timestamp: "2024-03-01T15:55:48",
      level: "ERROR",
      message: "Fallo en el proceso de envío de correos",
      source: "EmailService",
    },
  ]

  // Filtrar usuarios bloqueados según el término de búsqueda
  const filteredUsers = blockedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Obtener clase CSS según el nivel del log
  const getLogLevelClass = (level) => {
    switch (level) {
      case "ERROR":
        return "companySettings-log-error"
      case "WARNING":
        return "companySettings-log-warning"
      case "INFO":
        return "companySettings-log-info"
      default:
        return ""
    }
  }

  return (
    <div className="companySettings-incidents">
      <div className="companySettings-card">
        <div className="companySettings-card-header">
          <h2>Usuarios Bloqueados</h2>
          <p>Gestión de usuarios que han sido bloqueados en el sistema</p>
        </div>
        <div className="companySettings-card-content">
          <div className="companySettings-incidents-actions">
            <div className="companySettings-search-container">
              <Search className="companySettings-search-icon" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                className="companySettings-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="companySettings-button-outline">
              <RefreshCw className="companySettings-button-icon" />
              Actualizar
            </button>
          </div>

          <div className="companySettings-table-container">
            <table className="companySettings-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Razón</th>
                  <th>Fecha de bloqueo</th>
                  <th>Bloqueado por</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="companySettings-user-cell">
                          <div className="companySettings-user-avatar">
                            <User className="companySettings-user-icon" />
                          </div>
                          <div className="companySettings-user-info">
                            <div className="companySettings-user-name">{user.name}</div>
                            <div className="companySettings-user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{user.reason}</td>
                      <td>
                        <div className="companySettings-date-cell">
                          <Calendar className="companySettings-date-icon" />
                          <span>{formatDate(user.blockedAt)}</span>
                        </div>
                      </td>
                      <td>{user.blockedBy}</td>
                      <td>
                        <span
                          className={`companySettings-status-badge ${user.status.includes("Temporal") ? "companySettings-status-temporary" : "companySettings-status-permanent"}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="companySettings-table-actions">
                          <button className="companySettings-button-small companySettings-button-warning">
                            <Clock className="companySettings-button-icon-small" />
                            {user.status.includes("Permanente") ? "Hacer temporal" : "Hacer permanente"}
                          </button>
                          <button className="companySettings-button-small companySettings-button-danger">
                            <Ban className="companySettings-button-icon-small" />
                            Desbloquear
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="companySettings-no-results">
                      No se encontraron usuarios bloqueados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="companySettings-card">
        <div className="companySettings-card-header">
          <h2>Registro de Actividad (Logger)</h2>
          <p>Historial de eventos y actividades del sistema</p>
        </div>
        <div className="companySettings-card-content">
          <div className="companySettings-logger-container">
            <div className="companySettings-logger-header">
              <div className="companySettings-logger-filters">
                <select className="companySettings-select">
                  <option value="all">Todos los niveles</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                <select className="companySettings-select">
                  <option value="all">Todas las fuentes</option>
                  <option value="AuthService">AuthService</option>
                  <option value="UserService">UserService</option>
                  <option value="DatabaseService">DatabaseService</option>
                  <option value="EmailService">EmailService</option>
                </select>
              </div>
              <button className="companySettings-button-outline">
                <RefreshCw className="companySettings-button-icon" />
                Actualizar
              </button>
            </div>

            <div className="companySettings-logger-entries">
              {logEntries.map((entry) => (
                <div key={entry.id} className={`companySettings-log-entry ${getLogLevelClass(entry.level)}`}>
                  <div className="companySettings-log-header">
                    <div className="companySettings-log-level">
                      {entry.level === "ERROR" && <AlertTriangle className="companySettings-log-icon" />}
                      {entry.level === "WARNING" && <AlertTriangle className="companySettings-log-icon" />}
                      {entry.level === "INFO" && <Clock className="companySettings-log-icon" />}
                      <span>{entry.level}</span>
                    </div>
                    <div className="companySettings-log-source">{entry.source}</div>
                    <div className="companySettings-log-timestamp">{formatDate(entry.timestamp)}</div>
                  </div>
                  <div className="companySettings-log-message">{entry.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentsSettings

