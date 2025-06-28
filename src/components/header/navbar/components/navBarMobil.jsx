"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronUp } from "lucide-react"

const NavDropdown = ({ title, items, mobile, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (!mobile) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobile])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = () => {
    setIsOpen(false)
    if (onItemClick) {
      onItemClick()
    }
  }

  return (
    <div className="nav-dropdown" ref={dropdownRef}>
      <button
        className="nav-link dropdown-toggle"
        onClick={toggleDropdown}
        onMouseEnter={!mobile ? () => setIsOpen(true) : undefined}
        aria-expanded={isOpen}
      >
        {title}
        {isOpen ? <ChevronUp className="dropdown-icon" /> : <ChevronDown className="dropdown-icon" />}
      </button>

      <div
        className={`dropdown-menu ${isOpen ? "open" : ""}`}
        onMouseLeave={!mobile ? () => setIsOpen(false) : undefined}
      >
        {items.map((item, index) => (
          <Link key={index} to={item.path} className="dropdown-item" onClick={handleItemClick}>
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NavDropdown

