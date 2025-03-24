
const SidebarUserInfo = ({avatar, userData }) => {
  console.log(avatar)
  return (
    <div className="sidebar-user-info">
      <div className="sidebar-avatar">
        {avatar  ? (
          <img src={avatar|| "/placeholder.svg"} alt={userData.nombre} />
        ) : (
          <div className="sidebar-avatar-placeholder">
            {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>
      <div className="sidebar-user-details">
        <h3>{userData.nombre || "Usuario"}</h3>
        <p>{userData.email || "usuario@ejemplo.com"}</p>
      </div>
    </div>
  )
}

export default SidebarUserInfo

