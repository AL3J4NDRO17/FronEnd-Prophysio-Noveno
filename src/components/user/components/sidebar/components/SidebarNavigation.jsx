"use client"

import { Home, User, Calendar, Clock, FileText } from "lucide-react"


const SidebarNavigation = ({ isActive, handleNavigation }) => {
  const menuItems = [
    { path: "/user", icon: Home, label: "Inicio" },
    { path: "/user/profile", icon: User, label: "Mi Perfil" },
    { path: "/user/appointments", icon: Calendar, label: "Agendar Cita" },
    { path: "/user/history", icon: Clock, label: "Historial de Citas" },
    { path: "/user/medical-history", icon: FileText, label: "Historial Clínico" },
  ]

  return (
    <nav className="sidebar-navigation">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={isActive(item.path) ? "active" : ""}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default SidebarNavigation

