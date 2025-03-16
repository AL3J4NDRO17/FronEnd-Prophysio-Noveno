"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const Dropdown = ({ mobile, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="nav-item">
      <button
        className="nav-link"
        onClick={mobile ? toggleDropdown : undefined}
        onMouseEnter={!mobile ? () => setIsOpen(true) : undefined}
        onMouseLeave={!mobile ? () => setIsOpen(false) : undefined}
        aria-expanded={isOpen}
      >
        Servicios
        {mobile && (isOpen ? <ChevronUp className="icon-chevDrown" /> : <ChevronDown className="icon-chevDrown" />)}
      </button>

      {(isOpen || (!mobile && isOpen)) && (
        <div
          className="dropdown"
          onMouseEnter={!mobile ? () => setIsOpen(true) : undefined}
          onMouseLeave={!mobile ? () => setIsOpen(false) : undefined}
        >
          <Link to="/service1" className="dropdown-item" onClick={handleItemClick}>
            Fisioterapia Pediátrica
          </Link>
          <Link to="/service2" className="dropdown-item" onClick={handleItemClick}>
            Fisioterapia Ortopédica
          </Link>
          <Link to="/service3" className="dropdown-item" onClick={handleItemClick}>
            Fisioterapia Oncológica
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
