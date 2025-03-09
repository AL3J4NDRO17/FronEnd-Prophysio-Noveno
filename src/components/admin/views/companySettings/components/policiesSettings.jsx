"use client"
import { FileText, Save } from "lucide-react"

const PoliciesSettings = ({ company, updateField, isSubmitting }) => {
  if (!company) return null

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
              className="companySettings-textarea"
              placeholder="Ingresa la política de privacidad..."
              value={company.privacyPolicy || ""}
              onChange={(e) => updateField("privacyPolicy", e.target.value)}
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
              className="companySettings-textarea"
              placeholder="Ingresa los términos y condiciones..."
              value={company.termsAndConditions || ""}
              onChange={(e) => updateField("termsAndConditions", e.target.value)}
              disabled={isSubmitting}
              rows="8"
            ></textarea>
          </div>
        </div>

        <div className="companySettings-form-actions">
          <button type="button" className="companySettings-button-primary" disabled={isSubmitting}>
            <Save className="companySettings-button-icon" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}

export default PoliciesSettings

