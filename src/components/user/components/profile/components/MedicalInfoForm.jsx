"use client"

import { AlertCircle } from "lucide-react"

const MedicalInfoForm = ({ formData, handleInputChange }) => {
  return (
    <div className="medical-info-form">
      <div className="form-field">
        <label htmlFor="alergias">Alergias</label>
        <textarea
          id="alergias"
          name="alergias"
          value={formData.alergias}
          onChange={handleInputChange}
          placeholder="Describe tus alergias (si aplica)"
          rows={3}
        ></textarea>
      </div>

      <div className="form-field">
        <label htmlFor="medicamentos_alergia">Alergias a Medicamentos</label>
        <textarea
          id="medicamentos_alergia"
          name="medicamentos_alergia"
          value={formData.medicamentos_alergia}
          onChange={handleInputChange}
          placeholder="Describe tus alergias a medicamentos (si aplica)"
          rows={3}
        ></textarea>
      </div>

      <div className="info-box">
        <AlertCircle size={20} />
        <p>
          La información médica que proporciones será utilizada únicamente por el personal médico autorizado para
          brindarte una mejor atención. Esta información es confidencial y está protegida por nuestras políticas de
          privacidad.
        </p>
      </div>
    </div>
  )
}

export default MedicalInfoForm

