"use client"

import { Filter } from "lucide-react"

export default function DashboardTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Resumen" },
    { id: "appointments", label: "Citas" },
    { id: "patients", label: "Pacientes" },
    { id: "content", label: "Contenido" },
  ]

  return (
    <div className="adminDashboard-tabs">
      <div className="adminDashboard-tabs-header">
        <div className="adminDashboard-tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`adminDashboard-tab ${activeTab === tab.id ? "adminDashboard-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="adminDashboard-tabs-actions">
          <button className="adminDashboard-secondary-button">
            <Filter className="adminDashboard-button-icon" />
            Filtrar
          </button>
          <button className="adminDashboard-secondary-button">Exportar</button>
        </div>
      </div>
    </div>
  )
}

