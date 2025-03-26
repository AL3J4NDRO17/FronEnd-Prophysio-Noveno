import React from "react";


// Datos de servicios
const servicesData = [
  {
    id: 1,
    icon: "rehabilitation",
    title: "Rehabilitación Física",
    description: "Recupera tu movilidad y fuerza después de lesiones o cirugías con nuestros programas personalizados de rehabilitación.",
    features: ["Evaluación completa", "Plan personalizado", "Seguimiento continuo"],
    image: "https://placehold.co/600x4000"
  },
  {
    id: 2,
    icon: "sports",
    title: "Fisioterapia Deportiva",
    description: "Tratamientos especializados para atletas y deportistas que buscan mejorar su rendimiento y prevenir lesiones.",
    features: ["Prevención de lesiones", "Recuperación rápida", "Mejora del rendimiento"],
    image: "https://placehold.co/600x400"
  },
  {
    id: 3,
    icon: "massage",
    title: "Terapia Manual",
    description: "Técnicas de masaje terapéutico y manipulación para aliviar el dolor y mejorar la movilidad articular.",
    features: ["Alivio del dolor", "Mejora de la circulación", "Reducción de tensión"],
    image: "https://placehold.co/600x400"
  },
  {
    id: 4,
    icon: "neurological",
    title: "Rehabilitación Neurológica",
    description: "Tratamientos especializados para pacientes con trastornos neurológicos como ACV, Parkinson o esclerosis múltiple.",
    features: ["Reeducación motora", "Mejora del equilibrio", "Adaptación funcional"],
    image: "https://placehold.co/600x400"
  },
  {
    id: 5,
    icon: "geriatric",
    title: "Fisioterapia Geriátrica",
    description: "Cuidados especializados para adultos mayores enfocados en mejorar la movilidad, equilibrio y calidad de vida.",
    features: ["Prevención de caídas", "Mejora de la autonomía", "Manejo del dolor crónico"],
    image: "https://placehold.co/600x400"
  },
  {
    id: 6,
    icon: "respiratory",
    title: "Fisioterapia Respiratoria",
    description: "Técnicas para mejorar la función pulmonar y el manejo de condiciones respiratorias crónicas o agudas.",
    features: ["Drenaje bronquial", "Ejercicios respiratorios", "Reeducación respiratoria"],
    image: "https://placehold.co/600x400"
  }
];

export default function ServicesGrid() {
  // Función para renderizar el icono correcto según el tipo
  const renderIcon = (iconType) => {
    switch (iconType) {
      case "rehabilitation":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
      case "sports":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        );
      case "massage":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12h8"></path>
            <path d="M4 18h16"></path>
            <path d="M4 6h16"></path>
            <path d="M14 12h6"></path>
          </svg>
        );
      case "neurological":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        );
      case "geriatric":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      case "respiratory":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
    }
  };

  return (
    <section className="services-section">
      <div className="services-section__container">
        <div className="services-section__header">
          <h2 className="services-section__title">Nuestros servicios especializados</h2>
          <p className="services-section__subtitle">
            Ofrecemos una amplia gama de servicios de fisioterapia y rehabilitación para ayudarte a recuperar tu salud y bienestar
          </p>
        </div>

        <div className="services-section__grid">
          {servicesData.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card__image-container">
                <img 
                  src={service.image || "/placeholder.svg"} 
                  alt={service.title} 
                  className="service-card__image" 
                />
                <div className="service-card__icon">
                  {renderIcon(service.icon)}
                </div>
              </div>
              <div className="service-card__content">
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
                <ul className="service-card__features">
                  {service.features.map((feature, index) => (
                    <li key={index} className="service-card__feature">
                      <svg className="service-card__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href={`/services/${service.id}`} className="service-card__button">
                  Más información
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
