"use client"

import { useState } from "react"
import DashboardHeader from "./utils/adminDashboardHeader"
import StatCards from "./utils/statsCard"
import OverviewContent from "./utils/overviewContent"
import TabContent from "./utils/tabContent"
import DashboardTabs from "./utils/dashboardTabs"
import "./styles/index.css"


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="adminDashboard-container">
     
      {/* Main content */}
      <div className="adminDashboard-main">
        {/* Header */}
        <DashboardHeader />

        {/* Content */}
        <main className="adminDashboard-content">
          <StatCards />

          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "overview" && <OverviewContent />}

          {activeTab === "appointments" && (
            <TabContent
              title="Gestión de Citas"
              description="Administra todas las citas programadas"
              placeholder="Contenido de citas se mostrará aquí"
            />
          )}

          {activeTab === "patients" && (
            <TabContent
              title="Directorio de Pacientes"
              description="Gestiona la información de tus pacientes"
              placeholder="Contenido de pacientes se mostrará aquí"
            />
          )}

          {activeTab === "content" && (
            <TabContent
              title="Gestión de Contenido"
              description="Administra blogs y testimonios"
              placeholder="Contenido de blogs y testimonios se mostrará aquí"
            />
          )}
        </main>
      </div>
    </div>
  )
}

