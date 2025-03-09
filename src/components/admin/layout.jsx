import { Outlet } from "react-router-dom"
import "./layout.css"
import Sidebar from "./adminSidebar/adminSidebar"

export default function Layout() {
  return (
    <div className="adminLayout">
      <Sidebar />
      <main className="adminMain">

        <div className="adminContent">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

