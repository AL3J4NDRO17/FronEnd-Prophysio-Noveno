"use client"

import { useState } from "react"
import AdminUsersTabs from "./utils/adminUsersTabs";
import { Search, Plus, MoreVertical, Edit, FileText, Calendar } from "lucide-react"
import "./styles/usersView.css"

function DirectoryPage() {
  const [activeTab, setActiveTab] = useState("patients")

  // Datos de ejemplo
  const patients = [
    {
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      phone: "+34 612 345 678",
      lastVisit: "24/2/2025",
      status: "Activo",
    },
    {
      name: "Juan López",
      email: "juan.lopez@example.com",
      phone: "+34 623 456 789",
      lastVisit: "20/2/2025",
      status: "Activo",
    },
    {
      name: "Roberto Campos",
      email: "roberto.campos@example.com",
      phone: "+34 634 567 890",
      lastVisit: "15/2/2025",
      status: "Activo",
    },
    {
      name: "María Torres",
      email: "maria.torres@example.com",
      phone: "+34 645 678 901",
      lastVisit: "10/2/2025",
      status: "Inactivo",
    },
    {
      name: "Carlos Mendoza",
      email: "carlos.mendoza@example.com",
      phone: "+34 656 789 012",
      lastVisit: "5/2/2025",
      status: "Nuevo",
    },
  ]

  const recentPatients = [
    { name: "Rosa López", date: "1/3/2025", reason: "Evaluación inicial" },
    { name: "Pedro Sánchez", date: "28/2/2025", reason: "Dolor de espalda" },
    { name: "Laura Gómez", date: "25/2/2025", reason: "Rehabilitación" },
    { name: "Miguel Ángel", date: "22/2/2025", reason: "Lesión deportiva" },
  ]

  const appointments = [
    { name: "Ana Martínez", date: "Hoy", time: "15:30", type: "Seguimiento" },
    { name: "Juan López", date: "Mañana", time: "10:00", type: "Terapia" },
    { name: "Roberto Campos", date: "Mañana", time: "12:30", type: "Evaluación" },
    { name: "María Torres", date: "Viernes", time: "16:00", type: "Masaje" },
  ]

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Activo":
        return "usersAdmin-badge usersAdmin-badge-active"
      case "Inactivo":
        return "usersAdmin-badge usersAdmin-badge-inactive"
      default:
        return "usersAdmin-badge usersAdmin-badge-new"
    }
  }

  return (
    <div className="usersAdmin-container">
      {/* Header */}
      <header className="usersAdmin-header">
        <div className="usersAdmin-header-title">
          <h1 className="usersAdmin-title">Directorio de Pacientes</h1>
        </div>
        <div className="usersAdmin-header-actions">
          <div className="usersAdmin-search-container">
            <Search className="usersAdmin-search-icon" />
            <input type="text" placeholder="Buscar pacientes..." className="usersAdmin-search-input" />
          </div>
          <button className="usersAdmin-btn usersAdmin-btn-primary">
            <Plus className="usersAdmin-btn-icon" />
            <span className="usersAdmin-btn-text">Nuevo paciente</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="usersAdmin-content">
        <AdminUsersTabs  activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "patients" && (
          <div className="usersAdmin-card">
            <div className="usersAdmin-card-header">
              <h2 className="usersAdmin-card-title">Todos los pacientes</h2>
            </div>
            <div className="usersAdmin-card-content">
              <table className="usersAdmin-table">
                <thead className="usersAdmin-table-head">
                  <tr className="usersAdmin-table-row">
                    <th className="usersAdmin-table-header usersAdmin-col-name">Nombre</th>
                    <th className="usersAdmin-table-header">Contacto</th>
                    <th className="usersAdmin-table-header">Última visita</th>
                    <th className="usersAdmin-table-header">Estado</th>
                    <th className="usersAdmin-table-header usersAdmin-col-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody className="usersAdmin-table-body">
                  {patients.map((patient, i) => (
                    <tr key={i} className="usersAdmin-table-row">
                      <td className="usersAdmin-table-cell">
                        <div className="usersAdmin-user-info">
                          <div className="usersAdmin-avatar">
                            <div className="usersAdmin-avatar-fallback">{getInitials(patient.name)}</div>
                          </div>
                          <div className="usersAdmin-user-details">
                            <div className="usersAdmin-user-name">{patient.name}</div>
                            <div className="usersAdmin-user-email">{patient.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="usersAdmin-table-cell">
                        <div className="usersAdmin-user-phone">{patient.phone}</div>
                      </td>
                      <td className="usersAdmin-table-cell">{patient.lastVisit}</td>
                      <td className="usersAdmin-table-cell">
                        <span className={getStatusClass(patient.status)}>{patient.status}</span>
                      </td>
                      <td className="usersAdmin-table-cell usersAdmin-actions-cell">
                        <div className="usersAdmin-actions-container">
                          <button className="usersAdmin-btn usersAdmin-btn-icon">
                            <FileText className="usersAdmin-icon-sm" />
                          </button>
                          <button className="usersAdmin-btn usersAdmin-btn-icon">
                            <Calendar className="usersAdmin-icon-sm" />
                          </button>
                          <button className="usersAdmin-btn usersAdmin-btn-icon">
                            <Edit className="usersAdmin-icon-sm" />
                          </button>
                          <button className="usersAdmin-btn usersAdmin-btn-icon">
                            <MoreVertical className="usersAdmin-icon-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="usersAdmin-card">
            <div className="usersAdmin-card-header">
              <h2 className="usersAdmin-card-title">Empleados</h2>
            </div>
            <div className="usersAdmin-card-content">
              <p className="usersAdmin-empty-content">Contenido de empleados se mostrará aquí</p>
            </div>
          </div>
        )}

        {activeTab === "admins" && (
          <div className="usersAdmin-card">
            <div className="usersAdmin-card-header">
              <h2 className="usersAdmin-card-title">Administradores</h2>
            </div>
            <div className="usersAdmin-card-content">
              <p className="usersAdmin-empty-content">Contenido de administradores se mostrará aquí</p>
            </div>
          </div>
        )}

        <div className="usersAdmin-stats-grid">
          <div className="usersAdmin-card">
            <div className="usersAdmin-card-header">
              <h2 className="usersAdmin-card-title">Estadísticas de pacientes</h2>
            </div>
            <div className="usersAdmin-card-content">
              <div className="usersAdmin-stats-list">
                <div className="usersAdmin-stat-item">
                  <span className="usersAdmin-stat-label">Total de pacientes</span>
                  <span className="usersAdmin-stat-value">248</span>
                </div>
                <div className="usersAdmin-stat-item">
                  <span className="usersAdmin-stat-label">Pacientes activos</span>
                  <span className="usersAdmin-stat-value">186</span>
                </div>
                <div className="usersAdmin-stat-item">
                  <span className="usersAdmin-stat-label">Pacientes inactivos</span>
                  <span className="usersAdmin-stat-value">42</span>
                </div>
                <div className="usersAdmin-stat-item">
                  <span className="usersAdmin-stat-label">Nuevos este mes</span>
                  <span className="usersAdmin-stat-value">20</span>
                </div>
              </div>
            </div>
          </div>

          <div className="usersAdmin-card">
            <div className="usersAdmin-card-header">
              <h2 className="usersAdmin-card-title">Pacientes recientes</h2>
            </div>
            <div className="usersAdmin-card-content">
              <div className="usersAdmin-user-list">
                {recentPatients.map((patient, i) => (
                  <div key={i} className="usersAdmin-user-list-item">
                    <div className="usersAdmin-avatar">
                      <div className="usersAdmin-avatar-fallback">{getInitials(patient.name)}</div>
                    </div>
                    <div className="usersAdmin-user-details">
                      <div className="usersAdmin-user-name">{patient.name}</div>
                      <div className="usersAdmin-user-detail">
                        {patient.date} • {patient.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="usersAdmin-card">
            <div className="usersAdmin-card-header">
              <h2 className="usersAdmin-card-title">Próximas citas</h2>
            </div>
            <div className="usersAdmin-card-content">
              <div className="usersAdmin-user-list">
                {appointments.map((appointment, i) => (
                  <div key={i} className="usersAdmin-user-list-item">
                    <div className="usersAdmin-calendar-icon">
                      <Calendar className="usersAdmin-icon-sm" />
                    </div>
                    <div className="usersAdmin-user-details">
                      <div className="usersAdmin-user-name">{appointment.name}</div>
                      <div className="usersAdmin-user-detail">
                        {appointment.date} • {appointment.time} • {appointment.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DirectoryPage

