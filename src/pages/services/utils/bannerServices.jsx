

export default function TopBannerServices() {
  return (
    <section className="services-hero">
      <div className="services-hero__overlay"></div>
      <div className="services-hero__content">
        <span className="services-hero__eyebrow">Nuestros Servicios</span>
        <h1 className="services-hero__title">Soluciones de fisioterapia personalizadas</h1>
        <p className="services-hero__description">
          Ofrecemos tratamientos especializados para mejorar tu calidad de vida y bienestar físico
        </p>
        <div className="services-hero__stats">
          <div className="services-hero__stat">
            <span className="services-hero__stat-number">15+</span>
            <span className="services-hero__stat-label">Años de experiencia</span>
          </div>
          <div className="services-hero__stat">
            <span className="services-hero__stat-number">5000+</span>
            <span className="services-hero__stat-label">Pacientes satisfechos</span>
          </div>
          <div className="services-hero__stat">
            <span className="services-hero__stat-number">98%</span>
            <span className="services-hero__stat-label">Tasa de éxito</span>
          </div>
        </div>
      </div>
    </section>
  )
}

