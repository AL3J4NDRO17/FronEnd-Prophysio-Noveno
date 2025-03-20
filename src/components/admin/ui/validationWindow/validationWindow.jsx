import { Check, X } from "lucide-react"
import "./validationWindow.css"

const ValidationWindow = ({ password, isVisible }) => {
  // Criterios de validación
  const validations = [
    {
      id: "length",
      label: "Al menos 8 caracteres",
      isValid: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "Al menos una letra mayúscula",
      isValid: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "Al menos una letra minúscula",
      isValid: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "Al menos un número",
      isValid: /\d/.test(password),
    },
    {
      id: "special",
      label: "Al menos un carácter especial",
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ]

  // Calcular la fortaleza de la contraseña (0-100)
  const calculateStrength = () => {
    const validCount = validations.filter((v) => v.isValid).length
    return (validCount / validations.length) * 100
  }

  const strength = calculateStrength()

  // Determinar el color y mensaje según la fortaleza
  const getStrengthColor = () => {
    if (strength < 40) return { color: "#ef4444", message: "Débil" }
    if (strength < 80) return { color: "#f59e0b", message: "Media" }
    return { color: "#10b981", message: "Fuerte" }
  }

  const { color, message } = getStrengthColor()

  if (!isVisible) return null

  return (
    <div className="password-validation-window">
      <div className="password-validation-header">
        <div className="password-validation-strength">
          <div className="password-validation-strength-label">Fortaleza:</div>
          <div className="password-validation-strength-value" style={{ color }}>
            {message}
          </div>
        </div>
        <div className="password-validation-meter">
          <div
            className="password-validation-meter-fill"
            style={{ width: `${strength}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>

      <div className="password-validation-criteria">
        {validations.map((validation) => (
          <div key={validation.id} className={`password-validation-item ${validation.isValid ? "valid" : "invalid"}`}>
            {validation.isValid ? (
              <Check size={16} className="password-validation-icon valid" />
            ) : (
              <X size={16} className="password-validation-icon invalid" />
            )}
            <span>{validation.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ValidationWindow

