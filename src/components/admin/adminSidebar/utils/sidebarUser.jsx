export default function UserProfile({ name, role, initials }) {
    return (
      <div className="adminDashboard-user-profile">
        <div className="adminDashboard-user-avatar">{initials}</div>
        <div className="adminDashboard-user-info">
          <div className="adminDashboard-user-name">{name}</div>
          <div className="adminDashboard-user-role">{role}</div>
        </div>
      </div>
    )
  }
  
  