import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ProPhysio</h3>
          <p>Tu cuerpo es tu compañero de vida, cuídalo, escúchalo y atiéndelo</p>
        </div>
        
        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/servicios">Servicios</a></li>
            <li><a href="/terms">Terminos y Condiciones</a></li>
            <li><a href="/ubicacion">Ubicación</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <ul>
            <li>
              <a href="https://wa.me/your-number" className="social-link">
                <i className="social-icon whatsapp"></i>
                Contáctanos por WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:info@prophysio.com" className="social-link">
                <i className="social-icon email"></i>
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href="#a" className="social-link">
              <i className="social-icon facebook"></i>
            </a>
            <a href="#a" className="social-link">
              <i className="social-icon youtube"></i>
            </a>
            <a href="#a" className="social-link">
              <i className="social-icon instagram"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 ProPhysio. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
