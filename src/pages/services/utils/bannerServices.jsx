import "../styles/bannerServices.css"
import { ReactComponent as SvgServices} from "../assets/25026379_7014651.svg"


const ContactBanner = () => {
  return (
    <div className="contact-banner">
      <div className="banner-content">
        <div className="banner-image">
          <SvgServices/>
           
        </div>
        <div className="banner-text">
          <h2>¿Listo para comenzar tu proceso de sanación?</h2>
          <p>Agenda una consulta gratuita y comienza tu camino hacia el bienestar</p>
          <button className="contact-button">Contáctanos Hoy</button>
        </div>
      </div>
    </div>
  )
}

export default ContactBanner

