export default function TabContent({ title, description, placeholder }) {
    return (
      <div className="adminDashboard-tab-content">
        <div className="adminDashboard-card adminDashboard-full-card">
          <div className="adminDashboard-card-header-full">
            <h3 className="adminDashboard-card-title-large">{title}</h3>
            <p className="adminDashboard-card-description">{description}</p>
          </div>
          <div className="adminDashboard-card-content-full">
            <p className="adminDashboard-placeholder-text">{placeholder}</p>
          </div>
        </div>
      </div>
    )
  }
  
  