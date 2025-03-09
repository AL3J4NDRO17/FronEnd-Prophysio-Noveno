import React from 'react';
import '../styles/topbannerServices.css';
import IMG from '../assets/topBanner.webp'; // Asegúrate de mover la imagen a `src/assets/`

const TopBannerServices = () => {
  return (
    <section className="top-banner-section">
      <img 
        src={IMG} 
        alt="Nuestros Servicios - Soluciones profesionales para tu bienestar" 
        className="top-banner-img"
        width="1920"
        height="450"
        loading="eager"
        fetchpriority="high"
      />
      <div className="top-banner-overlay">
        <div className="top-banner-content">
          <h1 className="top-banner-title">Nuestros Servicios</h1>
          <p className="top-banner-subtitle">
            Soluciones profesionales para tu bienestar y salud.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopBannerServices;
