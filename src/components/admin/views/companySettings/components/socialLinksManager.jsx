"use client"

import { useState, useEffect } from "react"
import { Globe, Facebook, Instagram, Twitter, Linkedin, Youtube, Github, LinkIcon, Save, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

const SOCIAL_PLATFORMS_DEFINED = [
  { id: "facebook", name: "Facebook", icon: <Facebook className="company-adjustments-social-icon" /> },
  { id: "instagram", name: "Instagram", icon: <Instagram className="company-adjustments-social-icon" /> },
  { id: "twitter", name: "Twitter", icon: <Twitter className="company-adjustments-social-icon" /> },
  { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="company-adjustments-social-icon" /> },
  { id: "youtube", name: "YouTube", icon: <Youtube className="company-adjustments-social-icon" /> },
  { id: "github", name: "GitHub", icon: <Github className="company-adjustments-social-icon" /> },
  { id: "website", name: "Sitio Web", icon: <Globe className="company-adjustments-social-icon" /> },
  // Puedes añadir más plataformas predefinidas aquí si es necesario
]

const SocialLinksManager = ({
  companyId,
  socialLinks: initialSocialLinks,
  addSocialLink,
  updateSocialLink,
  removeSocialLink,
  loading,
}) => {
  const [platformUrls, setPlatformUrls] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const urls = {}
    initialSocialLinks.forEach((link) => {
      urls[link.platform] = link.url
    })
    setPlatformUrls(urls)
  }, [initialSocialLinks])

  const handleUrlChange = (platformId, url) => {
    setPlatformUrls((prev) => ({
      ...prev,
      [platformId]: url,
    }))
  }

  const handleSavePlatform = async (platformId) => {
    const url = platformUrls[platformId] ? platformUrls[platformId].trim() : ""

    if (!url) {
      // Si la URL está vacía, se considera una eliminación
      handleDeletePlatform(platformId)
      return
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      toast.error("La URL debe comenzar con http:// o https://")
      return
    }

    setIsSaving(true)
    try {
      const existingLink = initialSocialLinks.find((link) => link.platform === platformId)

      if (existingLink) {
        // Actualizar enlace existente
        await updateSocialLink(existingLink.social_id, {
          platform: platformId,
          url: url,
        })
        toast.success(`${getPlatformName(platformId)} actualizado correctamente.`)
      } else {
        // Crear nuevo enlace
        await addSocialLink({
          company_id: companyId,
          platform: platformId,
          url: url,
        })
        toast.success(`${getPlatformName(platformId)} agregado correctamente.`)
      }
    } catch (error) {
      console.error(`Error al guardar ${platformId}:`, error)
      toast.error(`Error al guardar ${getPlatformName(platformId)}.`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePlatform = async (platformId) => {
    const existingLink = initialSocialLinks.find((link) => link.platform === platformId)

    if (!existingLink) {
      // Si no hay un enlace existente, simplemente limpia el campo localmente
      setPlatformUrls((prev) => ({ ...prev, [platformId]: "" }))
      toast.info(`Campo de ${getPlatformName(platformId)} limpiado.`)
      return
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¡Esto eliminará el enlace de ${getPlatformName(platformId)}! No podrás revertirlo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) return

    setIsSaving(true)
    try {
      await removeSocialLink(existingLink.social_id)
      setPlatformUrls((prev) => ({ ...prev, [platformId]: "" })) // Limpiar el campo después de eliminar
      toast.success(`${getPlatformName(platformId)} eliminado correctamente.`)
    } catch (err) {
      toast.error(`Error al eliminar ${getPlatformName(platformId)}.`)
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const getPlatformName = (platformId) => {
    const platform = SOCIAL_PLATFORMS_DEFINED.find((p) => p.id === platformId)
    return platform ? platform.name : platformId
  }

  const getSocialIcon = (platformId) => {
    const socialPlatform = SOCIAL_PLATFORMS_DEFINED.find((p) => p.id === platformId)
    return socialPlatform ? socialPlatform.icon : <LinkIcon className="company-adjustments-social-icon" />
  }

  if (loading) {
    return <div className="companySettings-loading">Cargando enlaces de redes sociales...</div>
  }

  return (
    <div className="company-adjustments-form-section">
      <h3 className="company-adjustments-section-title">
        <Globe className="company-adjustments-section-icon" />
        Redes Sociales
      </h3>

      <div className="company-adjustments-social-grid">
        {SOCIAL_PLATFORMS_DEFINED.map((platform) => (
          <div key={platform.id} className="company-adjustments-social-item">
            <div className="company-adjustments-social-item-header">
              {platform.icon}
              <label htmlFor={`social-url-${platform.id}`} className="company-adjustments-social-platform">
                {platform.name}
              </label>
            </div>
            <input
              id={`social-url-${platform.id}`}
              type="url"
              className="companySettings-input company-adjustments-social-input"
              placeholder={`URL de ${platform.name}`}
              value={platformUrls[platform.id] || ""}
              onChange={(e) => handleUrlChange(platform.id, e.target.value)}
              disabled={isSaving}
            />
            <div className="company-adjustments-social-item-actions">
              <button
                type="button"
                className="companySettings-button-primary companySettings-button-small"
                onClick={() => handleSavePlatform(platform.id)}
                disabled={isSaving || !platformUrls[platform.id]?.trim()}
              >
                <Save className="companySettings-button-icon-small" />
                Guardar
              </button>
              <button
                type="button"
                className="companySettings-button-outline companySettings-button-small companySettings-button-destructive"
                onClick={() => handleDeletePlatform(platform.id)}
                disabled={isSaving || !platformUrls[platform.id]?.trim()}
              >
                <Trash2 className="companySettings-button-icon-small" />
                Limpiar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SocialLinksManager
