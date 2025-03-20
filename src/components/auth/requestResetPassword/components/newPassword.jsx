"use client"

import { useState } from "react"
import { KeyRound, Eye, EyeOff } from 'lucide-react'

const NewPasswordForm = ({ onSubmit, loading, error }) => {
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localErrors, setLocalErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!password) {
      newErrors.password = "Por favor, ingresa una nueva contraseña"
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Por favor, confirma tu contraseña"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setLocalErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(otp, password)
    }
  }

  return (
    <div className="password-form-container">
      <div className="password-form-icon">
        <KeyRound size={48} />
      </div>
      <h2>Crea una nueva contraseña</h2>
      <p>Ingresa el código de verificación y tu nueva contraseña</p>

      {error && <div className="global-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="password">Nueva contraseña</label>
          <div className="input-with-icon">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Ingresa tu nueva contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setLocalErrors({ ...localErrors, password: "" })
              }}
            />
            <button
              type="button"
              className="password-form-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {localErrors.password && <div className="error-message">{localErrors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <div className="input-with-icon">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setLocalErrors({ ...localErrors, confirmPassword: "" })
              }}
            />
            <button
              type="button"
              className="password-form-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {localErrors.confirmPassword && <div className="error-message">{localErrors.confirmPassword}</div>}
        </div>

        <div className="password-form-strength">
          <div className="password-form-requirements">
            <p>La contraseña debe tener:</p>
            <ul>
              <li className={password.length >= 8 ? "met" : ""}>Al menos 8 caracteres</li>
              <li className={/[A-Z]/.test(password) ? "met" : ""}>Al menos una letra mayúscula</li>
              <li className={/[a-z]/.test(password) ? "met" : ""}>Al menos una letra minúscula</li>
              <li className={/[0-9]/.test(password) ? "met" : ""}>Al menos un número</li>
              <li className={/[^A-Za-z0-9]/.test(password) ? "met" : ""}>Al menos un carácter especial</li>
            </ul>
          </div>
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  )
}

export default NewPasswordForm
