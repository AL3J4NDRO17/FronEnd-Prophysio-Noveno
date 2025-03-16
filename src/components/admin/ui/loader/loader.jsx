"use client"

import { useState, useEffect } from "react"
import "./loader.css"

const AdminLoader = ({
  size = "medium",
  text = "Cargando...",
  fullScreen = false,
  showText = true,
  variant = "primary",
}) => {
  const [dots, setDots] = useState(".")

  // Efecto para la animación de los puntos suspensivos
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."))
    }, 400)

    return () => clearInterval(interval)
  }, [])

  // Determinar las clases según las props
  const loaderClasses = [
    "adminDashboard-loader",
    `adminDashboard-loader-${size}`,
    `adminDashboard-loader-${variant}`,
    fullScreen ? "adminDashboard-loader-fullscreen" : "",
  ]
    .filter(Boolean)
    .join(" ")

  // Renderizar el loader en pantalla completa o como componente normal
  if (fullScreen) {
    return (
      <div className="adminDashboard-loader-overlay">
        <div className="adminDashboard-loader-container">
          <div className={loaderClasses}>
            <div className="adminDashboard-loader-spinner">
              <div className="adminDashboard-loader-circle"></div>
              <div className="adminDashboard-loader-circle"></div>
              <div className="adminDashboard-loader-circle"></div>
            </div>
            {showText && (
              <div className="adminDashboard-loader-text">
                {text}
                {dots}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="adminDashboard-loader-container">
      <div className={loaderClasses}>
        <div className="adminDashboard-loader-spinner">
          <div className="adminDashboard-loader-circle"></div>
          <div className="adminDashboard-loader-circle"></div>
          <div className="adminDashboard-loader-circle"></div>
        </div>
        {showText && (
          <div className="adminDashboard-loader-text">
            {text}
            {dots}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLoader

