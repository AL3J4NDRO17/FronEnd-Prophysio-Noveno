"use client"

import { useState, useEffect } from "react"
import { Save, Building, FileText } from "lucide-react"
import { toast } from "react-toastify"
import LogoManager from "./logoManager"
import LocationPickerMap from "./locationPickerMap" // Importa el nuevo componente del mapa

const GeneralSettings = ({ company = {}, updateCompany, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    latitude: null,
    longitude: null,
    description: "",
    mission: "",
    vision: "",
    logo_url: null, // Ahora es un objeto o null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (company && Object.keys(company).length > 0) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        latitude: company.latitude || null,
        longitude: company.longitude || null,
        description: company.description || "",
        mission: company.mission || "",
        vision: company.vision || "",
        logo_url: company.logo_url || null, // Asegúrate de que sea un objeto o null
      })
    }
  }, [company])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }))
  }

  const handleLogoUpdate = (logoData) => {
    // logoData ahora es un objeto { url, public_id }
    setFormData((prev) => ({
      ...prev,
      logo_url: logoData,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

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

      await updateCompany({
        company_id: company?.company_id,
        ...formData,
      })

    
    } catch (error) {
      console.error("Error al actualizar la empresa:", error)
      setErrors({ submit: "Error al guardar los cambios. Inténtelo de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="companySettings-loading">Cargando información de la empresa...</div>
  }

  return (
    <div className="company-adjustments-container">
  
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
                className={errors.name ? "companySettings-input companySettings-input-error" : "companySettings-input"}
                placeholder="Nombre de la empresa"
                required
              />
              {errors.name && <div className="companySettings-error-message">{errors.name}</div>}
            </div>

            <div className="company-adjustments-form-group">
              <label htmlFor="company-email">Correo Electrónico*</label>
              <input
                type="email"
                id="company-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "companySettings-input companySettings-input-error" : "companySettings-input"}
                placeholder="correo@empresa.com"
                required
              />
              {errors.email && <div className="companySettings-error-message">{errors.email}</div>}
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
                className="companySettings-input"
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
                className="companySettings-input"
              />
            </div>
          </div>

          <div className="company-adjustments-form-group companySettings-map-section">
            <label>Ubicación Geográfica</label>
            <LocationPickerMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationSelect={handleLocationSelect}
            />
            {/* Mantener inputs ocultos o deshabilitados si quieres que los valores persistan en el DOM para la forma */}
            <input type="hidden" name="latitude" value={formData.latitude || ""} />
            <input type="hidden" name="longitude" value={formData.longitude || ""} />
          </div>
        </div>

        <div className="company-adjustments-form-section">
          <h3 className="company-adjustments-section-title">
            <FileText className="company-adjustments-section-icon" />
            Misión y Visión
          </h3>

          <div className="company-adjustments-form-row">
            <div className="company-adjustments-form-group">
              <label htmlFor="company-description">Descripción</label>
              <textarea
                id="company-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción de la empresa"
                rows="3"
                className="companySettings-textarea"
              ></textarea>
            </div>
          </div>
          <div className="company-adjustments-form-row">
            <div className="company-adjustments-form-group">
              <label htmlFor="company-mission">Misión</label>
              <textarea
                id="company-mission"
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                placeholder="Misión de la empresa"
                rows="4"
                className="companySettings-textarea"
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
                rows="4"
                className="companySettings-textarea"
              ></textarea>
            </div>
          </div>
        </div>

        <LogoManager companyId={company?.company_id} currentLogo={formData.logo_url} onLogoUpdate={handleLogoUpdate} />

        {errors.submit && <div className="companySettings-error-message">{errors.submit}</div>}

        <div className="company-adjustments-form-actions">
          <button type="submit" className="companySettings-button-primary" disabled={isSubmitting}>
            <Save className="companySettings-button-icon" />
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GeneralSettings
