"use client"

import { useState, useEffect } from "react"
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import {
  Save,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  Eye,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react"

import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

// Registrar plugins de FilePond
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

const GeneralSettings = ({ company = {}, updateCompany, isLoading }) => {
  console.log(company?.company_id)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    mission: "",
    vision: "",
    logo_url: "",
    socialLinks: [],
  })
  const [logoFile, setLogoFile] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [socialLinkInput, setSocialLinkInput] = useState({ platform: "facebook", url: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Cargar datos de la empresa cuando estén disponibles
  useEffect(() => {
    if (company && Object.keys(company).length > 0) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        description: company.description || "",
        mission: company.mission || "",
        vision: company.vision || "",
        logo_url: company.logo_url || "",
        socialLinks: company.socialLinks || [],
      })
    }
  }, [company])

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar la subida del logo
  const handleLogoUpload = (fileItems) => {
    if (fileItems.length > 0 && fileItems[0].file) {
      // En una implementación real, aquí procesarías el archivo
      // y actualizarías el campo logo_url con la URL resultante
      const logoUrl = URL.createObjectURL(fileItems[0].file)
      setFormData((prev) => ({
        ...prev,
        logo_url: logoUrl,
      }))
    }
  }

  // Agregar un enlace social
  const handleAddSocialLink = () => {
    if (!socialLinkInput.url) return

    // Validar URL
    if (!socialLinkInput.url.startsWith("http")) {
      setErrors((prev) => ({
        ...prev,
        socialLink: "La URL debe comenzar con http:// o https://",
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        {
          platform: socialLinkInput.platform,
          url: socialLinkInput.url,
          id: Date.now(), // ID temporal para la UI
        },
      ],
    }))

    // Limpiar el input y errores
    setSocialLinkInput({ platform: "facebook", url: "" })
    setErrors((prev) => ({ ...prev, socialLink: null }))
  }

  // Eliminar un enlace social
  const handleRemoveSocialLink = (id) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((link) => link.id !== id),
    }))
  }

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica

    try {
      setIsSubmitting(true)

      // Llamar a la función de actualización proporcionada por el componente padre
      await updateCompany({
        company_id: company?.company_id,
        ...formData,
      })

      // Mostrar mensaje de éxito (en una implementación real)
      
    } catch (error) {
      console.error("Error al actualizar la empresa:", error)
      setErrors({ submit: "Error al guardar los cambios. Inténtelo de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obtener el icono correspondiente a la plataforma social
  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="company-adjustments-social-icon" />
      case "instagram":
        return <Instagram className="company-adjustments-social-icon" />
      case "twitter":
        return <Twitter className="company-adjustments-social-icon" />
      case "linkedin":
        return <Linkedin className="company-adjustments-social-icon" />
      default:
        return <Globe className="company-adjustments-social-icon" />
    }
  }

  if (isLoading) {
    return <div className="company-adjustments-loading">Cargando información de la empresa...</div>
  }

  return (
    <div className="company-adjustments-container">
      <div className="company-adjustments-header">
        <h2 className="company-adjustments-title">Ajustes de la Empresa</h2>
       
      </div>
        <form className="company-adjustments-form" onSubmit={handleSubmit}>
          <div className="company-adjustments-form-section">
            <h3 className="company-adjustments-section-title">
              <Building className="company-adjustments-section-icon" />
              Información Básica
            </h3>

            <div className="company-adjustments-form-row">
              <div className="company-adjustments-form-group">
                <label htmlFor="company-name">Nombre de la Empresa*</label>
                <input
                  type="text"
                  id="company-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "company-adjustments-input-error" : ""}
                  placeholder="Nombre de la empresa"
                  required
                />
                {errors.name && <div className="company-adjustments-error-message">{errors.name}</div>}
              </div>

              <div className="company-adjustments-form-group">
                <label htmlFor="company-email">Correo Electrónico*</label>
                <input
                  type="email"
                  id="company-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "company-adjustments-input-error" : ""}
                  placeholder="correo@empresa.com"
                  required
                />
                {errors.email && <div className="company-adjustments-error-message">{errors.email}</div>}
              </div>
            </div>

            <div className="company-adjustments-form-row">
              <div className="company-adjustments-form-group">
                <label htmlFor="company-phone">Teléfono</label>
                <input
                  type="tel"
                  id="company-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 890"
                />
              </div>

              <div className="company-adjustments-form-group">
                <label htmlFor="company-address">Dirección</label>
                <input
                  type="text"
                  id="company-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Dirección de la empresa"
                />
              </div>
            </div>


          </div>

          <div className="company-adjustments-form-section">
            <h3 className="company-adjustments-section-title">
              <FileText className="company-adjustments-section-icon" />
              Misión y Visión
            </h3>

            <div className="company-adjustments-form-row">
              <div className="company-adjustments-form-group">
                <label htmlFor="company-mission">Misión</label>
                <textarea
                  id="company-mission"
                  name="mission"
                  value={formData.mission}
                  onChange={handleInputChange}
                  placeholder="Misión de la empresa"
                  rows={4}
                ></textarea>
              </div>

              <div className="company-adjustments-form-group">
                <label htmlFor="company-vision">Visión</label>
                <textarea
                  id="company-vision"
                  name="vision"
                  value={formData.vision}
                  onChange={handleInputChange}
                  placeholder="Visión de la empresa"
                  rows={4}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="company-adjustments-form-section">
            <h3 className="company-adjustments-section-title">
              <Briefcase className="company-adjustments-section-icon" />
              Logo de la Empresa
            </h3>

            <div className="company-adjustments-logo-container">
              {formData.logo_url && (
                <div className="company-adjustments-logo-preview">
                  <img src={formData.logo_url || "/placeholder.svg"} alt="Logo de la empresa" />
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
                className="company-adjustments-filepond"
              />
            </div>
          </div>

          <div className="company-adjustments-form-section">
            <h3 className="company-adjustments-section-title">
              <Globe className="company-adjustments-section-icon" />
              Redes Sociales
            </h3>

            <div className="company-adjustments-social-links">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="company-adjustments-social-link-item">
                  {getSocialIcon(link.platform)}
                  <span className="company-adjustments-social-platform">{link.platform}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-adjustments-social-url"
                  >
                    {link.url}
                  </a>
                  <button
                    type="button"
                    className="company-adjustments-social-remove"
                    onClick={() => handleRemoveSocialLink(link.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}

              <div className="company-adjustments-social-add">
                <select
                  value={socialLinkInput.platform}
                  onChange={(e) => setSocialLinkInput({ ...socialLinkInput, platform: e.target.value })}
                  className="company-adjustments-social-select"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="other">Otro</option>
                </select>

                <input
                  type="url"
                  value={socialLinkInput.url}
                  onChange={(e) => setSocialLinkInput({ ...socialLinkInput, url: e.target.value })}
                  placeholder="https://..."
                  className={errors.socialLink ? "company-adjustments-input-error" : ""}
                />

                <button
                  type="button"
                  className="company-adjustments-button-primary company-adjustments-button-small"
                  onClick={handleAddSocialLink}
                >
                  Agregar
                </button>
              </div>

              {errors.socialLink && <div className="company-adjustments-error-message">{errors.socialLink}</div>}
            </div>
          </div>

          {errors.submit && <div className="company-adjustments-error-alert">{errors.submit}</div>}

          <div className="company-adjustments-form-actions">
            <button type="submit" className="company-adjustments-button-primary" disabled={isSubmitting}>
              <Save className="company-adjustments-button-icon" />
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
    
    </div>
  )
}

export default GeneralSettings

