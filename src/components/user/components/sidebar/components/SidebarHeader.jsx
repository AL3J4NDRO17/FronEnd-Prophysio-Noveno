"use client"


const SidebarHeader = ({ toggleMobileSidebar }) => {
  return (
    <div className="sidebar-header">
      <div className="sidebar-logo">
      
        <h1>ProPhysio Web</h1>
      </div>
      <button className="sidebar-close-button" onClick={toggleMobileSidebar}>
        &times;
      </button>
    </div>
  )
}

export default SidebarHeader

