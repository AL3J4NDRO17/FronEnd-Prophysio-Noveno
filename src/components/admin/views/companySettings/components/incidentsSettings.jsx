"use client"

import { useState } from "react"
import { Ban, AlertTriangle, Clock, User, Calendar, Search, RefreshCw } from "lucide-react" // Se 
import useLogs from "../hooks/useLogs"

const IncidentsSettings = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterRuta, setFilterRuta] = useState("all")
  const [filterMessage, setFilterMessage] = useState("")

  const today = new Date().toISOString().split("T")[0]
  const { logs: logEntries, loading: logsLoading, error: logsError, setDate, currentDate, fetchLogs } = useLogs(today)

  // Función para extraer información de usuario bloqueado de una entrada de log
  const extractBlockedUserInfo = (logEntry) => {
    if (!logEntry || typeof logEntry.mensaje !== "string") {
      return null // No es una entrada de log válida para extraer información de bloqueo
    }

    const message = logEntry.mensaje
    // Nuevo patrón para "Usuario [email] bloqueado por [razón]."
    const blockedUserRegex = /Usuario (.+?) bloqueado por (.+?)\./
    const match = message.match(blockedUserRegex)

    if (match) {
      const [, email, reason] = match
      return {
        id: logEntry.id, // Usar el ID del log para la clave única
        name: email.trim(), // Usamos el email como nombre si no hay un nombre explícito
        email: email.trim(),
        reason: reason.trim(),
        blockedAt: logEntry.timestamp,
        blockedBy: "Sistema", // Asumimos que es un bloqueo del sistema por intentos fallidos
        status: "Permanente", // Asumimos "Permanente" si no se especifica lo contrario
      }
    }
    // Fallback si el mensaje es más simple, solo contiene "Usuario bloqueado"
    // Esto es menos específico y podría capturar mensajes no deseados si no se ajusta el regex principal
    if (message.includes("Usuario bloqueado")) {
      return {
        id: logEntry.id,
        name: "Usuario Desconocido",
        email: "N/A",
        reason: message, // El mensaje completo como razón
        blockedAt: logEntry.timestamp,
        blockedBy: "Sistema",
        status: "Desconocido",
      }
    }
    return null // No es una entrada de log de usuario bloqueado
  }

  // Derivar usuarios bloqueados de los logs
  const blockedUsersFromLogs = logEntries.map(extractBlockedUserInfo).filter(Boolean)

  // Filtrar usuarios bloqueados por el término de búsqueda
  const filteredUsers = blockedUsersFromLogs.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filtrar entradas de log para la sección de Logger
  const filteredLogEntries = logEntries.filter((entry) => {
    // **CORRECCIÓN:** Asegurarse de que entry.mensaje sea una cadena antes de usar .toLowerCase()
    const entryMessage = typeof entry.mensaje === "string" ? entry.mensaje : ""

    const matchesLevel = filterLevel === "all" || entry.level.toLowerCase() === filterLevel.toLowerCase()
    const matchesRuta = filterRuta === "all" || entry.ruta.toLowerCase().includes(filterRuta.toLowerCase())
    const matchesMessage = filterMessage === "" || entryMessage.toLowerCase().includes(filterMessage.toLowerCase())
    return matchesLevel && matchesRuta && matchesMessage
  })

  const formatDate = (dateString) => {
    // Asume formato "YYYY-MM-DD HH:MM:SS"
    // **CORRECCIÓN:** Añadir un chequeo para dateString
    if (!dateString) return "N/A"
    const [datePart, timePart] = dateString.split(" ")
    const [year, month, day] = datePart.split("-")
    const [hour, minute, second] = timePart.split(":")
    const date = new Date(year, month - 1, day, hour, minute, second)
    return date.toLocaleString()
  }

  const getLogLevelClass = (level) => {
    // **CORRECCIÓN:** Añadir un chequeo para level
    if (typeof level !== "string") return ""

    switch (level.toUpperCase()) {
      case "ERROR":
        return "companySettings-log-error"
      case "WARNING":
      case "WARN": // Añadir 'WARN' para capturar ambos formatos
        return "companySettings-log-warning"
      case "INFO":
        return "companySettings-log-info"
      case "CRITICAL": // Nuevo caso para CRITICAL
        return "companySettings-log-critical"
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
                className="companySettings-search-input companySettings-input"
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
                {/* Selector de fecha para los logs */}
                <input
                  type="date"
                  className="companySettings-input companySettings-select"
                  value={currentDate}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={logsLoading}
                />
                <select
                  className="companySettings-select"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  disabled={logsLoading}
                >
                  <option value="all">Todos los niveles</option>
                  <option value="INFO">Info</option>
                  <option value="WARNING">Warning</option>
                  <option value="ERROR">Error</option>
                  <option value="CRITICAL">Critical</option> {/* Añadir opción para Critical */}
                </select>
                <select
                  className="companySettings-select"
                  value={filterRuta}
                  onChange={(e) => setFilterRuta(e.target.value)}
                  disabled={logsLoading}
                >
                  <option value="all">Todas las rutas</option>
                  <option value="/api/auth">/api/auth</option>
                  <option value="/api/companie">/api/companie</option>
                  <option value="/api/policies">/api/policies</option>
                  <option value="/api/faqs">/api/faqs</option>
                  <option value="/api/email">/api/email</option>
                  <option value="/db">/db</option>
                  <option value="/monitoring">/monitoring</option>
                  <option value="/system">/system</option>
                </select>
                {/* Campo de entrada para filtrar por mensaje */}
                <input
                  type="text"
                  placeholder="Filtrar por mensaje..."
                  className="companySettings-input"
                  value={filterMessage}
                  onChange={(e) => setFilterMessage(e.target.value)}
                  disabled={logsLoading}
                />
              </div>
              <button
                className="companySettings-button-outline"
                onClick={() => fetchLogs(currentDate)}
                disabled={logsLoading}
              >
                <RefreshCw className="companySettings-button-icon" />
                {logsLoading ? "Cargando..." : "Actualizar"}
              </button>
            </div>

            <div className="companySettings-logger-entries">
              {logsLoading ? (
                <p className="companySettings-no-results">Cargando entradas de registro...</p>
              ) : logsError ? (
                <p className="companySettings-error">Error al cargar los logs: {logsError}</p>
              ) : filteredLogEntries.length > 0 ? (
                filteredLogEntries.map((entry) => (
                  <div key={entry.id} className={`companySettings-log-entry ${getLogLevelClass(entry.level)}`}>
                    <div className="companySettings-log-header">
                      <div className="companySettings-log-level">
                        {/* Iconos basados en el nivel */}
                        {(entry.level.toUpperCase() === "ERROR" || entry.level.toUpperCase() === "CRITICAL") && (
                          <AlertTriangle className="companySettings-log-icon" />
                        )}
                        {(entry.level.toUpperCase() === "WARNING" || entry.level.toUpperCase() === "WARN") && (
                          <AlertTriangle className="companySettings-log-icon" />
                        )}
                        {entry.level.toUpperCase() === "INFO" && <Clock className="companySettings-log-icon" />}
                        <span>{entry.level.toUpperCase()}</span>
                      </div>
                      <div className="companySettings-log-source">{entry.ruta}</div>
                      <div className="companySettings-log-timestamp">{formatDate(entry.timestamp)}</div>
                    </div>
                    <div className="companySettings-log-message">{entry.mensaje}</div>
                    <div className="companySettings-log-details">
                      <small>
                        IP: {entry.ip} | Método: {entry.metodo} | Protocolo: {entry.protocolo}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="companySettings-no-results">
                  No se encontraron entradas de registro para la fecha seleccionada o los filtros aplicados.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentsSettings
