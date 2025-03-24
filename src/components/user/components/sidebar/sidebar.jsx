"use client"
import {  useEffect,useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import SidebarHeader from "./components/SidebarHeader"
import SidebarUserInfo from "./components/SidebarUserInfo"
import SidebarNavigation from "./components/SidebarNavigation"
import SidebarFooter from "./components/SidebarFooter"

import "./styles/sidebar.css"
import "./styles/SidebarUserInfo.css"
import "./styles/SidebarNavigation.css"
import "./styles/SidebarHeader.css"
import "./styles/SidebarFooter.css"

const Sidebar = ({ userData, isMobileOpen, toggleMobileSidebar }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [avatar, setAvatarUrl] = useState("")
  const handleNavigation = (path) => {
    navigate(path)
    if (isMobileOpen) {
      toggleMobileSidebar()
    }
  }
  useEffect(() => {
    if (userData.nombre) {
      
      const encodedName = encodeURIComponent(userData.nombre)
      setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}`)
    }
  }, [userData.nombre])
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      <div className={`user-dashboard-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        <SidebarHeader toggleMobileSidebar={toggleMobileSidebar} />

        <SidebarUserInfo avatar={avatar} userData={userData} />

        <SidebarNavigation isActive={isActive} handleNavigation={handleNavigation} />

        <SidebarFooter handleNavigation={handleNavigation} />
      </div>
    </>
  )
}

export default Sidebar

