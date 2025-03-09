"use client"

import { useState, useEffect } from "react"
import useCompany from "./hooks/useCompany"
import useFaqs from "./hooks/useFaqs"
import { usePolicy } from "./hooks/usePolicies"
import Tabs from "./components/tabs"
import GeneralSettings from "./components/generalSettings"
import FaqSettings from "./components/faqSettings"
import PoliciesSettings from "./components/policiesSettings"
import "./styles/companySettings.css"
export default function CompanySettings() {
  const [activeTab, setActiveTab] = useState("general")
  const { company, loading: companyLoading, error: companyError, updateCompany } = useCompany()
  const { faqs, loading: faqsLoading, error: faqsError, addFaq, updateFaq, deleteFaq } = useFaqs(company?.id)
  const { policy, isLoading: policyLoading, error: policyError, createOrUpdatePolicy } = usePolicy(company?.id)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyData, setCompanyData] = useState(null)

  useEffect(() => {
    if (company) {
      setCompanyData(company)
    }
  }, [company])

  const updateField = (field, value) => {
    // Actualizar el estado local
    setCompanyData((prev) => {
      if (!prev) return { [field]: value }

      // Si el campo es un objeto anidado (como socialMedia)
      if (typeof value === "object" && !Array.isArray(value)) {
        return {
          ...prev,
          [field]: {
            ...(prev[field] || {}),
            ...value,
          },
        }
      }

      // Para campos simples
      return {
        ...prev,
        [field]: value,
      }
    })

    // También registrar en consola para depuración
    console.log(`Actualizando campo ${field} con valor:`, value)
  }

  const saveCompanyChanges = async () => {
    try {
      setIsSubmitting(true)
      // Usar el hook updateCompany para guardar los cambios
      await updateCompany(companyData)
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (companyLoading) {
    return <div className="companySettings-loading">Cargando información de la empresa...</div>
  }

  if (companyError) {
    return <div className="companySettings-error">Error: {companyError}</div>
  }

  return (
    <div className="companySettings-container">
      <div className="companySettings-header">
        <h1 className="companySettings-title">Configuración de la Empresa</h1>
        <p className="companySettings-subtitle">
          Administre la información general, preguntas frecuentes y políticas de la empresa
        </p>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="companySettings-content">
        {activeTab === "general" && (
          <GeneralSettings
            company={companyData || company}
            updateField={updateField}
            isSubmitting={isSubmitting}
            saveChanges={saveCompanyChanges}
          />
        )}

        {activeTab === "faq" && (
          <FaqSettings
            faqs={faqs || []}
            loading={faqsLoading}
            error={faqsError}
            addFaq={addFaq}
            updateFaq={updateFaq}
            deleteFaq={deleteFaq}
            companyId={company?.id}
          />
        )}

        {activeTab === "policies" && (
          <PoliciesSettings
            company={companyData || company}
            updateField={updateField}
            isSubmitting={isSubmitting}
            saveChanges={saveCompanyChanges}
          />
        )}
      </div>
    </div>
  )
}


