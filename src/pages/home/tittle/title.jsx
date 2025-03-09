import "./title.css"

import FadeInSection from "../../../utils/animations/fadeInSection"

const TitleHome = () => {
  return (
    <>

      <div className="title-container">
        <FadeInSection>
          <h1>Clínica de Fisioterapia y Rehabilitación ProPhysio</h1>
        </FadeInSection>
        <FadeInSection>
          <div className="title-content">
            <p className="title-main-text">
              Somos una <strong>Clínica Especializada y Exclusiva</strong>. Su alivio, salud y{" "}
              <strong>bienestar físico</strong> son nuestra mayor motivación.
            </p>

            <p className="title-secondary-text">
              Nuestra <strong>atención es personalizada</strong>, y el trato cálido y <strong>humano</strong>. Contamos con
              equipos de <strong>alta tecnología</strong> y técnicas manuales novedosas y seguras.
            </p>
          </div>
        </FadeInSection>
        <FadeInSection>
          
        </FadeInSection>
      </div>

    </>
  )
}

export default TitleHome

