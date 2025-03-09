"use client"

import { useState } from "react"
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import { Save } from "lucide-react"

import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

// Registrar plugins de FilePond
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

const GeneralSettings = ({ company = {}, updateField, isSubmitting, saveChanges }) => {
  const [logoFile, setLogoFile] = useState([])

  const handleLogoUpload = (fileItems) => {
    if (fileItems.length > 0 && fileItems[0].file) {
      // En una implementación real, aquí procesarías el archivo
      // y actualizarías el campo logo con la URL resultante
      console.log("Logo file:", fileItems[0].file)

      // Simular una URL para el logo
      const logoUrl = URL.createObjectURL(fileItems[0].file)
      updateField("logo", logoUrl)
    }
  }

  return (
    <div className="companySettings-card">
      <div className="companySettings-card-header">
        <h2>Información Básica</h2>
        <p>Actualiza la información principal de la empresa</p>
      </div>
      <div className="companySettings-card-content">
        <div className="companySettings-form-grid">
          <div className="companySettings-form-group">
            <label htmlFor="company-name">Nombre de la Empresa</label>
            <input
              type="text"
              id="company-name"
              placeholder="Ingresa el nombre"
              value={company?.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              disabled={false} // Asegurarse de que no esté deshabilitado
            />
          </div>
          <div className="companySettings-form-group">
            <label htmlFor="company-email">Correo Electrónico</label>
            <div className="companySettings-input-with-icon">
              <i className="companySettings-icon-mail">📧</i>
              <input
                type="email"
                id="company-email"
                placeholder="contacto@empresa.com"
                value={company?.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                disabled={false}
              />
            </div>
          </div>
          <div className="companySettings-form-group">
            <label htmlFor="company-phone">Teléfono</label>
            <div className="companySettings-input-with-icon">
              <i className="companySettings-icon-phone">📞</i>
              <input
                type="tel"
                id="company-phone"
                placeholder="+1 234 567 890"
                value={company?.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                disabled={false}
              />
            </div>
          </div>
          <div className="companySettings-form-group">
            <label htmlFor="company-address">Dirección</label>
            <div className="companySettings-input-with-icon">
              <i className="companySettings-icon-building">🏢</i>
              <input
                type="text"
                id="company-address"
                placeholder="Dirección de la empresa"
                value={company?.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
                disabled={false}
              />
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="companySettings-form-group">
          <label>Redes Sociales</label>
          <div className="companySettings-social-links">
            <div className="companySettings-input-with-icon">
              <i className="companySettings-icon-facebook">📘</i>
              <input
                type="url"
                placeholder="https://facebook.com/tuempresa"
                value={company?.socialMedia?.facebook || ""}
                onChange={(e) =>
                  updateField("socialMedia", {
                    ...company?.socialMedia,
                    facebook: e.target.value,
                  })
                }
                disabled={false}
              />
            </div>

            <div className="companySettings-input-with-icon">
              <i className="companySettings-icon-instagram">📸</i>
              <input
                type="url"
                placeholder="https://instagram.com/tuempresa"
                value={company?.socialMedia?.instagram || ""}
                onChange={(e) =>
                  updateField("socialMedia", {
                    ...company?.socialMedia,
                    instagram: e.target.value,
                  })
                }
                disabled={false}
              />
            </div>
          </div>
        </div>

        {/* Logo de la empresa con FilePond */}
        <div className="companySettings-form-group">
          <label>Logo de la Empresa</label>
          <div className="companySettings-logo-upload">
            {company?.logo && (
              <div className="companySettings-logo-preview">
                <img
                  src={company.logo || "/placeholder.svg"}
                  alt="Logo de la empresa"
                  className="companySettings-logo-image"
                />
              </div>
            )}
            <FilePond
              files={logoFile}
              onupdatefiles={setLogoFile}
              onprocessfile={handleLogoUpload}
              allowMultiple={false}
              maxFiles={1}
              name="logo"
              labelIdle='Arrastra y suelta tu logo o <span class="filepond--label-action">Examinar</span>'
              acceptedFileTypes={["image/*"]}
              disabled={false}
              className="companySettings-filepond"
            />
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="companySettings-MV-container">
          <div className="companySettings-form-group">
            <label htmlFor="company-mission">Misión</label>
            <textarea
              id="company-mission"
              placeholder="Describe la misión de la empresa..."
              value={company?.mission || ""}
              onChange={(e) => updateField("mission", e.target.value)}
              disabled={false}
            ></textarea>
          </div>

          <div className="companySettings-form-group">
            <label htmlFor="company-vision">Visión</label>
            <textarea
              id="company-vision"
              placeholder="Describe la visión de la empresa..."
              value={company?.vision || ""}
              onChange={(e) => updateField("vision", e.target.value)}
              disabled={false}
            ></textarea>
          </div>
        </div>
        <div className="companySettings-form-actions">
          <button
            type="button"
            className="companySettings-button-primary"
            onClick={saveChanges}
            disabled={isSubmitting}
          >
            <Save  className="companySettings-button-icon" />
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneralSettings

