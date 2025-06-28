"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, Calendar } from "lucide-react"
import "./styles/navbar.css"
import { useAuth } from "@authContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const userDropdownRef = useRef(null)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen)

  // Services data for dropdown
  const servicesItems = [
    { title: "Fisioterapia Pediátrica", path: "/service1" },
    { title: "Fisioterapia Ortopédica", path: "/service2" },
    { title: "Fisioterapia Oncológica", path: "/service3" },
  ]

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} aria-label="Navegación principal">
      <div className="nav-container">
        <div className="nav-content">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <img
              src="/static/media/LOGO-OFICIAL.0681bd954899081caece.jpg"
              alt="ProPhysio Logo"
              className="logo-image"
              width="60"
              height="60"
            />
          </Link>

          <button
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}>
            <div className="nav-links">
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Inicio
              </Link>

              <Link to="/services" className="nav-link" onClick={closeMenu}>
                Servicios
              </Link>

              <Link to="/blog" className="nav-link" onClick={closeMenu}>
                Blog
              </Link>
              <Link to="/about" className="nav-link" onClick={closeMenu}>
                Acerca de
              </Link>
              <Link to="/location" className="nav-link" onClick={closeMenu}>
                Ubicación
              </Link>

              {/* Admin or Employee Panel based on role */}
              {user?.rol === "admin" && (
                <Link to="/admin" className="nav-link" onClick={closeMenu}>
                  Panel de Admin
                </Link>
              )}
              {user?.rol === "empleado" && (
                <Link to="/empleado" className="nav-link" onClick={closeMenu}>
                  Panel de Empleado
                </Link>
              )}
            </div>

            <div className="auth-section">
              {user ? (
                <div className="user-controls">
                  {/* Calendar button for regular users */}
                  {user.rol !== "admin" && user.rol !== "empleado" && (
                    <Link to="/user/sheduler" className="icon-button" aria-label="Calendario" onClick={closeMenu}>
                      <Calendar size={20} />
                    </Link>
                  )}

                  {/* User dropdown for regular users */}
                  {user.rol === "usuario" && (
                    <div className="user-dropdown" ref={userDropdownRef}>
                      <button
                        className="icon-button"
                        aria-label="Menú de usuario"
                        onClick={toggleUserDropdown}
                        aria-expanded={isUserDropdownOpen}
                      >
                        <User size={20} />
                      </button>
                      <div className={`dropdown-content ${isUserDropdownOpen ? "active" : ""}`}>
                        <Link to="/HistorialMedico" className="dropdown-item" onClick={closeMenu}>
                          Historial Médico
                        </Link>
                        <Link to="/user" className="dropdown-item" onClick={closeMenu}>
                          Perfil
                        </Link>
                        <button
                          className="dropdown-item logout-button"
                          onClick={() => {
                            logout()
                            closeMenu()
                          }}
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="login-button" onClick={closeMenu}>
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="register-button" onClick={closeMenu}>
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

