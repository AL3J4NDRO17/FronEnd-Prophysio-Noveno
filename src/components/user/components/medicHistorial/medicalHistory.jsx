"use client"

import { useState } from "react"
import { FileText, Download, Calendar, Clock, AlertCircle } from "lucide-react"

const RequestMedicalHistory = () => {
  const [requestStatus, setRequestStatus] = useState("none") // none, pending, approved, denied
  const [requestReason, setRequestReason] = useState("")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      date: "2023-05-15",
      type: "Evaluación Inicial",
      doctor: "Dra. María Rodríguez",
      available: true,
    },
    {
      id: 2,
      date: "2023-06-02",
      type: "Seguimiento",
      doctor: "Dr. Juan Pérez",
      available: true,
    },
    {
      id: 3,
      date: "2023-08-22",
      type: "Evaluación Final",
      doctor: "Dr. Carlos Gómez",
      available: true,
    },
  ])

  const handleRequestSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío de solicitud
    setTimeout(() => {
      setRequestStatus("pending")
      setIsSubmitting(false)
    }, 1500)
  }

  const handleDownload = (recordId) => {
    // Simulación de descarga
    alert(`Descargando historial médico ID: ${recordId}`)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="medical-history-request">
      <div className="medical-history-header">
        <h2>Historial Clínico</h2>
        <p>Solicita o descarga tu historial clínico</p>
      </div>

      <div className="medical-history-tabs">
        <button className="medical-history-tab active">Historial Disponible</button>
        <button className="medical-history-tab">Solicitar Historial Completo</button>
      </div>

      <div className="medical-history-content">
        <div className="medical-history-section">
          <h3>Registros Médicos Disponibles</h3>
          <p className="medical-history-description">
            Estos son los registros médicos que puedes descargar inmediatamente. Para solicitar tu historial clínico
            completo, utiliza el formulario de solicitud.
          </p>

          {medicalRecords.length === 0 ? (
            <div className="medical-history-empty">
              <p>No hay registros médicos disponibles para descargar.</p>
            </div>
          ) : (
            <div className="medical-records-list">
              {medicalRecords.map((record) => (
                <div key={record.id} className="medical-record-card">
                  <div className="medical-record-info">
                    <div className="medical-record-type">
                      <FileText size={20} />
                      <h4>{record.type}</h4>
                    </div>
                    <div className="medical-record-details">
                      <div className="medical-record-detail">
                        <Calendar size={16} />
                        <span>{formatDate(record.date)}</span>
                      </div>
                      <div className="medical-record-detail">
                        <Clock size={16} />
                        <span>{record.doctor}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="medical-record-download"
                    onClick={() => handleDownload(record.id)}
                    disabled={!record.available}
                  >
                    <Download size={16} />
                    <span>Descargar</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="medical-history-section">
          <h3>Solicitar Historial Clínico Completo</h3>

          {requestStatus === "none" && (
            <form className="medical-history-form" onSubmit={handleRequestSubmit}>
              <div className="medical-history-form-group">
                <label htmlFor="dateFrom">Desde</label>
                <input
                  type="date"
                  id="dateFrom"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  required
                />
              </div>

              <div className="medical-history-form-group">
                <label htmlFor="dateTo">Hasta</label>
                <input
                  type="date"
                  id="dateTo"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  required
                />
              </div>

              <div className="medical-history-form-group">
                <label htmlFor="requestReason">Motivo de la solicitud</label>
                <textarea
                  id="requestReason"
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Explica brevemente por qué necesitas tu historial clínico completo"
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="medical-history-info-box">
                <AlertCircle size={20} />
                <p>
                  Tu solicitud será revisada por nuestro personal médico. El tiempo de respuesta es de aproximadamente
                  48 horas hábiles. Te notificaremos por correo electrónico cuando tu historial esté disponible para
                  descargar.
                </p>
              </div>

              <button type="submit" className="medical-history-submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Enviando solicitud..." : "Enviar Solicitud"}
              </button>
            </form>
          )}

          {requestStatus === "pending" && (
            <div className="medical-history-status pending">
              <div className="medical-history-status-icon">
                <Clock size={24} />
              </div>
              <div className="medical-history-status-content">
                <h4>Solicitud en Proceso</h4>
                <p>Tu solicitud de historial clínico está siendo procesada. Te notificaremos cuando esté lista.</p>
                <div className="medical-history-request-details">
                  <p>
                    <strong>Fecha de solicitud:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Período solicitado:</strong> {dateRange.from} al {dateRange.to}
                  </p>
                </div>
              </div>
            </div>
          )}

          {requestStatus === "approved" && (
            <div className="medical-history-status approved">
              <div className="medical-history-status-icon">
                <Download size={24} />
              </div>
              <div className="medical-history-status-content">
                <h4>Solicitud Aprobada</h4>
                <p>Tu historial clínico está listo para descargar. El archivo estará disponible por 7 días.</p>
                <button className="medical-history-download-button">
                  <Download size={16} />
                  <span>Descargar Historial Completo</span>
                </button>
              </div>
            </div>
          )}

          {requestStatus === "denied" && (
            <div className="medical-history-status denied">
              <div className="medical-history-status-icon">
                <AlertCircle size={24} />
              </div>
              <div className="medical-history-status-content">
                <h4>Solicitud Denegada</h4>
                <p>
                  Lo sentimos, tu solicitud no pudo ser procesada. Por favor, contacta a nuestro equipo de atención al
                  cliente para más información.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestMedicalHistory

