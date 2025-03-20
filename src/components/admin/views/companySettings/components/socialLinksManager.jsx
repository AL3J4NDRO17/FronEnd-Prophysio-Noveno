"use client"

import { useState, useEffect } from "react"
import {
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  GitlabIcon as GitHub,
  LinkIcon,
  Trash2,
} from "lucide-react"

// Plataformas de redes sociales disponibles
const SOCIAL_PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: <Facebook className="company-adjustments-social-icon" /> },
  { id: "instagram", name: "Instagram", icon: <Instagram className="company-adjustments-social-icon" /> },
  { id: "twitter", name: "Twitter", icon: <Twitter className="company-adjustments-social-icon" /> },
  { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="company-adjustments-social-icon" /> },
  { id: "youtube", name: "YouTube", icon: <Youtube className="company-adjustments-social-icon" /> },
  { id: "github", name: "GitHub", icon: <GitHub className="company-adjustments-social-icon" /> },
  { id: "other", name: "Otro", icon: <LinkIcon className="company-adjustments-social-icon" /> },
]

const SocialLinksManager = ({ socialLinks = [], onSocialLinksUpdate }) => {
  const [socialLinkInput, setSocialLinkInput] = useState({ platform: "", url: "" })
  const [availablePlatforms, setAvailablePlatforms] = useState([])
  const [errors, setErrors] = useState({})

  // Actualizar plataformas disponibles cuando cambian los enlaces sociales
  useEffect(() => {
    updateAvailablePlatforms()
  }, [socialLinks])

  // Actualizar plataformas disponibles
  const updateAvailablePlatforms = () => {
    const usedPlatforms = socialLinks.map((link) => link.platform)
    const available = SOCIAL_PLATFORMS.filter((platform) => !usedPlatforms.includes(platform.id))
    setAvailablePlatforms(available)

    // Si no hay plataforma seleccionada o la seleccionada ya está en uso, seleccionar la primera disponible
    if (!socialLinkInput.platform || usedPlatforms.includes(socialLinkInput.platform)) {
      setSocialLinkInput((prev) => ({
        ...prev,
        platform: available.length > 0 ? available[0].id : "",
      }))
    }
  }

  // Agregar un enlace social
  const handleAddSocialLink = () => {
    if (!socialLinkInput.platform || !socialLinkInput.url) {
      setErrors((prev) => ({
        ...prev,
        socialLink: "Selecciona una plataforma e ingresa una URL",
      }))
      return
    }

    // Validar URL
    if (!socialLinkInput.url.startsWith("http")) {
      setErrors((prev) => ({
        ...prev,
        socialLink: "La URL debe comenzar con http:// o https://",
      }))
      return
    }

    // Verificar si ya existe un enlace para esta plataforma
    const platformExists = socialLinks.some((link) => link.platform === socialLinkInput.platform)

    if (platformExists) {
      setErrors((prev) => ({
        ...prev,
        socialLink: "Ya existe un enlace para esta plataforma",
      }))
      return
    }

    // Obtener el nombre de la plataforma
    const platform = SOCIAL_PLATFORMS.find((p) => p.id === socialLinkInput.platform)
    const platformName = platform ? platform.name : socialLinkInput.platform

    // Crear nuevo array de enlaces sociales
    const updatedSocialLinks = [
      ...socialLinks,
      {
        platform: socialLinkInput.platform,
        platformName,
        url: socialLinkInput.url,
        id: Date.now(), // ID temporal para la UI
      },
    ]

    // Notificar al componente padre
    onSocialLinksUpdate(updatedSocialLinks)

    // Limpiar el input y errores
    setSocialLinkInput({ platform: availablePlatforms.length > 1 ? availablePlatforms[0].id : "", url: "" })
    setErrors((prev) => ({ ...prev, socialLink: null }))
  }

  // Eliminar un enlace social
  const handleRemoveSocialLink = (id) => {
    const updatedSocialLinks = socialLinks.filter((link) => link.id !== id)
    onSocialLinksUpdate(updatedSocialLinks)
  }

  // Obtener el icono correspondiente a la plataforma social
  const getSocialIcon = (platform) => {
    const socialPlatform = SOCIAL_PLATFORMS.find((p) => p.id === platform)
    return socialPlatform ? socialPlatform.icon : <Globe className="company-adjustments-social-icon" />
  }

  return (
    <div className="company-adjustments-form-section">
      <h3 className="company-adjustments-section-title">
        <Globe className="company-adjustments-section-icon" />
        Redes Sociales
      </h3>

      <div className="company-adjustments-social-links">
        {socialLinks.length === 0 ? (
          <p className="company-adjustments-social-empty">No hay redes sociales configuradas</p>
        ) : (
          socialLinks.map((link, index) => (
            <div key={index} className="company-adjustments-social-link-item">
              {getSocialIcon(link.platform)}
              <span className="company-adjustments-social-platform">{link.platformName || link.platform}</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="company-adjustments-social-url">
                {link.url}
              </a>
              <button
                type="button"
                className="company-adjustments-social-remove"
                onClick={() => handleRemoveSocialLink(link.id)}
                aria-label="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}

        <div className="company-adjustments-social-add">
          {availablePlatforms.length > 0 ? (
            <>
              <select
                value={socialLinkInput.platform}
                onChange={(e) => setSocialLinkInput({ ...socialLinkInput, platform: e.target.value })}
                className="company-adjustments-social-select"
              >
                {availablePlatforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
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
            </>
          ) : (
            <p className="company-adjustments-social-all-added">Todas las plataformas han sido agregadas</p>
          )}
        </div>

        {errors.socialLink && <div className="company-adjustments-error-message">{errors.socialLink}</div>}
      </div>
    </div>
  )
}

export default SocialLinksManager

