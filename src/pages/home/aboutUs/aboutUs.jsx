import { CheckCircle2 } from 'lucide-react'

import './aboutUs.css'

const AboutServices = () => {
  return (
    <section className="about-services">
      <div className="about-content">
        
        <div className="about-image">
          <img
            src="https://placehold.co/600x400/png"
            alt="Physiotherapist helping patient with balance exercise"
            className="main-image"
          />
        </div>
        <div className="about-text">
          <h2>
          About us
          </h2>
          <div className="goals">
            <p>Recupera tu movilidad</p>
            <p>Reintegrate a tus actividades sin dolor</p>
          </div>  
          <div className="services-list">
            <h3>Nuestros servicios</h3>
            <ul>
              <li>
                <CheckCircle2 className="check-icon" />
                <span>Fisioterapia Pediátrica</span>
              </li>
              <li>
                <CheckCircle2 className="check-icon" />
                <span>Fisioterapia Ortopédica</span>
              </li>
              <li>
                <CheckCircle2 className="check-icon" />
                <span>Fisioterapia Oncológica</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutServices

