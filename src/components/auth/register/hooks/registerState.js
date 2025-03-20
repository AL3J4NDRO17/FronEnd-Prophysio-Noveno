"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { registerService } from "../services/registerServices" // Servicio para manejar el registro
import { useNavigate } from "react-router-dom"

const SITE_KEY = "6LdDDl0qAAAAAGQd0JluGGMC45SVseGltEUsrs-p" // 🔥 Usa tu clave pública de Google reCAPTCHA

export default function useRegister() {
  const [nombre, setnombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [preguntaSecreta, setPreguntaSecreta] = useState(0) // Valor inicial 0 (ninguna seleccionada)
  const [respuestaSecreta, setRespuestaSecreta] = useState("")
  const [captchaValue, setCaptchaValue] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const navigate = useNavigate()

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = () => {
    const newErrors = {}

    // Validación del nombre
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido."
    }

    // Validación del email
    if (!email.trim()) {
      newErrors.email = "El email es requerido."
    }
    if (!emailRegex.test(email)) {
      newErrors.email = "Formato de email inválido.";
    }

    // Validación de la contraseña
    if (!password) {
      newErrors.password = "La contraseña es requerida."
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres."
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "La contraseña debe incluir al menos una letra mayúscula."
    } else if (!/\d/.test(password)) {
      newErrors.password = "La contraseña debe incluir al menos un número."
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "La contraseña debe incluir al menos un carácter especial."
    }

    // Validación de confirmación de contraseña
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden."
    }

    // Validación de pregunta secreta
    if (preguntaSecreta > 0 && !respuestaSecreta.trim()) {
      newErrors.respuestaSecreta = "La respuesta a la pregunta secreta es requerida."
    }

    // Validación de reCAPTCHA
    if (!captchaValue) {
      newErrors.captcha = "Por favor, verifica que no eres un robot."
    }

    // Mostrar errores con toast
    if (Object.keys(newErrors).length > 0) {
      toast.error(
        <div>
          {Object.values(newErrors).map((errMsg, idx) => (
            <div key={idx}>- {errMsg}</div>
          ))}
        </div>,
      )
    }

    // Actualizar estado de errores
    setErrors(newErrors)

    // Devolver `true` si no hay errores, `false` si hay errores
    return Object.keys(newErrors).length === 0
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return // ❌ No enviar datos si hay errores

    setIsLoading(true)
    try {
      const formData = {
        nombre,
        email,
        password,
        preguntaSecreta: preguntaSecreta > 0 ? preguntaSecreta : null,
        respuestaSecreta: preguntaSecreta > 0 ? respuestaSecreta : null,
      }
      const response = await registerService(formData)

      toast.success("Registro exitoso. Activa tu cuenta.")
      navigate("/requestactivate", { state: { token: response.token } })
    } catch (error) {
      toast.error(error.response?.data?.message || "Ocurrió un error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
    errors,
    handleRegisterSubmit,
  }
}

