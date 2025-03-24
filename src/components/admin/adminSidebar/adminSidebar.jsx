"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import SidebarHeader from "./components/sidebarHeader"
import SidebarNavigation from "./components/sidebarNavigation"
import SidebarFooter from "./components/sidebarFooter"
import "./styles/mobilSidebar.css"

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    // Comprobar al cargar
    checkIfMobile()

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Manejar el clic fuera del sidebar para cerrarlo en móvil
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".adminDashboard-sidebar")
      const toggle = document.querySelector(".adminDashboard-sidebar-toggle")

      if (isMobile && isOpen && sidebar && !sidebar.contains(event.target) && !toggle.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, isOpen])

  // Prevenir scroll cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobile, isOpen])

  return (
    <>
      {/* Botón de toggle para móvil */}
      <button
        className="adminDashboard-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para móvil */}
      {isMobile && isOpen && <div className="adminDashboard-sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div className={`adminDashboard-sidebar ${isOpen ? "open" : "closed"}`}>
        <SidebarHeader />
        <SidebarNavigation />
        <SidebarFooter />
      </div>
    </>
  )
}

