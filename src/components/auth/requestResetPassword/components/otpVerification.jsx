"use client"

import { useState, useRef, useEffect } from "react"
import { KeyRound } from 'lucide-react'

const OtpVerification = ({ onSubmit, loading, email, error }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [localError, setLocalError] = useState("")
  const inputRefs = useRef([])

  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setLocalError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)

      // Focus on the last input
      inputRefs.current[5].focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setLocalError("Por favor, ingresa el código completo de 6 dígitos")
      return
    }

    onSubmit(otpValue)
  }

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-icon">
        <KeyRound size={48} />
      </div>
      <h2>Verificación de código</h2>
      <p>
        Hemos enviado un código de verificación a <strong>{email}</strong>
      </p>

      {error && <div className="global-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">Ingresa el código de 6 dígitos:</label>
          <div className="otp-verification-inputs" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                aria-label={`Dígito ${index + 1}`}
              />
            ))}
          </div>
          {localError && <div className="error-message">{localError}</div>}
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Verificando..." : "Verificar código"}
        </button>
      </form>

      <div className="otp-verification-footer">
        <p>
          ¿No recibiste el código? <button className="text-button">Reenviar código</button>
        </p>
      </div>
    </div>
  )
}

export default OtpVerification
