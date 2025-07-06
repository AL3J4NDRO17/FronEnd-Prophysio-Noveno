"use client"

import { useState } from "react"
import { Home, Building, Users, FileText, Globe } from "lucide-react"
import CompanySettingsHeader from "./components/header"
import Tabs from "./components/tabs"
import GeneralSettings from "./components/generalSettings"
import FaqSettings from "./components/faqSettings"
import PoliciesSettings from "./components/policiesSettings"
import IncidentsSettings from "./components/incidentsSettings" // Mantener si se va a usar
import SocialLinksManagement from "./components/socialLinksManager" // Asegurarse de que el nombre del archivo sea correcto

import useCompany from "./hooks/useCompany"
import useFaqs from "./hooks/useFaqs"
import { usePolicy } from "./hooks/usePolicies"
import useSocialLinks from "./hooks/useSocialLink"

import "./styles/locationPicker.css"
import "./styles/incidentsSettings.css"
import "./styles/header.css"
import "./styles/companySettings.css"
import "./styles/generalSettings.css"

// Simulación de AdminLoader si no tienes uno real
// Simulación de AdminLoader si no tienes uno real
const AdminLoader = () => <div className="companySettings-loading">Cargando...</div>

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState("general")
  const { company, loading: companyLoading, error: companyError, updateCompany, isUpdating } = useCompany()
  const { faqs, loading: faqsLoading, error: faqsError, addFaq, updateFaq, deleteFaq } = useFaqs(company?.company_id)
  const { policy, isLoading: policyLoading, error: policyError, createOrUpdatePolicy } = usePolicy(company?.company_id)
  const {
    socialLinks,
    loading: socialLinksLoading,
    addSocialLink,
    updateSocialLink,
    removeSocialLink,
  } = useSocialLinks(company?.company_id)
  console.log(company)
  if (companyLoading) {
    return <AdminLoader />
  }

  if (companyError) {
    return <div className="companySettings-error">Error: {companyError}</div>
  }

  return (
    <div className="companySettings-container">
      <main className="companySettings-main-content">
        <CompanySettingsHeader />
        <Tabs activeTab={activeSection} setActiveTab={setActiveSection} />
        <div className="companySettings-content">
          {activeSection === "general" && (
            <GeneralSettings company={company} updateCompany={updateCompany} isLoading={companyLoading || isUpdating} />
          )}

          {activeSection === "faq" && (
            <FaqSettings
              faqs={faqs || []}
              loading={faqsLoading}
              error={faqsError}
              addFaq={addFaq}
              updateFaq={updateFaq}
              deleteFaq={deleteFaq}
              companyId={company?.company_id}
            />
          )}

          {activeSection === "social-links" && (
            <SocialLinksManagement
              socialLinks={socialLinks}
              loading={socialLinksLoading}
              addSocialLink={addSocialLink}
              updateSocialLink={updateSocialLink}
              removeSocialLink={removeSocialLink}
              companyId={company?.company_id}
            />
          )}

          {activeSection === "policies" && (
            <PoliciesSettings
              company={company}
              policy={policy}
              updatePolicy={createOrUpdatePolicy}
              isSubmitting={policyLoading}
            />
          )}

          {activeSection === "incidents" && <IncidentsSettings />}
        </div>
      </main>
    </div>
  )
}