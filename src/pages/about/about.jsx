import "./about.css"
import IMG1 from "./assets/collageImg1.webp"
import IMG2 from "./assets/collageImg2.webp"
import IMG3 from "./assets/collageImg3.webp"
import MyV from "./assets/MyVSectionImg.webp"

export default function AboutCompany() {
  return (
    <div className="company-showcase">
      {/* Hero Section */}
      <section className="company-hero">
        <div className="company-hero__overlay"></div>
        <div className="company-hero__content">
          <h1 className="company-hero__title">Nuestra Historia</h1>
          <p className="company-hero__subtitle">Comprometidos con tu bienestar desde 2005</p>
          <button className="company-hero__button">Conoce más</button>
        </div>
      </section>

      {/* About Section */}
      <section className="company-about">
        <div className="company-about__container">
          <div className="company-about__text-column">
            <span className="company-about__eyebrow">Quiénes Somos</span>
            <h2 className="company-about__heading">Expertos en fisioterapia y rehabilitación</h2>
            <p className="company-about__description">
              Somos un equipo de profesionales dedicados a mejorar la calidad de vida de nuestros pacientes a través de
              técnicas avanzadas de fisioterapia y rehabilitación. Con más de 15 años de experiencia, nos hemos
              convertido en referentes en el cuidado personalizado y efectivo.
            </p>
            <div className="company-about__stats">
              <div className="company-about__stat">
                <span className="company-about__stat-number">15+</span>
                <span className="company-about__stat-label">Años de experiencia</span>
              </div>
              <div className="company-about__stat">
                <span className="company-about__stat-number">5000+</span>
                <span className="company-about__stat-label">Pacientes atendidos</span>
              </div>
              <div className="company-about__stat">
                <span className="company-about__stat-number">20</span>
                <span className="company-about__stat-label">Especialistas</span>
              </div>
            </div>
          </div>
          <div className="company-about__image-column">
            <div className="company-about__image-grid">
              <div className="company-about__image company-about__image--main">
                <img src={IMG1} alt="Equipo de fisioterapeutas" />
              </div>
              <div className="company-about__image company-about__image--top">
                <img src={IMG2} alt="Instalaciones modernas" />
              </div>
              <div className="company-about__image company-about__image--bottom">
                <img src={IMG3} alt="Sesión de terapia" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="company-mission-vision">
        <div className="company-mission-vision__container">
          <div className="company-mission-vision__card company-mission-vision__card--mission">
            <div className="company-mission-vision__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="company-mission-vision__title">Misión</h3>
            <p className="company-mission-vision__text">
              Contribuir en la salud y bienestar de la población infantil, adulta y adulta mayor, poniendo a su
              disposición servicios de calidad a través de diversos métodos y técnicas de intervención de fisioterapia
              reconociendo el valor y dignidad de cada paciente.
            </p>
          </div>
          <div className="company-mission-vision__card company-mission-vision__card--vision">
            <div className="company-mission-vision__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h3 className="company-mission-vision__title">Visión</h3>
            <p className="company-mission-vision__text">
              Ser una clínica de fisioterapia reconocida por su constante capacitación y actualización en los temas
              relacionados en rehabilitación y bienestar para sus pacientes y trabajadores con enfoque personalista.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="company-values">
        <div className="company-values__container">
          <div className="company-values__header">
            <h2 className="company-values__heading">Nuestros Valores</h2>
            <p className="company-values__subheading">Los principios que guían nuestro trabajo diario</p>
          </div>
          <div className="company-values__grid">
            <div className="company-values__item">
              <div className="company-values__icon company-values__icon--responsibility">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="company-values__title">Responsabilidad</h3>
              <p className="company-values__description">
                Nos comprometemos con cada paciente para ofrecer el mejor tratamiento posible.
              </p>
            </div>
            <div className="company-values__item">
              <div className="company-values__icon company-values__icon--respect">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                </svg>
              </div>
              <h3 className="company-values__title">Respeto</h3>
              <p className="company-values__description">
                Tratamos a cada persona con dignidad, empatía y consideración.
              </p>
            </div>
            <div className="company-values__item">
              <div className="company-values__icon company-values__icon--equality">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className="company-values__title">Igualdad</h3>
              <p className="company-values__description">
                Ofrecemos el mismo nivel de atención y cuidado a todos nuestros pacientes.
              </p>
            </div>
            <div className="company-values__item">
              <div className="company-values__icon company-values__icon--honesty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <h3 className="company-values__title">Honestidad</h3>
              <p className="company-values__description">
                Actuamos con transparencia y sinceridad en cada interacción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="company-team">
        <div className="company-team__container">
          <div className="company-team__header">
            <h2 className="company-team__heading">Nuestro Equipo</h2>
            <p className="company-team__subheading">Profesionales comprometidos con tu bienestar</p>
          </div>
          <div className="company-team__grid">
            <div className="company-team__member">
              <div className="company-team__photo">
                <img src={IMG1} alt="Director médico" />
              </div>
              <h3 className="company-team__name">Dr. Carlos Méndez</h3>
              <p className="company-team__position">Director Médico</p>
            </div>
            <div className="company-team__member">
              <div className="company-team__photo">
                <img src={IMG2} alt="Fisioterapeuta senior" />
              </div>
              <h3 className="company-team__name">Dra. Laura Sánchez</h3>
              <p className="company-team__position">Fisioterapeuta Senior</p>
            </div>
            <div className="company-team__member">
              <div className="company-team__photo">
                <img src={IMG3} alt="Especialista en rehabilitación" />
              </div>
              <h3 className="company-team__name">Lic. Miguel Torres</h3>
              <p className="company-team__position">Especialista en Rehabilitación</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

