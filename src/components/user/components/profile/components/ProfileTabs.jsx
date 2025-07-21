"use client"

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="profile-tabs">
      <button
        className={`profile-tab ${activeTab === "personal" ? "active" : ""}`}
        onClick={() => setActiveTab("personal")}
      >
        Información Personal
      </button>
      <button
        className={`profile-tab ${activeTab === "medical" ? "active" : ""}`}
        onClick={() => setActiveTab("medical")}
      >
        Información Médica
      </button>
     
    </div>
  )
}

export default ProfileTabs

