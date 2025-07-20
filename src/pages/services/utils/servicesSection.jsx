import React from "react"
import { HeartPulse, Bone, Users, Brain, Accessibility, Check } from 'lucide-react'
import Ortopedic from "../assets/rehaOrtopedic.webp"
import kid from "../assets/rehaKid.webp"
import Onco from "../assets/oncologic.webp"
// Datos de servicios
const servicesData = [
  {
    id: 1,
    icon: "HeartPulse",
    title: "Fisioterapia Pediátrica",
    description:
      "Programas especializados para niños, enfocados en el desarrollo motor, la recuperación de lesiones y el manejo de condiciones neurológicas o musculoesqueléticas.",
    features: ["Evaluación del desarrollo", "Terapia de juego", "Asesoramiento familiar"],
    image: kid,
  },
  {
    id: 2,
    icon: "Bone",
    title: "Fisioterapia Ortopédica",
    description:
      "Tratamientos para lesiones musculoesqueléticas, post-quirúrgicos, fracturas, esguinces y problemas articulares, buscando restaurar la función y reducir el dolor.",
    features: ["Rehabilitación post-quirúrgica", "Manejo del dolor", "Fortalecimiento muscular"],
    image: Ortopedic,
  },
  {
    id: 3,
    icon: "Users",
    title: "Fisioterapia Oncológica",
    description:
      "Soporte integral para pacientes con cáncer, ayudando a manejar los efectos secundarios del tratamiento, mejorar la calidad de vida y mantener la funcionalidad.",
    features: ["Drenaje linfático", "Manejo de la fatiga", "Ejercicios adaptados"],
    image: Onco,
  },
 
]

export default function ServicesGrid() {
  // Función para renderizar el icono correcto según el tipo
  const renderIcon = (iconType) => {
    switch (iconType) {
      case "HeartPulse":
        return <HeartPulse className="service-card__icon-svg" />
      case "Bone":
        return <Bone className="service-card__icon-svg" />
      case "Users":
        return <Users className="service-card__icon-svg" />
     
      default:
        return <HeartPulse className="service-card__icon-svg" /> // Icono por defecto
    }
  }

  return (
    <section className="services-section">
      <div className="services-section__container">
        <div className="services-section__header">
          <h2 className="services-section__title">Nuestros servicios especializados</h2>
          <p className="services-section__subtitle">
            Ofrecemos una amplia gama de servicios de fisioterapia y rehabilitación para ayudarte a recuperar tu salud
            y bienestar.
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
                  // Para React.js, las imágenes se cargan desde la carpeta 'public'
                  // Si estás usando un bundler como Webpack/Vite, asegúrate de que las imágenes se copien a la carpeta de salida.
                />
                <div className="service-card__icon">{renderIcon(service.icon)}</div>
              </div>
              <div className="service-card__content">
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
                <ul className="service-card__features">
                  {service.features.map((feature, index) => (
                    <li key={index} className="service-card__feature">
                      <Check className="service-card__check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
               
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
