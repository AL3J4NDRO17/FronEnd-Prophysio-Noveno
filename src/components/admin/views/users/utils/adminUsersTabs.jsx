"use client"
import { Filter, Download } from "lucide-react"

function AdminUsersTabs({ activeTab, setActiveTab }) {
  return (
    <div className="usersAdmin-tabs-container">
      <div className="usersAdmin-tabs-header">
        <div className="usersAdmin-tabs-list">
          <button
            className={`usersAdmin-tab-item ${activeTab === "patients" ? "usersAdmin-active" : ""}`}
            onClick={() => setActiveTab("patients")}
          >
            <span className="usersAdmin-tab-text">Pacientes</span>
          </button>
          <button
            className={`usersAdmin-tab-item ${activeTab === "employees" ? "usersAdmin-active" : ""}`}
            onClick={() => setActiveTab("employees")}
          >
            <span className="usersAdmin-tab-text">Empleados</span>
          </button>
          <button
            className={`usersAdmin-tab-item ${activeTab === "admins" ? "usersAdmin-active" : ""}`}
            onClick={() => setActiveTab("admins")}
          >
            <span className="usersAdmin-tab-text">Admins</span>
          </button>
        </div>
        <div className="usersAdmin-tabs-actions">
          <button className="usersAdmin-btn usersAdmin-btn-outline">
            <Filter className="usersAdmin-btn-icon" />
            <span className="usersAdmin-btn-text">Filtrar</span>
          </button>
          <button className="usersAdmin-btn usersAdmin-btn-outline">
            <Download className="usersAdmin-btn-icon" />
            <span className="usersAdmin-btn-text">Exportar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersTabs

