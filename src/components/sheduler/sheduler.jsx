"use client"

import { useState } from "react"
import "./styles/sheduler.css"

const AppointmentScheduler = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    termsAccepted: false,
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      age: "",
    },
    visitReason: "",
    paymentMethod: "",
  })

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target

    if (name === "termsAccepted") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Términos y Condiciones</h2>
            <div className="terms-container">
              <p>Por favor, lea atentamente nuestros términos y condiciones:</p>
              <div className="terms-text">
                <p>1. Las citas deben cancelarse con al menos 24 horas de anticipación.</p>
                <p>2. El paciente debe llegar 10 minutos antes de su cita.</p>
                <p>3. Los pagos deben realizarse antes del tratamiento.</p>
                {/* Add more terms as needed */}
              </div>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Acepto los términos y condiciones
              </label>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="step-content">
            <h2>Información Personal</h2>
            <div className="form-group">
              <label>Nombre completo:</label>
              <input
                type="text"
                name="personalInfo.name"
                value={formData.personalInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="personalInfo.email"
                value={formData.personalInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="tel"
                name="personalInfo.phone"
                value={formData.personalInfo.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Edad:</label>
              <input
                type="number"
                name="personalInfo.age"
                value={formData.personalInfo.age}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="step-content">
            <h2>Motivo de la Visita</h2>
            <div className="visit-reasons">
              <label className="radio-container">
                <input
                  type="radio"
                  name="visitReason"
                  value="Fisioterapia Pediátrica"
                  checked={formData.visitReason === "Fisioterapia Pediátrica"}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Fisioterapia Pediátrica
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="visitReason"
                  value="Fisioterapia Ortopédica"
                  checked={formData.visitReason === "Fisioterapia Ortopédica"}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Fisioterapia Ortopédica
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="visitReason"
                  value="Fisioterapia Oncológica"
                  checked={formData.visitReason === "Fisioterapia Oncológica"}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Fisioterapia Oncológica
              </label>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="step-content">
            <h2>Método de Pago</h2>
            <div className="payment-methods">
              <label className="radio-container">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === "online"}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Pago en línea
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="presencial"
                  checked={formData.paymentMethod === "presencial"}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Pago presencial
              </label>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="step-content">
            <h2>Confirmar Cita</h2>
            <div className="summary">
              <h3>Resumen de su cita:</h3>
              <p>
                <strong>Nombre:</strong> {formData.personalInfo.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.personalInfo.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {formData.personalInfo.phone}
              </p>
              <p>
                <strong>Servicio:</strong> {formData.visitReason}
              </p>
              <p>
                <strong>Método de pago:</strong>{" "}
                {formData.paymentMethod === "online" ? "Pago en línea" : "Pago presencial"}
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="appointment-scheduler">
      <div className="progress-bar">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className={`progress-step ${currentStep >= step ? "active" : ""}`}>
            {step}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div className="button-group">
          {currentStep > 1 && (
            <button type="button" className="btn btn-secondary" onClick={prevStep}>
              Anterior
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !formData.termsAccepted) ||
                (currentStep === 2 &&
                  (!formData.personalInfo.name || !formData.personalInfo.email || !formData.personalInfo.phone)) ||
                (currentStep === 3 && !formData.visitReason) ||
                (currentStep === 4 && !formData.paymentMethod)
              }
            >
              Siguiente
            </button>
          ) : (
            <button type="submit" className="btn btn-primary">
              Finalizar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AppointmentScheduler

