"use client"

import { useState, useEffect } from "react"
import useCompany from "./hooks/useCompany"
import useFaqs from "./hooks/useFaqs"
import { usePolicy } from "./hooks/usePolicies"
import Tabs from "./components/tabs"

import CompanySettingsHeader from "./components/header"
import useSocialLinks from "./hooks/useSocialLink"
import GeneralSettings from "./components/generalSettings"
import FaqSettings from "./components/faqSettings"
import PoliciesSettings from "./components/policiesSettings"
import IncidentsSettings from "./components/incidentsSettings"
import "./styles/companySettings.css"
import "./styles/generalSettings.css"
import { updateDataCompany } from "./services/companyService"

export default function CompanySettings() {
  const [activeTab, setActiveTab] = useState("general")
  const { company, loading: companyLoading, error: companyError, updateCompany, isUpdating } = useCompany()
  const { faqs, loading: faqsLoading, error: faqsError, addFaq, updateFaq, deleteFaq } = useFaqs(company?.id)
  const { policy, isLoading: policyLoading, error: policyError, createOrUpdatePolicy } = usePolicy(company?.id)
  const { socialLinks, loading: socialLinksLoading } = useSocialLinks(company?.id)

  if (companyLoading) {
    return <div className="companySettings-loading">Cargando información de la empresa...</div>
  }

  if (companyError) {
    return <div className="companySettings-error">Error: {companyError}</div>
  }

  return (
    <>
      <CompanySettingsHeader />
      <div className="companySettings-container">


        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="companySettings-content">
          {activeTab === "general" && (
            <GeneralSettings
              company={company}
              updateCompany={updateCompany}
              isLoading={companyLoading || isUpdating}

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
            <PoliciesSettings company={company} updateCompany={updateCompany} isSubmitting={isUpdating} />
          )}

          {activeTab === "incidents" && <IncidentsSettings />}
        </div>
      </div>
    </>
  )
}

