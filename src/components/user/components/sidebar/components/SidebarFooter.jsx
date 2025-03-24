"use client"

import { useState } from "react"
import { Settings, LogOut, ChevronRight } from "lucide-react"


const SidebarFooter = ({ handleNavigation }) => {
  const [showSettings, setShowSettings] = useState(false)

  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión
    alert("Cerrando sesión...")
  }

  return (
    <div className="sidebar-footer">
      <div className="sidebar-settings-menu">
        <div className="sidebar-settings-header" onClick={() => setShowSettings(!showSettings)}>
          <Settings size={20} />
          <span>Configuración</span>
          <ChevronRight size={16} className={`sidebar-chevron ${showSettings ? "rotate" : ""}`} />
        </div>

        {showSettings && (
          <ul className="sidebar-settings-submenu">
            <li onClick={() => handleNavigation("/dashboard/notifications")}>Notificaciones</li>
            <li onClick={() => handleNavigation("/dashboard/privacy")}>Privacidad</li>
            <li onClick={() => handleNavigation("/dashboard/security")}>Seguridad</li>
          </ul>
        )}
      </div>

      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  )
}

export default SidebarFooter

