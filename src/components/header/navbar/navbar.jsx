"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, Calendar } from "lucide-react"
import "./styles/navbar.css"
import { useAuth } from "../../../context/authContext" // Import useAuth

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navContainer">
        <div className="navContent">
          <Link to="/" className="logoLink">
            <img
              src="/static/media/LOGO-OFICIAL.0681bd954899081caece.jpg"
              alt="ProPhysio Logo"
              className="logoImage"
              width="60"
              height="60"
            />
          </Link>

          <button
            className="mobileMenuButton"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`navMenu ${isMenuOpen ? "isOpen" : ""}`}>
            <div className="navLinks">
              <Link to="/" className="navLink" onClick={closeMenu}>
                Inicio
              </Link>
              <Link to="/services" className="navLink" onClick={closeMenu}>
                Servicios
              </Link>
              <Link to="/blog" className="navLink" onClick={closeMenu}>
                Blog
              </Link>
              <Link to="/about" className="navLink" onClick={closeMenu}>
                Acerca de
              </Link>
              <Link to="/location" className="navLink" onClick={closeMenu}>
                Ubicación
              </Link>
              
              {/* Mostrar solo el Panel de Admin o Panel de Empleado dependiendo del rol */}
              {user?.rol === "admin" && (
                <Link to="/admin" className="navLink" onClick={closeMenu}>
                  Panel de Admin
                </Link>
              )}
              {user?.rol === "empleado" && (
                <Link to="/empleado" className="navLink" onClick={closeMenu}>
                  Panel de Empleado
                </Link>
              )}
              {/* Si es un usuario normal, mostrar el menú desplegable */}
              {user?.rol === "usuario" && (
                <div className="userDropdown">
                  <button className="iconButton" aria-label="Menú de usuario">
                    <User size={20} />
                  </button>
                  <div className="dropdownContent">
                    {/* Mostrar Historial Médico solo para usuarios normales */}
                    <Link to="/HistorialMedico" className="dropdownItem" onClick={closeMenu}>
                      Historial Médico
                    </Link>
                    <Link to="/user" className="dropdownItem" onClick={closeMenu}>
                      Perfil
                    </Link>
                    <button className="dropdownItem" onClick={logout}>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="authSection">
              {user ? (
                <div className="userControls">
                  {/* Mostrar el botón de Calendario solo para usuarios que no sean admin o empleado */}
                  {user.rol !== "admin" && user.rol !== "empleado" && (
                    <Link to="/sheduler" className="iconButton" aria-label="Calendario">
                      <Calendar size={20} />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="authButtons">
                  <Link to="/login" className="loginButton" onClick={closeMenu}>
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="registerButton" onClick={closeMenu}>
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
