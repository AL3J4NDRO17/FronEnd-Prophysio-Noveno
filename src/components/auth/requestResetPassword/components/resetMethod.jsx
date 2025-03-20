"use client"

import { useState } from "react"
import { Lock, Mail, HelpCircle } from 'lucide-react'

const ResetMethodSelection = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState("")
  const [method, setMethod] = useState("")
  const [emailError, setEmailError] = useState("")

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate email
    if (!email) {
      setEmailError("Por favor, ingresa tu correo electrónico")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido")
      return
    }

    // Validate method selection
    if (!method) {
      return
    }

    onSubmit(method, email)
  }

  return (
    <div className="method-selection-container">
      <div className="method-selection-icon">
        <Lock size={48} />
      </div>
      <h2>Recupera tu contraseña</h2>
      <p>Selecciona el método para recuperar tu contraseña</p>

      {error && <div className="global-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <div className="input-with-icon">
            <Mail className="input-icon" />
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError("")
              }}
            />
          </div>
          {emailError && <div className="error-message">{emailError}</div>}
        </div>

        <div className="method-selection-options">
          <div className="method-selection-option-title">Método de recuperación:</div>

          <div className="method-selection-option">
            <input
              type="radio"
              id="email-method"
              name="reset-method"
              value="email"
              checked={method === "email"}
              onChange={() => setMethod("email")}
            />
            <label htmlFor="email-method">
              <Mail className="method-selection-icon-item" />
              <div>
                <strong>Código por correo</strong>
                <p>Recibe un código de verificación en tu correo</p>
              </div>
            </label>
          </div>

          <div className="method-selection-option">
            <input
              type="radio"
              id="question-method"
              name="reset-method"
              value="question"
              checked={method === "question"}
              onChange={() => setMethod("question")}
            />
            <label htmlFor="question-method">
              <HelpCircle className="method-selection-icon-item" />
              <div>
                <strong>Pregunta secreta</strong>
                <p>Responde tu pregunta de seguridad</p>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" className="primary-button" disabled={loading || !method || !email}>
          {loading ? "Procesando..." : "Continuar"}
        </button>
      </form>
    </div>
  )
}

export default ResetMethodSelection
