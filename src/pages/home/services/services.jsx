import { Activity, Building2, Dumbbell, Heart, Stethoscope, Users } from "lucide-react"
import FadeInSection from "../../../utils/animations/fadeInSection"
import "./services.css"

const services = [
  {
    icon: Heart,
    title: "Fisioterapia Pediátrica",
    description: "Atención especializada para niños, enfocada en su desarrollo y bienestar físico.",
    color: "var(--clr-brand-primary)",
  },
  {
    icon: Activity,
    title: "Fisioterapia Ortopédica",
    description: "Tratamiento de lesiones musculoesqueléticas y rehabilitación post-quirúrgica.",
    color: "var(--color-secondary)",
  },
  {
    icon: Users,
    title: "Fisioterapia Oncológica",
    description: "Cuidado especializado para pacientes en tratamiento oncológico.",
    color: "#4CAF50",
  },
  {
    icon: Dumbbell,
    title: "Rehabilitación Deportiva",
    description: "Recuperación y prevención de lesiones para deportistas.",
    color: "#FF9800",
  },
  {
    icon: Stethoscope,
    title: "Terapia Manual",
    description: "Técnicas especializadas de manipulación y movilización.",
    color: "#9C27B0",
  },
  {
    icon: Building2,
    title: "Instalaciones Modernas",
    description: "Equipamiento de última generación para su tratamiento.",
    color: "#2196F3",
  },
]

function HomeServiceCard({ icon: Icon, title, description, color }) {
  return (
    <div className="serviceCard">
      <div className="serviceCard__iconWrapper" style={{ "--card-color": color }}>
        <Icon size={28} className="serviceCard__icon" />
      </div>
      <h3 className="serviceCard__title">{title}</h3>
      <p className="serviceCard__description">{description}</p>
      <div className="serviceCard__arrow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section className="services">
      <div className="services__container">
        <FadeInSection>
          <div className="services__header">
            <span className="services__subtitle">Nuestros Servicios</span>
            <h2 className="services__title">
              Servicios Especializados de <span className="highlight">Fisioterapia</span>
            </h2>
            <p className="services__description">
              Nuestra atención es personalizada y el trato clínico humano. Contamos con equipos de alta tecnología y
              técnicas manuales novedosas y seguras.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="services__grid">
            {services.map((service, index) => (
              <HomeServiceCard key={index} {...service} />
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

