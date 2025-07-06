"use client"

import { useState, useEffect } from "react"
import { Briefcase, Clock, Check, Upload, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { getCompanyLogos, setCurrentLogo, uploadLogo, deleteCompanyLogo } from "../services/companyService"
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

const LogoManager = ({ companyId, currentLogo, onLogoUpdate }) => {
  const [logoFile, setLogoFile] = useState([])
  const [logoHistory, setLogoHistory] = useState([])
  const [showLogoHistory, setShowLogoHistory] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (companyId) {
      fetchLogoHistory(companyId)
    }
  }, [companyId, currentLogo])

  const fetchLogoHistory = async (companyId) => {
    try {
      const logos = await getCompanyLogos(companyId)
      setLogoHistory(logos.history || [])
    } catch (error) {
      console.error("Error al obtener historial de logos:", error)
    }
  }

  const handleLogoUpload = async () => {
    if (logoFile.length === 0) {
      toast.error("Por favor selecciona un archivo antes de subirlo.")
      return
    }

    try {
      setIsLoading(true)

      const logoData = await uploadLogo(companyId, logoFile[0].file)

      onLogoUpdate(logoData.logo_url)

      fetchLogoHistory(companyId)

      setLogoFile([])
      toast.success("Logo subido correctamente")
    } catch (error) {
      console.error("Error al subir el logo:", error)
      toast.error("Error al subir el logo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetCurrentLogo = async (logo) => {
    try {
      setIsLoading(true)
      await setCurrentLogo(companyId, logo)

      onLogoUpdate(logo)

      toast.success("Logo actualizado correctamente")
    } catch (error) {
      console.error("Error al establecer el logo actual:", error)
      toast.error("Error al actualizar el logo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLogo = async (publicId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esto eliminará el logo del historial y de Cloudinary! No podrás revertirlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      setIsLoading(true)
      const result = await deleteCompanyLogo(companyId, publicId)

      if (currentLogo && currentLogo.public_id === publicId) {
        onLogoUpdate(result.current_logo || null)
      }

      setLogoHistory(result.logos_history || [])
      toast.success("Logo eliminado correctamente")
    } catch (error) {
      console.error("Error al eliminar el logo:", error)
      toast.error("Error al eliminar el logo")
    } finally {
      setIsLoading(false)
    }
  }
  console.log("LogoManager currentLogo:", currentLogo)
  return (
    <div className="company-adjustments-form-section">
      <h3 className="company-adjustments-section-title">
        <Briefcase className="company-adjustments-section-icon" />
        Logo de la Empresa
      </h3>

      <div className="company-adjustments-logo-container">
        {currentLogo ? (
          <div className="company-adjustments-logo-preview">
            <img src={currentLogo || "/placeholder.svg"} alt="Logo de la empresa" />
          </div>
        ) : (
          <div className="company-adjustments-logo-preview company-adjustments-logo-placeholder">Sin Logo</div>
        )}

        <div className="company-adjustments-logo-actions">
          <FilePond
            files={logoFile}
            onupdatefiles={setLogoFile}
            allowMultiple={false}
            maxFiles={1}
            name="logo"
            labelIdle='Arrastra y suelta tu logo o <span class="filepond--label-action">Examinar</span>'
            acceptedFileTypes={["image/*"]}
            className="company-adjustments-filepond"
            disabled={isLoading}
          />

          <button
            type="button"
            className="company-adjustments-button-primary companySettings-button-full"
            onClick={handleLogoUpload}
            disabled={isLoading || logoFile.length === 0}
          >
            <Upload className="company-adjustments-button-icon" />
            {isLoading ? "Subiendo..." : "Subir Logo"}
          </button>

          <button
            type="button"
            className="company-adjustments-button-outline companySettings-button-full"
            onClick={() => setShowLogoHistory(!showLogoHistory)}
          >
            <Clock className="company-adjustments-button-icon" />
            {showLogoHistory ? "Ocultar historial" : "Ver historial de logos"}
          </button>
        </div>

        {showLogoHistory && (
          <div className="company-adjustments-logo-history">
            <h4 className="company-adjustments-logo-history-title">Historial de logos</h4>

            {logoHistory.length === 0 ? (
              <p className="company-adjustments-logo-history-empty">No hay logos en el historial</p>
            ) : (
              <div className="company-adjustments-logo-history-grid">
                {logoHistory.map((logo, index) => (
                  <div key={logo.public_id || index} className="company-adjustments-logo-history-item group">
                    <img src={logo || "/placeholder.svg"} alt={`Logo ${index + 1}`} />
                    <div className="company-adjustments-logo-history-overlay">
                      {currentLogo && logo === currentLogo ? (
                        <span className="company-adjustments-logo-current">
                          <Check size={16} /> Actual
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="company-adjustments-logo-set-current"
                          onClick={() => handleSetCurrentLogo(logo)}
                          disabled={isLoading}
                        >
                          Establecer como actual
                        </button>
                      )}
                    </div>
                    {logo.public_id && (
                      <button
                        type="button"
                        className="company-adjustments-delete-logo-button"
                        onClick={() => handleDeleteLogo(logo.public_id)}
                        disabled={isLoading || (currentLogo && currentLogo.public_id === logo.public_id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LogoManager
