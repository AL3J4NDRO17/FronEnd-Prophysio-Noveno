import { Bell, Settings, Search, Plus } from "lucide-react"

export default function DashboardHeader() {
  return (
    <header className="adminDashboard-header">
      <div className="adminDashboard-header-left">
        <h1 className="adminDashboard-title">Dashboard</h1>
        <div className="adminDashboard-period-selector">
          <select className="adminDashboard-select">
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
        </div>
      </div>
      <div className="adminDashboard-header-right">
        <div className="adminDashboard-search-container">
          <Search className="adminDashboard-search-icon" />
          <input type="text" placeholder="Buscar..." className="adminDashboard-search-input" />
        </div>
        <button className="adminDashboard-icon-button adminDashboard-notification-button">
          <Bell className="adminDashboard-icon" />
          <span className="adminDashboard-notification-indicator"></span>
        </button>
        <button className="adminDashboard-icon-button">
          <Settings className="adminDashboard-icon" />
        </button>
        <button className="adminDashboard-primary-button">
          <Plus className="adminDashboard-button-icon" />
          Nueva cita
        </button>
      </div>
    </header>
  )
}

