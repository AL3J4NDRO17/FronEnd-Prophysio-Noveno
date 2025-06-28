"use client"

import { useState, useEffect } from "react"
import useRegister from "../hooks/registerState"
import "../styles/registerForm.css"
import IMG from "../assets/usuario.png"
import { FaEye, FaEyeSlash } from "react-icons/fa6" // 🔥 Iconos para mostrar/ocultar contraseña
import ReCAPTCHA from "react-google-recaptcha" // 🔥 reCAPTCHA para seguridad
import { PasswordToggleButton } from "@uiButtons";
import {getAllPreguntasSecretasService} from "../services/registerServices"
import ValidationWindow from "@/components/admin/ui/validationWindow/validationWindow";
const SITE_KEY = "6LdFN18qAAAAAB5WT437-hRS9w4jTFRoGKjIdIBe" // 🔥 Reemplaza con tu clave pública de Google reCAPTCHA

// Lista de preguntas secretas

const RegisterForm = () => {
  const {
    nombre,
    setnombre,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    preguntaSecreta,
    setPreguntaSecreta,
    respuestaSecreta,
    setRespuestaSecreta,
    captchaValue,
    setCaptchaValue,
    isLoading,
    errors, // 🔥 Capturar errores de validación
    handleRegisterSubmit,
    getAllPreguntasSecretas,
  } = useRegister()

  const [preguntasSecretas, setPreguntasSecretas] = useState([]); // Estado para almacenar las preguntas secretas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const togglePassword = () => setShowPassword(!showPassword)
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  useEffect(() => {
    const fetchPreguntasSecretas = async () => {
      try {
        const preguntas = await getAllPreguntasSecretasService(); // ✅ Llama correctamente a la API
       
        setPreguntasSecretas(preguntas) // ✅ Actualiza el estado correctamente
      } catch (error) {
        console.error("Error al obtener las preguntas secretas:", error)
      }
    }

    fetchPreguntasSecretas() // ✅ Llama la función correctamente
  }, [getAllPreguntasSecretas]) // ✅ Dependencia correcta

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-icon-section">
          <img src={IMG || "/placeholder.svg"} alt="ProPhysio registro" className="signup-icon-img" />
          <h1 className="signup-brand-title">Crear cuenta en ProPhysio</h1>
          <p className="signup-brand-subtitle">Tu cuerpo es tu compañero de vida</p>
        </div>

        <div className="signup-card-header">
          <h2 className="signup-card-title">Registro</h2>
          <p className="signup-card-description">Completa tus datos para crear una cuenta</p>
        </div>

        <form onSubmit={handleRegisterSubmit}>
          <div className="signup-form-group">
            <label htmlFor="username" className="signup-form-label">
              Nombre completo
            </label>
            <input
              id="username"
              type="text"
              className="signup-form-input"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setnombre(e.target.value)}
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="email" className="signup-form-label">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="signup-form-input"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => {
               
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="password" className="signup-form-label">
              Contraseña
            </label>
            <div className="password-input-container">
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="signup-form-input"
                  value={password}
                  placeholder="Mínimo 8 caracteres, una mayúscula y un número"
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setTimeout(() => setIsPasswordFocused(false), 200)}
                />
                <PasswordToggleButton showPassword={showPassword} togglePassword={togglePassword} />
              </div>
              <ValidationWindow password={password} isVisible={isPasswordFocused} />
            </div>
          </div>

          <div className="signup-form-group">
            <label htmlFor="confirmPassword" className="signup-form-label">
              Confirmar contraseña
            </label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                className="signup-form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <PasswordToggleButton showPassword={showConfirmPassword} togglePassword={toggleConfirmPassword} />
            </div>
          </div>

          <div className="signup-form-group">
            <label htmlFor="preguntaSecreta" className="signup-form-label">
              Pregunta secreta
            </label>
            <select
              id="preguntaSecreta"
              className="signup-form-input"
              value={preguntaSecreta}
              onChange={(e) => setPreguntaSecreta(e.target.value)}
            >
              <option value="">Selecciona una pregunta secreta</option>
              {preguntasSecretas.map((pregunta) => (
                <option key={pregunta.id_pregunta} value={pregunta.id_pregunta}>
                  {pregunta.pregunta}
                </option>
              ))}
            </select>
          </div>

          {/* Respuesta secreta (solo se muestra si se seleccionó una pregunta) */}
          {preguntaSecreta > 0 && (
            <div className="signup-form-group secret-answer-container">
              <label htmlFor="respuestaSecreta" className="signup-form-label">
                Respuesta secreta
              </label>
              <input
                id="respuestaSecreta"
                type="text"
                className="signup-form-input"
                placeholder="Tu respuesta"
                value={respuestaSecreta}
                onChange={(e) => setRespuestaSecreta(e.target.value)}
              />
            </div>
          )}

          {/* Captcha */}
          <div className="captcha-form-group">
            <ReCAPTCHA
              sitekey="6LdFN18qAAAAAB5WT437-hRS9w4jTFRoGKjIdIBe"
              onChange={(value) => setCaptchaValue(value)}
            />
            {errors.captcha && <p className="error-text">{errors.captcha}</p>}
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Crear cuenta"}
          </button>

          <div className="signup-link">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm

