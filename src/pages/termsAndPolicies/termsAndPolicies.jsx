"use client"

import { useState } from "react"
import "./termsAndPolicies.css"

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("section1")

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -100 // Ajuste para el header fijo
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  // Fecha de última actualización
  const lastUpdated = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <div className="privacy-header__content">
          <div className="privacy-header__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className="privacy-header__title">Política de Privacidad</h1>
          <p className="privacy-header__subtitle">
            Nos comprometemos a proteger la privacidad y seguridad de tus datos personales
          </p>
        </div>
      </div>

      <div className="privacy-content">
        <aside className="privacy-sidebar">
          <div className="privacy-sidebar__container">
            <div className="privacy-sidebar__header">
              <h2 className="privacy-sidebar__title">Contenido</h2>
            </div>
            <nav className="privacy-sidebar__nav">
              <ul className="privacy-sidebar__list">
                <li className="privacy-sidebar__item">
                  <button
                    className={`privacy-sidebar__button ${activeSection === "section1" ? "privacy-sidebar__button--active" : ""}`}
                    onClick={() => scrollToSection("section1")}
                  >
                    <span className="privacy-sidebar__icon">📋</span>
                    <span className="privacy-sidebar__text">Información que Recopilamos</span>
                  </button>
                </li>
                <li className="privacy-sidebar__item">
                  <button
                    className={`privacy-sidebar__button ${activeSection === "section2" ? "privacy-sidebar__button--active" : ""}`}
                    onClick={() => scrollToSection("section2")}
                  >
                    <span className="privacy-sidebar__icon">📚</span>
                    <span className="privacy-sidebar__text">Uso de la Información</span>
                  </button>
                </li>
                <li className="privacy-sidebar__item">
                  <button
                    className={`privacy-sidebar__button ${activeSection === "section3" ? "privacy-sidebar__button--active" : ""}`}
                    onClick={() => scrollToSection("section3")}
                  >
                    <span className="privacy-sidebar__icon">🔒</span>
                    <span className="privacy-sidebar__text">Protección de la Información</span>
                  </button>
                </li>
                <li className="privacy-sidebar__item">
                  <button
                    className={`privacy-sidebar__button ${activeSection === "section4" ? "privacy-sidebar__button--active" : ""}`}
                    onClick={() => scrollToSection("section4")}
                  >
                    <span className="privacy-sidebar__icon">👥</span>
                    <span className="privacy-sidebar__text">Compartición de Información</span>
                  </button>
                </li>
                <li className="privacy-sidebar__item">
                  <button
                    className={`privacy-sidebar__button ${activeSection === "section5" ? "privacy-sidebar__button--active" : ""}`}
                    onClick={() => scrollToSection("section5")}
                  >
                    <span className="privacy-sidebar__icon">✅</span>
                    <span className="privacy-sidebar__text">Consentimiento Informado</span>
                  </button>
                </li>
                <li className="privacy-sidebar__item">
                  <button
                    className={`privacy-sidebar__button ${activeSection === "section6" ? "privacy-sidebar__button--active" : ""}`}
                    onClick={() => scrollToSection("section6")}
                  >
                    <span className="privacy-sidebar__icon">📧</span>
                    <span className="privacy-sidebar__text">Derechos del Titular</span>
                  </button>
                </li>
                <li className="privacy-sidebar__item">
                  <button
                    className={`privacy-sidebar__button ${activeSection === "section7" ? "privacy-sidebar__button--active" : ""}`}
                    onClick={() => scrollToSection("section7")}
                  >
                    <span className="privacy-sidebar__icon">📞</span>
                    <span className="privacy-sidebar__text">Contacto</span>
                  </button>
                </li>
                <li className="privacy-sidebar__item">
                  <button
                    className={`privacy-sidebar__button ${activeSection === "section8" ? "privacy-sidebar__button--active" : ""}`}
                    onClick={() => scrollToSection("section8")}
                  >
                    <span className="privacy-sidebar__icon">⚖️</span>
                    <span className="privacy-sidebar__text">Cambios en la Política</span>
                  </button>
                </li>
              </ul>
            </nav>
            <div className="privacy-sidebar__footer">
              <p className="privacy-sidebar__update">
                Última actualización: <br />
                <strong>{lastUpdated}</strong>
              </p>
              <a href="#" className="privacy-sidebar__download">
                Descargar PDF
              </a>
            </div>
          </div>
        </aside>

        <main className="privacy-main">
          <div className="privacy-main__container">
            <div className="privacy-main__intro">
              <div className="privacy-main__logo">
                <span className="privacy-main__logo-text">ProPhysio</span>
              </div>
              <p className="privacy-main__description">
                En ProPhysio, nos comprometemos a proteger la privacidad y seguridad de los datos personales de nuestros
                pacientes, colaboradores y visitantes. Esta Política de Privacidad explica cómo recopilamos, utilizamos
                y protegemos la información que nos proporcionas al utilizar nuestros servicios.
              </p>
            </div>

            <section id="section1" className="privacy-section">
              <div className="privacy-section__header">
                <span className="privacy-section__icon">📋</span>
                <h2 className="privacy-section__title">1. Información que Recopilamos</h2>
              </div>
              <div className="privacy-section__content">
                <p>
                  Recopilamos información personal de diversas maneras para garantizar la correcta prestación de
                  nuestros servicios. Esta información puede incluir:
                </p>
                <div className="privacy-cards">
                  <div className="privacy-card">
                    <div className="privacy-card__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <h3 className="privacy-card__title">Datos personales</h3>
                    <p className="privacy-card__text">Nombre, edad, género, teléfono, correo electrónico, domicilio.</p>
                  </div>
                  <div className="privacy-card">
                    <div className="privacy-card__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                    </div>
                    <h3 className="privacy-card__title">Datos médicos</h3>
                    <p className="privacy-card__text">
                      Historial clínico, resultados de exámenes, diagnóstico, tratamientos realizados, y cualquier otra
                      información de salud relevante.
                    </p>
                  </div>
                  <div className="privacy-card">
                    <div className="privacy-card__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                    </div>
                    <h3 className="privacy-card__title">Datos de pago</h3>
                    <p className="privacy-card__text">
                      Información necesaria para procesar pagos por nuestros servicios.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="section2" className="privacy-section">
              <div className="privacy-section__header">
                <span className="privacy-section__icon">📚</span>
                <h2 className="privacy-section__title">2. Uso de la Información</h2>
              </div>
              <div className="privacy-section__content">
                <p>La información recopilada será utilizada para los siguientes fines:</p>
                <ul className="privacy-list">
                  <li className="privacy-list__item">
                    <span className="privacy-list__bullet"></span>
                    Proveer servicios de fisioterapia personalizados.
                  </li>
                  <li className="privacy-list__item">
                    <span className="privacy-list__bullet"></span>
                    Elaborar y mantener expedientes clínicos.
                  </li>
                  <li className="privacy-list__item">
                    <span className="privacy-list__bullet"></span>
                    Gestionar citas y recordatorios.
                  </li>
                  <li className="privacy-list__item">
                    <span className="privacy-list__bullet"></span>
                    Cumplir con obligaciones legales y normativas.
                  </li>
                  <li className="privacy-list__item">
                    <span className="privacy-list__bullet"></span>
                    Evaluar la calidad de nuestros servicios para mejorar la experiencia del paciente.
                  </li>
                </ul>
              </div>
            </section>

            <section id="section3" className="privacy-section">
              <div className="privacy-section__header">
                <span className="privacy-section__icon">🔒</span>
                <h2 className="privacy-section__title">3. Protección de la Información</h2>
              </div>
              <div className="privacy-section__content">
                <p>
                  Implementamos medidas de seguridad físicas, electrónicas y administrativas para proteger tu
                  información personal y prevenir accesos no autorizados. Entre estas medidas se incluyen:
                </p>
                <div className="privacy-security">
                  <div className="privacy-security__item">
                    <div className="privacy-security__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <p className="privacy-security__text">Cifrado de datos sensibles.</p>
                  </div>
                  <div className="privacy-security__item">
                    <div className="privacy-security__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <p className="privacy-security__text">Control de acceso restringido a expedientes clínicos.</p>
                  </div>
                  <div className="privacy-security__item">
                    <div className="privacy-security__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                      </svg>
                    </div>
                    <p className="privacy-security__text">Actualización constante de protocolos de seguridad.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="section4" className="privacy-section">
              <div className="privacy-section__header">
                <span className="privacy-section__icon">👥</span>
                <h2 className="privacy-section__title">4. Compartición de Información</h2>
              </div>
              <div className="privacy-section__content">
                <p>Solo compartiremos tu información en casos específicos, como:</p>
                <div className="privacy-sharing">
                  <div className="privacy-sharing__item">
                    <p className="privacy-sharing__text">
                      <strong>Cumplimiento legal:</strong> Requerimientos legales por parte de autoridades competentes.
                    </p>
                  </div>
                  <div className="privacy-sharing__item">
                    <p className="privacy-sharing__text">
                      <strong>Proveedores de servicios:</strong> Con terceros proveedores que nos asistan en la
                      prestación de nuestros servicios (siempre bajo estrictos acuerdos de confidencialidad).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="section5" className="privacy-section">
              <div className="privacy-section__header">
                <span className="privacy-section__icon">✅</span>
                <h2 className="privacy-section__title">5. Consentimiento Informado</h2>
              </div>
              <div className="privacy-section__content">
                <p>
                  Antes de recopilar y utilizar información médica, obtendremos tu consentimiento informado explícito,
                  garantizando que comprendes y aceptas el uso de tus datos para fines médicos y administrativos.
                </p>
                <div className="privacy-consent">
                  <div className="privacy-consent__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <p className="privacy-consent__text">
                    Tu consentimiento puede ser revocado en cualquier momento, sin que esto afecte la legalidad del
                    tratamiento basado en el consentimiento previo a su retirada.
                  </p>
                </div>
              </div>
            </section>

            <section id="section6" className="privacy-section">
              <div className="privacy-section__header">
                <span className="privacy-section__icon">📧</span>
                <h2 className="privacy-section__title">6. Derechos del Titular de los Datos</h2>
              </div>
              <div className="privacy-section__content">
                <p>Como titular de tus datos personales, tienes derecho a:</p>
                <div className="privacy-rights">
                  <div className="privacy-right">
                    <div className="privacy-right__header">
                      <div className="privacy-right__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </div>
                      <h3 className="privacy-right__title">Acceder</h3>
                    </div>
                    <p className="privacy-right__text">Conocer qué información almacenamos sobre ti.</p>
                  </div>
                  <div className="privacy-right">
                    <div className="privacy-right__header">
                      <div className="privacy-right__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </div>
                      <h3 className="privacy-right__title">Rectificar</h3>
                    </div>
                    <p className="privacy-right__text">Actualizar o corregir tus datos.</p>
                  </div>
                  <div className="privacy-right">
                    <div className="privacy-right__header">
                      <div className="privacy-right__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </div>
                      <h3 className="privacy-right__title">Cancelar</h3>
                    </div>
                    <p className="privacy-right__text">
                      Solicitar la eliminación de tu información cuando ya no sea necesaria.
                    </p>
                  </div>
                  <div className="privacy-right">
                    <div className="privacy-right__header">
                      <div className="privacy-right__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                        </svg>
                      </div>
                      <h3 className="privacy-right__title">Oponerte</h3>
                    </div>
                    <p className="privacy-right__text">Limitar el uso de tus datos para fines específicos.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="section7" className="privacy-section">
              <div className="privacy-section__header">
                <span className="privacy-section__icon">📞</span>
                <h2 className="privacy-section__title">7. Contacto</h2>
              </div>
              <div className="privacy-section__content">
                <p>
                  Si tienes preguntas o deseas ejercer tus derechos respecto a tus datos personales, puedes contactarnos
                  a través de:
                </p>
                <div className="privacy-contact">
                  <div className="privacy-contact__item">
                    <div className="privacy-contact__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className="privacy-contact__content">
                      <h3 className="privacy-contact__title">Correo electrónico</h3>
                      <p className="privacy-contact__text">
                        <a href="mailto:contacto@prophysio.com" className="privacy-contact__link">
                          contacto@prophysio.com
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="privacy-contact__item">
                    <div className="privacy-contact__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="privacy-contact__content">
                      <h3 className="privacy-contact__title">Teléfono</h3>
                      <p className="privacy-contact__text">
                        <a href="tel:+525512345678" className="privacy-contact__link">
                          +52 55 1234 5678
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="privacy-contact__item">
                    <div className="privacy-contact__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className="privacy-contact__content">
                      <h3 className="privacy-contact__title">Dirección</h3>
                      <p className="privacy-contact__text">
                        Av. Principal #123, Col. Centro, Ciudad de México, CP 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="section8" className="privacy-section">
              <div className="privacy-section__header">
                <span className="privacy-section__icon">⚖️</span>
                <h2 className="privacy-section__title">8. Cambios en la Política de Privacidad</h2>
              </div>
              <div className="privacy-section__content">
                <p>
                  ProPhysio se reserva el derecho de modificar esta política en cualquier momento para cumplir con
                  cambios legales o mejoras en nuestros servicios. Te notificaremos sobre cambios importantes a través
                  de nuestros medios de contacto.
                </p>
                <div className="privacy-updates">
                  <div className="privacy-updates__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <p className="privacy-updates__text">
                    La fecha en la parte superior de esta política indica cuándo se realizó la última actualización.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

