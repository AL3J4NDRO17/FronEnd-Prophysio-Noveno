"use client"

import { useState } from "react"
import { Camera, Trash2 } from "lucide-react"


const ProfileAvatar = ({ avatarUrl, nombre }) => {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="profile-avatar-section">
      <div
        className="profile-avatar-container"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        {avatarUrl ? (
          <img src={avatarUrl || "/placeholder.svg"} alt="Avatar de usuario" className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">{nombre ? nombre.charAt(0).toUpperCase() : "U"}</div>
        )}

        {showOptions && (
          <div className="profile-avatar-overlay">
            <button className="profile-avatar-option">
              <Camera size={16} />
            </button>
            <button className="profile-avatar-option">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="profile-avatar-info">
        <h3>{nombre || "Usuario"}</h3>
        <p>Avatar generado con tus iniciales</p>
      </div>
    </div>
  )
}

export default ProfileAvatar

