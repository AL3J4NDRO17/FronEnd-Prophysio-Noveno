import "./termsAndPolicies.css"
import { ReactComponent as SvgTerms } from "./assets/undraw_terms_7l7t.svg"

const TermsAndConditions = () => {
  return (
    <div className="terms-simple-container">
      <div className="terms-simple-content">
        <div className="terms-simple-text">
          <h1 className="terms-simple-title">Términos y Condiciones</h1>
          <p className="terms-simple-date">Última actualización: {new Date().toLocaleDateString()}</p>

          <section className="terms-simple-section">
            <h2>1. Introducción</h2>
            <p>
              Bienvenido a ProPhysio. Estos Términos y Condiciones rigen el uso de nuestros servicios y sitio web. Al
              acceder o utilizar nuestros servicios, usted acepta estar sujeto a estos términos.
            </p>
            <p>Por favor, lea estos términos cuidadosamente antes de utilizar nuestra plataforma.</p>
          </section>

          <section className="terms-simple-section">
            <h2>2. Servicios</h2>
            <p>
              ProPhysio ofrece servicios de fisioterapia y rehabilitación física a través de nuestra plataforma.
              Nuestros servicios incluyen:
            </p>
            <ul>
                <li>Consultas de fisioterapia presenciales</li>
                <li>Evaluaciones físicas</li>
                <li>Planes de tratamiento personalizados</li>
                <li>Seguimiento de progreso</li>
                <li>Recursos educativos sobre salud física</li>
                </ul>
                <p>
                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto de nuestros servicios
                en cualquier momento.
                </p>
            </section>

          <section className="terms-simple-section">
            <h2>3. Cuentas de Usuario</h2>
            <p>Para acceder a ciertos servicios, deberá crear una cuenta de usuario. Usted es responsable de:</p>
            <ul>
              <li>Mantener la confidencialidad de su información de cuenta</li>
              <li>Restringir el acceso a su computadora o dispositivo</li>
              <li>Asumir la responsabilidad por todas las actividades realizadas bajo su cuenta</li>
            </ul>
            <p>
              Nos reservamos el derecho de rechazar el servicio, cerrar cuentas o modificar o eliminar contenido a
              nuestra sola discreción.
            </p>
          </section>

          <section className="terms-simple-section">
            <h2>4. Política de Privacidad</h2>
            <p>
              Su privacidad es importante para nosotros. Nuestra Política de Privacidad describe cómo recopilamos,
              usamos y protegemos su información personal.
            </p>
            <p>Al utilizar nuestros servicios, usted acepta nuestras prácticas de privacidad, que incluyen:</p>
            <ul>
              <li>Recopilación de información personal necesaria para brindar nuestros servicios</li>
              <li>Uso de cookies y tecnologías similares</li>
              <li>Compartir información con proveedores de servicios terceros cuando sea necesario</li>
              <li>Implementación de medidas de seguridad para proteger su información</li>
            </ul>
          </section>

          <section className="terms-simple-section">
            <h2>5. Descargo de Responsabilidad Médica</h2>
            <p>
              La información proporcionada a través de nuestros servicios es solo para fines informativos y educativos,
              y no constituye asesoramiento médico profesional, diagnóstico o tratamiento.
            </p>
            <p>
              Siempre busque el consejo de su médico u otro proveedor de salud calificado con cualquier pregunta que
              pueda tener sobre una condición médica.
            </p>
            <p>
              Nunca ignore el consejo médico profesional ni demore en buscarlo debido a algo que haya leído en nuestra
              plataforma.
            </p>
          </section>

          <section className="terms-simple-section">
            <h2>6. Limitaciones de Responsabilidad</h2>
            <p>
              En ningún caso ProPhysio, sus directores, empleados o agentes serán responsables por cualquier daño
              directo, indirecto, incidental, especial, punitivo o consecuente que surja de:
            </p>
            <ul>
              <li>El uso o la incapacidad de usar nuestros servicios</li>
              <li>Cualquier conducta o contenido de terceros en nuestros servicios</li>
              <li>Acceso no autorizado o alteración de sus transmisiones o datos</li>
            </ul>
            <p>
              Esta limitación se aplicará independientemente de la base legal de la reclamación y de si se advirtió de
              la posibilidad de tales daños.
            </p>
          </section>

          <section className="terms-simple-section">
            <h2>7. Cambios a los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor
              inmediatamente después de su publicación en nuestra plataforma.
            </p>
            <p>
              Su uso continuado de nuestros servicios después de cualquier cambio constituye su aceptación de los nuevos
              términos.
            </p>
            <p>
              Es su responsabilidad revisar periódicamente estos términos para estar al tanto de las actualizaciones.
            </p>
          </section>

          <section className="terms-simple-section">
            <h2>8. Contacto</h2>
            <p>Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en:</p>
            <p className="terms-simple-contact">
              Email: <a href="mailto:info@prophysio.com">info@prophysio.com</a>
              <br />
              Teléfono: (123) 456-7890
              <br />
              Dirección: Av. Principal #123, Ciudad
            </p>
          </section>
        </div>

        <div className="terms-simple-illustration">
          <SvgTerms/>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions

