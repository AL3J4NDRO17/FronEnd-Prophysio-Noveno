"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./components/sidebar/sidebar"
import "./styles/userDashboard.css"

import { useAuth } from "@authContext" // Import useAuth

const UserDashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user } = useAuth()
  console.log(user.id)
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="user-dashboard">
      <Sidebar userData={user} isMobileOpen={isMobileSidebarOpen} toggleMobileSidebar={toggleMobileSidebar} />

      <div className="user-dashboard-content">
        <div className="user-dashboard-mobile-header">
          <button className="user-dashboard-menu-button" onClick={toggleMobileSidebar}>
            <span className="user-dashboard-menu-icon"></span>
          </button>
          <h1 className="user-dashboard-mobile-title">Mi Dashboard</h1>
        </div>

        <div className="user-dashboard-content-inner">
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  )
}

export default UserDashboardLayout

