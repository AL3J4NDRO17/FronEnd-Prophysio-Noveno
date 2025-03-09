// Dropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Manejador para cerrar el dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="nav-item" ref={dropdownRef}>
      <button 
        className="nav-link"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        Servicios
      </button>
      {isOpen && (
        <div className="dropdown">
          <Link 
            to="/servicio1" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            Servicio 1
          </Link>
          <Link 
            to="/servicio2" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            Servicio 2
          </Link>
          <Link 
            to="/servicio3" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            Servicio 3
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dropdown;