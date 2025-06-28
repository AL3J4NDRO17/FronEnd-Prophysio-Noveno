"use client";

import { useState, useEffect } from "react";
import { Briefcase, Clock, Check, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { getCompanyLogos, setCurrentLogo, uploadLogo } from "../services/companyService";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// 📌 Registrar plugins de FilePond
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const LogoManager = ({ companyId, currentLogo, onLogoUpdate }) => {
  const [logoFile, setLogoFile] = useState([]);
  const [logoHistory, setLogoHistory] = useState([]);
  const [showLogoHistory, setShowLogoHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 📌 Cargar historial de logos cuando cambia el ID de la empresa
  
  useEffect(() => {
    if (companyId) {
      fetchLogoHistory(companyId);
    }
  }, [companyId]);

  // 📌 Obtener historial de logos
  const fetchLogoHistory = async (companyId) => {
    try {
      const logos = await getCompanyLogos(companyId);
      setLogoHistory(logos.history || []);

    } catch (error) {
      console.error("Error al obtener historial de logos:", error);
    }
  };

  // 📌 Manejar la subida del logo
  const handleLogoUpload = async () => {
    if (logoFile.length === 0) {
      toast.error("Por favor selecciona un archivo antes de subirlo.");
      return;
    }

    try {
      setIsLoading(true);

      // Subir el logo al servidor
      const logoData = await uploadLogo(companyId, logoFile[0].file);

      // Notificar al componente padre sobre el cambio de logo
      onLogoUpdate(logoData.url);

      // Actualizar el historial de logos
      fetchLogoHistory(companyId);

      // Resetear la selección
      setLogoFile([]);

      toast.success("Logo subido correctamente");
    } catch (error) {
      console.error("Error al subir el logo:", error);
      toast.error("Error al subir el logo");
    } finally {
      setIsLoading(false);
    }
  };

  // 📌 Establecer un logo del historial como actual
  const handleSetCurrentLogo = async (logoUrl) => {
    try {
      setIsLoading(true);
      await setCurrentLogo(companyId, logoUrl);

      // Notificar al componente padre sobre el cambio de logo
      onLogoUpdate(logoUrl);

      toast.success("Logo actualizado correctamente");
    } catch (error) {
      console.error("Error al establecer el logo actual:", error);
      toast.error("Error al actualizar el logo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="company-adjustments-form-section">
      <h3 className="company-adjustments-section-title">
        <Briefcase className="company-adjustments-section-icon" />
        Logo de la Empresa
      </h3>

      <div className="company-adjustments-logo-container">
        {/* 📌 Vista previa del logo actual */}
        {currentLogo && (
          <div className="company-adjustments-logo-preview">
            <img src={currentLogo || "/placeholder.svg"} alt="Logo de la empresa" />
          </div>
        )}

        <div className="company-adjustments-logo-actions">
          {/* 📌 Input de FilePond */}
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

          {/* 📌 Botón manual para subir el logo */}
          <button
            type="button"
            className="company-adjustments-button-primary"
            onClick={handleLogoUpload}
            disabled={isLoading || logoFile.length === 0}
          >
            <Upload className="company-adjustments-button-icon" />
            {isLoading ? "Subiendo..." : "Subir Logo"}
          </button>

          <button
            type="button"
            className="company-adjustments-button-outline company-adjustments-button-small"
            onClick={() => setShowLogoHistory(!showLogoHistory)}
          >
            <Clock className="company-adjustments-button-icon" />
            {showLogoHistory ? "Ocultar historial" : "Ver historial de logos"}
          </button>
        </div>

        {/* 📌 Historial de logos */}
        {showLogoHistory && (
          <div className="company-adjustments-logo-history">
            <h4 className="company-adjustments-logo-history-title">Historial de logos</h4>

            {logoHistory.length === 0 ? (
              <p className="company-adjustments-logo-history-empty">No hay logos en el historial</p>
            ) : (
              <div className="company-adjustments-logo-history-grid">
                {logoHistory.map((logoHistory, index) => (
                  <div
                    key={index}
                    className={`company-adjustments-logo-history-item ${logoHistory  === currentLogo ? "active" : ""}`}
                  >
                    <img src={logoHistory || "/placeholder.svg"} alt={`Logo ${index + 1}`} />
                    <div className="company-adjustments-logo-history-overlay">
                      {logoHistory  === currentLogo ? (
                        <span className="company-adjustments-logo-current">
                          <Check size={16} /> Actual
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="company-adjustments-logo-set-current"
                          onClick={() => handleSetCurrentLogo(logoHistory)}
                          disabled={isLoading}
                        >
                          Establecer como actual
                        </button>
                      )}
                    </div>
                      
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoManager;
