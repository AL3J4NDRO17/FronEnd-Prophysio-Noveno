"use client"

import { useState, useEffect } from "react"
import { Save, Building, FileText } from "lucide-react"
import { toast } from "react-toastify"
import LogoManager from "./logoManager"
import SocialLinksManager from "./socialLinksManager"

const GeneralSettings = ({ company = {}, updateCompany, isLoading }) => {

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

  // Actualizar el logo en el formulario
  const handleLogoUpdate = (logoUrl) => {
    setFormData((prev) => ({
      ...prev,
      logo_url: logoUrl,
    }))
  }

  // Actualizar los enlaces sociales
  const handleSocialLinksUpdate = (socialLinks) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks,
    }))
  }

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la empresa es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsSubmitting(true)

      // Llamar a la función de actualización proporcionada por el componente padre
      await updateCompany({
        company_id: company?.company_id,
        ...formData,
      })

      toast.success("Cambios guardados correctamente")
    } catch (error) {
      console.error("Error al actualizar la empresa:", error)
      setErrors({ submit: "Error al guardar los cambios. Inténtelo de nuevo." })
    } finally {
      setIsSubmitting(false)
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

        {/* Componente de gestión de logos */}
        <LogoManager companyId={company?.company_id} currentLogo={formData.logo_url} onLogoUpdate={handleLogoUpdate} />

        {/* Componente de gestión de redes sociales */}
        <SocialLinksManager socialLinks={formData.socialLinks} onSocialLinksUpdate={handleSocialLinksUpdate} />

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

