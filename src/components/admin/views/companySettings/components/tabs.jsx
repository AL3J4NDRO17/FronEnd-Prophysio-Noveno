"use client"

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="companySettings-tabs">
      <div className="companySettings-tabs-list">
        <button
          className={`companySettings-tab-button ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          Información General
        </button>
        <button
          className={`companySettings-tab-button ${activeTab === "social-links" ? "active" : ""}`}
          onClick={() => setActiveTab("social-links")}
        >
          Redes Sociales
        </button>
        <button
          className={`companySettings-tab-button ${activeTab === "faq" ? "active" : ""}`}
          onClick={() => setActiveTab("faq")}
        >
          FAQ
        </button>
        <button
          className={`companySettings-tab-button ${activeTab === "policies" ? "active" : ""}`}
          onClick={() => setActiveTab("policies")}
        >
          Políticas
        </button>
        <button
          className={`companySettings-tab-button ${activeTab === "incidents" ? "active" : ""}`}
          onClick={() => setActiveTab("incidents")}
        >
          Incidentes
        </button>
      </div>
    </div>
  )
}

export default Tabs
