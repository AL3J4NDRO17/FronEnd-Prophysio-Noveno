"use client"

import { useState } from "react"
import { HelpCircle } from 'lucide-react'

const SecretQuestionVerification = ({ question, onSubmit, loading, error }) => {
  const [answer, setAnswer] = useState("")
  const [localError, setLocalError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!answer.trim()) {
      setLocalError("Por favor, ingresa tu respuesta")
      return
    }

    onSubmit(answer)
  }

  return (
    <div className="question-verification-container">
      <div className="question-verification-icon">
        <HelpCircle size={48} />
      </div>
      <h2>Pregunta de seguridad</h2>
      <p>Responde tu pregunta secreta para continuar con la recuperación</p>

      {error && <div className="global-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="secret-question">Tu pregunta secreta:</label>
          <div className="question-verification-question">{question}</div>
        </div>

        <div className="form-group">
          <label htmlFor="answer">Tu respuesta:</label>
          <input
            type="text"
            id="answer"
            placeholder="Ingresa tu respuesta"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value)
              setLocalError("")
            }}
          />
          {localError && <div className="error-message">{localError}</div>}
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Verificando..." : "Verificar respuesta"}
        </button>
      </form>

      <div className="question-verification-footer">
        <p>Si no recuerdas la respuesta, contacta a soporte técnico para asistencia.</p>
      </div>
    </div>
  )
}

export default SecretQuestionVerification
