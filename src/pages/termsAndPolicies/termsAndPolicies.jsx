"use client"

import { useState, useEffect } from "react"
import "./termsAndPolicies.css"

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("")

  // Observador de intersección para detectar qué sección está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -80% 0px" },
    )

    document.querySelectorAll(".privacy-section").forEach((section) => {
      observer.observe(section)
    })

    return () => {
      document.querySelectorAll(".privacy-section").forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
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
      <header className="privacy-header">
        <div className="privacy-header__content">
          <h1 className="privacy-header__title">Política de Privacidad</h1>
          <p className="privacy-header__subtitle">Última actualización: {lastUpdated}</p>
        </div>
      </header>

      <div className="privacy-content">
        <aside className="privacy-sidebar">
          <nav className="privacy-nav">
            <ul className="privacy-nav__list">
              <li className="privacy-nav__item">
                <button
                  className={`privacy-nav__link ${activeSection === "section1" ? "privacy-nav__link--active" : ""}`}
                  onClick={() => scrollToSection("section1")}
                >
                  1. Información que Recopilamos
                </button>
              </li>
              <li className="privacy-nav__item">
                <button
                  className={`privacy-nav__link ${activeSection === "section2" ? "privacy-nav__link--active" : ""}`}
                  onClick={() => scrollToSection("section2")}
                >
                  2. Uso de la Información
                </button>
              </li>
              <li className="privacy-nav__item">
                <button
                  className={`privacy-nav__link ${activeSection === "section3" ? "privacy-nav__link--active" : ""}`}
                  onClick={() => scrollToSection("section3")}
                >
                  3. Protección de la Información
                </button>
              </li>
              <li className="privacy-nav__item">
                <button
                  className={`privacy-nav__link ${activeSection === "section4" ? "privacy-nav__link--active" : ""}`}
                  onClick={() => scrollToSection("section4")}
                >
                  4. Compartición de Información
                </button>
              </li>
              <li className="privacy-nav__item">
                <button
                  className={`privacy-nav__link ${activeSection === "section5" ? "privacy-nav__link--active" : ""}`}
                  onClick={() => scrollToSection("section5")}
                >
                  5. Consentimiento Informado
                </button>
              </li>
              <li className="privacy-nav__item">
                <button
                  className={`privacy-nav__link ${activeSection === "section6" ? "privacy-nav__link--active" : ""}`}
                  onClick={() => scrollToSection("section6")}
                >
                  6. Derechos del Titular
                </button>
              </li>
              <li className="privacy-nav__item">
                <button
                  className={`privacy-nav__link ${activeSection === "section7" ? "privacy-nav__link--active" : ""}`}
                  onClick={() => scrollToSection("section7")}
                >
                  7. Contacto
                </button>
              </li>
              <li className="privacy-nav__item">
                <button
                  className={`privacy-nav__link ${activeSection === "section8" ? "privacy-nav__link--active" : ""}`}
                  onClick={() => scrollToSection("section8")}
                >
                  8. Cambios en la Política
                </button>
              </li>
            </ul>
          </nav>
          <div className="privacy-actions">
            <a href="#" className="privacy-actions__button">
              Descargar PDF
            </a>
          </div>
        </aside>

        <main className="privacy-main">
          <div className="privacy-intro">
            <h2 className="privacy-intro__title">ProPhysio</h2>
            <p className="privacy-intro__text">
              En ProPhysio, nos comprometemos a proteger la privacidad y seguridad de los datos personales de nuestros
              pacientes, colaboradores y visitantes. Esta Política de Privacidad explica cómo recopilamos, utilizamos y
              protegemos la información que nos proporcionas al utilizar nuestros servicios.
            </p>
          </div>

          <section id="section1" className="privacy-section">
            <h2 className="privacy-section__title">1. Información que Recopilamos</h2>
            <div className="privacy-section__content">
              <p>
                Recopilamos información personal de diversas maneras para garantizar la correcta prestación de nuestros
                servicios. Esta información puede incluir:
              </p>
              <ul className="privacy-list">
                <li className="privacy-list__item">
                  <strong>Datos personales:</strong> Nombre, edad, género, teléfono, correo electrónico, domicilio.
                </li>
                <li className="privacy-list__item">
                  <strong>Datos médicos:</strong> Historial clínico, resultados de exámenes, diagnóstico, tratamientos
                  realizados, y cualquier otra información de salud relevante.
                </li>
                <li className="privacy-list__item">
                  <strong>Datos de pago:</strong> Información necesaria para procesar pagos por nuestros servicios.
                </li>
              </ul>
            </div>
          </section>

          <section id="section2" className="privacy-section">
            <h2 className="privacy-section__title">2. Uso de la Información</h2>
            <div className="privacy-section__content">
              <p>La información recopilada será utilizada para los siguientes fines:</p>
              <ul className="privacy-list">
                <li className="privacy-list__item">Proveer servicios de fisioterapia personalizados.</li>
                <li className="privacy-list__item">Elaborar y mantener expedientes clínicos.</li>
                <li className="privacy-list__item">Gestionar citas y recordatorios.</li>
                <li className="privacy-list__item">Cumplir con obligaciones legales y normativas.</li>
                <li className="privacy-list__item">
                  Evaluar la calidad de nuestros servicios para mejorar la experiencia del paciente.
                </li>
              </ul>
            </div>
          </section>

          <section id="section3" className="privacy-section">
            <h2 className="privacy-section__title">3. Protección de la Información</h2>
            <div className="privacy-section__content">
              <p>
                Implementamos medidas de seguridad físicas, electrónicas y administrativas para proteger tu información
                personal y prevenir accesos no autorizados. Entre estas medidas se incluyen:
              </p>
              <ul className="privacy-list">
                <li className="privacy-list__item">Cifrado de datos sensibles.</li>
                <li className="privacy-list__item">Control de acceso restringido a expedientes clínicos.</li>
                <li className="privacy-list__item">Actualización constante de protocolos de seguridad.</li>
              </ul>
            </div>
          </section>

          <section id="section4" className="privacy-section">
            <h2 className="privacy-section__title">4. Compartición de Información</h2>
            <div className="privacy-section__content">
              <p>Solo compartiremos tu información en casos específicos, como:</p>
              <ul className="privacy-list">
                <li className="privacy-list__item">
                  <strong>Cumplimiento legal:</strong> Requerimientos legales por parte de autoridades competentes.
                </li>
                <li className="privacy-list__item">
                  <strong>Proveedores de servicios:</strong> Con terceros proveedores que nos asistan en la prestación
                  de nuestros servicios (siempre bajo estrictos acuerdos de confidencialidad).
                </li>
              </ul>
            </div>
          </section>

          <section id="section5" className="privacy-section">
            <h2 className="privacy-section__title">5. Consentimiento Informado</h2>
            <div className="privacy-section__content">
              <p>
                Antes de recopilar y utilizar información médica, obtendremos tu consentimiento informado explícito,
                garantizando que comprendes y aceptas el uso de tus datos para fines médicos y administrativos.
              </p>
              <p>
                Tu consentimiento puede ser revocado en cualquier momento, sin que esto afecte la legalidad del
                tratamiento basado en el consentimiento previo a su retirada.
              </p>
            </div>
          </section>

          <section id="section6" className="privacy-section">
            <h2 className="privacy-section__title">6. Derechos del Titular de los Datos</h2>
            <div className="privacy-section__content">
              <p>Como titular de tus datos personales, tienes derecho a:</p>
              <ul className="privacy-list">
                <li className="privacy-list__item">
                  <strong>Acceder:</strong> Conocer qué información almacenamos sobre ti.
                </li>
                <li className="privacy-list__item">
                  <strong>Rectificar:</strong> Actualizar o corregir tus datos.
                </li>
                <li className="privacy-list__item">
                  <strong>Cancelar:</strong> Solicitar la eliminación de tu información cuando ya no sea necesaria.
                </li>
                <li className="privacy-list__item">
                  <strong>Oponerte:</strong> Limitar el uso de tus datos para fines específicos.
                </li>
              </ul>
            </div>
          </section>

          <section id="section7" className="privacy-section">
            <h2 className="privacy-section__title">7. Contacto</h2>
            <div className="privacy-section__content">
              <p>
                Si tienes preguntas o deseas ejercer tus derechos respecto a tus datos personales, puedes contactarnos a
                través de:
              </p>
              <div className="privacy-contact">
                <p className="privacy-contact__item">
                  <strong>Correo electrónico:</strong>{" "}
                  <a href="mailto:contacto@prophysio.com" className="privacy-contact__link">
                    contacto@prophysio.com
                  </a>
                </p>
                <p className="privacy-contact__item">
                  <strong>Teléfono:</strong>{" "}
                  <a href="tel:+525512345678" className="privacy-contact__link">
                    +52 55 1234 5678
                  </a>
                </p>
                <p className="privacy-contact__item">
                  <strong>Dirección:</strong> Av. Principal #123, Col. Centro, Ciudad de México, CP 12345
                </p>
              </div>
            </div>
          </section>

          <section id="section8" className="privacy-section">
            <h2 className="privacy-section__title">8. Cambios en la Política de Privacidad</h2>
            <div className="privacy-section__content">
              <p>
                ProPhysio se reserva el derecho de modificar esta política en cualquier momento para cumplir con cambios
                legales o mejoras en nuestros servicios. Te notificaremos sobre cambios importantes a través de nuestros
                medios de contacto.
              </p>
              <p>La fecha en la parte superior de esta política indica cuándo se realizó la última actualización.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

