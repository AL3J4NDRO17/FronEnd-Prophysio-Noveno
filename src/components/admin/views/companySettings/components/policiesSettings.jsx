"use client"
import { useState, useEffect } from "react"
import { FileText, Save } from "lucide-react"
import { toast } from "react-toastify"

const PoliciesSettings = ({ company, policy, updatePolicy, isSubmitting }) => {
  const [formData, setFormData] = useState({
    privacy_policy: "",
    terms_conditions: "",
  })

  useEffect(() => {
    if (policy) {
      setFormData({
        privacy_policy: policy.privacy_policy || "",
        terms_conditions: policy.terms_conditions || "",
      })
    } else {
      setFormData({
        privacy_policy: "",
        terms_conditions: "",
      })
    }
  }, [policy])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSavePolicy = async () => {
    if (!company?.company_id) {
      toast.error("ID de empresa no disponible.")
      return
    }
    try {
      await updatePolicy({
        company_id: company.company_id,
        ...formData,
      })
    } catch (error) {
      console.error("Error al guardar políticas:", error)
      toast.error("Error al guardar las políticas.")
    }
  }

  return (
    <div className="companySettings-card">
      <div className="companySettings-card-header">
        <h2>Políticas de la Empresa</h2>
        <p>Configura las políticas y términos de servicio</p>
      </div>
      <div className="companySettings-card-content">
        <div className="companySettings-policy-item">
          <div className="companySettings-policy-header">
            <div className="companySettings-policy-title">
              <FileText className="companySettings-policy-icon" />
              <h3>Política de Privacidad</h3>
            </div>
          </div>
          <div className="companySettings-form-group">
            <textarea
              id="privacy-policy"
              name="privacy_policy"
              className="companySettings-textarea"
              placeholder="Ingresa la política de privacidad..."
              value={formData.privacy_policy}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows="8"
            ></textarea>
          </div>
        </div>

        <div className="companySettings-policy-item">
          <div className="companySettings-policy-header">
            <div className="companySettings-policy-title">
              <FileText className="companySettings-policy-icon" />
              <h3>Términos y Condiciones</h3>
            </div>
          </div>
          <div className="companySettings-form-group">
            <textarea
              id="terms"
              name="terms_conditions"
              className="companySettings-textarea"
              placeholder="Ingresa los términos y condiciones..."
              value={formData.terms_conditions}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows="8"
            ></textarea>
          </div>
        </div>

        <div className="companySettings-form-actions">
          <button
            type="button"
            className="companySettings-button-primary"
            onClick={handleSavePolicy}
            disabled={isSubmitting}
          >
            <Save className="companySettings-button-icon" />
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PoliciesSettings
