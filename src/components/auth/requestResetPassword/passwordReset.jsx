"use client"

import { useState, useEffect } from "react"
import { usePasswordRecovery } from "./hooks/useRequestResetPass"
import ResetMethodSelection from "./components/resetMethod"
import SecretQuestionVerification from "./components/secretQuestion"
import OtpVerification from "./components/otpVerification"
import NewPasswordForm from "./components/newPassword"
import SuccessScreen from "./components/sucessScreen"
import "./styles/passwordReset.css"
import { verificarPreguntaSecreta } from "./services/requestResetPassService"


const PasswordReset = () => {
  const [currentStep, setCurrentStep] = useState("method-selection")
  const [email, setEmail] = useState("")
  const [secretQuestion, setSecretQuestion] = useState("")
  const [resetMethod, setResetMethod] = useState("")
  const [otp, setOtp] = useState("")
  const { loading, handleSolicitarCodigo, handleVerificarPregunta, handleRestablecerPassword,handleSolicitarPreguntaSecreta,handleVerificarCode } = usePasswordRecovery()

  // Obtener parámetros de la URL si existen (para casos donde se llega desde un enlace de recuperación)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const emailParam = params.get("email")
      const tokenParam = params.get("token")

      if (emailParam && tokenParam) {
        setEmail(emailParam)
        setOtp(tokenParam)
        setCurrentStep("new-password")
      }
    }
  }, [])

  // Handle method selection (secret question or OTP)
  const handleMethodSelection = async (method, userEmail) => {
    setEmail(userEmail)
    setResetMethod(method)

    if (method === "email") {
      // Si el método es email, enviar código y avanzar solo si es exitoso
      const success = await handleSolicitarCodigo(userEmail)
      if (success) {
        setCurrentStep("otp-verification")
      }
    } else {
      const response = await handleSolicitarPreguntaSecreta (userEmail)
      if (response) {
        setCurrentStep("secret-question")
        setSecretQuestion(response?.preguntaSecreta)
      }
     
      
    }
  }

  // Handle secret question verification
  const handleQuestionVerification = async (answer) => {
    // Verificar la respuesta y avanzar solo si es exitoso
    const success = await handleVerificarPregunta(email, answer)
    if (success) {
      setCurrentStep("otp-verification")
    }
  }

  // Handle OTP verification
  const handleOtpVerification = async (otpCode) => {
    // Guardar el OTP y avanzar al siguiente paso
    const success = await handleVerificarCode(email,otpCode)
    if (success) {
        setOtp(otpCode)
        setCurrentStep("new-password")
       
    }
  
   
  }

  // Handle password reset
  const handlePasswordReset = async (otpCode, newPassword) => {
    // Usar el OTP del estado si no se proporciona en el formulario
    const codeToUse = otpCode || otp

    // Restablecer la contraseña y avanzar solo si es exitoso
    const success = await handleRestablecerPassword(email, codeToUse, newPassword)
    if (success) {
      setCurrentStep("success")
    }
  }

  // Handle restart of the flow
  const handleRestart = () => {
    setCurrentStep("method-selection")
    setEmail("")
    setSecretQuestion("")
    setResetMethod("")
    setOtp("")
  }

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case "method-selection":
        return <ResetMethodSelection onSubmit={handleMethodSelection} loading={loading} />
      case "secret-question":
        return (
          <SecretQuestionVerification
            question={secretQuestion}
            onSubmit={handleQuestionVerification}
            loading={loading}
          />
        )
      case "otp-verification":
        return <OtpVerification onSubmit={handleOtpVerification} loading={loading} email={email} />
      case "new-password":
        return <NewPasswordForm onSubmit={handlePasswordReset} loading={loading} />
      case "success":
        return <SuccessScreen onRestart={handleRestart} />
      default:
        return <ResetMethodSelection onSubmit={handleMethodSelection} loading={loading} />
    }
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <div className="password-reset-header">
          <h1 className="password-reset-title">Recuperación de Contraseña</h1>
          <div className="password-reset-steps">
            <div className={`password-reset-step ${currentStep === "method-selection" ? "active" : ""}`}>1</div>
            <div
              className={`password-reset-step ${["secret-question", "otp-verification"].includes(currentStep) ? "active" : ""}`}
            >
              2
            </div>
            <div className={`password-reset-step ${currentStep === "new-password" ? "active" : ""}`}>3</div>
            <div className={`password-reset-step ${currentStep === "success" ? "active" : ""}`}>4</div>
          </div>
        </div>
        <div className="password-reset-content">{renderStep()}</div>
      </div>
    </div>
  )
}

export default PasswordReset

