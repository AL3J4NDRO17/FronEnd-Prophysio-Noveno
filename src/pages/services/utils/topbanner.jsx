
export default function ContactBanner() {
  return (
    <section className="contact-banner">
      <div className="contact-banner__overlay"></div>
      <div className="contact-banner__container">
        <div className="contact-banner__content">
          <h2 className="contact-banner__title">¿Necesitas ayuda con tu rehabilitación?</h2>
          <p className="contact-banner__text">
            Nuestro equipo de profesionales está listo para ayudarte. Agenda una consulta hoy mismo y da el primer paso
            hacia tu recuperación.
          </p>
          <div className="contact-banner__actions">
            <a href="/location" className="contact-banner__button contact-banner__button--primary">
              Agendar cita
            </a>
            <a href="/contact" className="contact-banner__button contact-banner__button--secondary">
              Contactar
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

