"use client"

import { CheckCircle } from 'lucide-react'

const SuccessScreen = ({ onRestart }) => {
  return (
    <div className="success-screen-container">
      <div className="success-screen-icon">
        <CheckCircle size={64} />
      </div>
      <h2>¡Contraseña actualizada!</h2>
      <p>Tu contraseña ha sido actualizada correctamente.</p>
      <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>

      <div className="success-screen-actions">
        <button className="primary-button" onClick={() => (window.location.href = "/login")}>
          Ir a iniciar sesión
        </button>
        <button className="secondary-button" onClick={() => (window.location.href = "/")}>
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default SuccessScreen
