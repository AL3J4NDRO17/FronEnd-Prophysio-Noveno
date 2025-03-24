"use client"

import { useState, useRef, useEffect } from "react"
import { MoreVertical, LogOut, User, Settings } from "lucide-react"
import { useAuth } from "../../../../context/authContext" // Importamos el hook de autenticación
import UserProfile from "./sidebarUser"

export default function SidebarFooter() {
  const { user, logout } = useAuth() // Obtenemos el usuario y la función de logout
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Obtener iniciales del nombre del usuario
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Manejar el cierre de sesión
  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <div className="adminDashboard-sidebar-footer">
      <div className="adminDashboard-user-container">
        <UserProfile
          name={user?.nombre|| "Usuario"}
          role={user?.rol || "Invitado"}
          initials={getInitials(user?.nombre)}
        />

        <div className="adminDashboard-user-menu" ref={menuRef}>
          <button
            className="adminDashboard-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Opciones de usuario"
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className="adminDashboard-dropdown">
              <div className="adminDashboard-dropdown-header">
                <span>Mi cuenta</span>
              </div>
              <div className="adminDashboard-dropdown-divider"></div>
              <a href="/profile" className="adminDashboard-dropdown-item">
                <User size={16} />
                <span>Perfil</span>
              </a>
              <a href="/settings" className="adminDashboard-dropdown-item">
                <Settings size={16} />
                <span>Configuración</span>
              </a>
              <div className="adminDashboard-dropdown-divider"></div>
              <button
                onClick={handleLogout}
                className="adminDashboard-dropdown-item adminDashboard-dropdown-item-danger"
              >
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

