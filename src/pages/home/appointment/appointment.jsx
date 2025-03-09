import { Calendar, MapPin, Phone, Mail } from "lucide-react"
import FadeInSection from "../../../utils/animations/fadeInSection"
import { ReactComponent as SvgAssetAppointmentHome } from "./assets/undraw_online-calendar_zaoc.svg"
import "./appointment.css"

import SlideInRight from '../../../utils/animations/SlideRight';
import SlideInLeft from '../../../utils/animations/SlideLeft';

const AppointmentSection = () => {
  return (
    <section className="appointment-section">
      <div className="appointment-container">
        <SlideInLeft>
          <div className="appointment-content">
            <div className="appointment-info">
              <h2 className="appointment-title">Reserva tu cita ya!</h2>
              <p className="appointment-description">
                Nuestra atención es personalizada y el trato cálido y humano. Contamos con equipos de alta tecnología y
                técnicas manuales innovadoras y seguras.
              </p>
              <a href="tel:1-800-643-4300" className="appointment-button">
                <Calendar size={20} />
                Reservar ahora
              </a>
              <div className="contact-details">
                <div className="contact-item">
                  <MapPin size={20} />
                  <span>123 Calle Principal, Ciudad, CP 12345</span>
                </div>
                <div className="contact-item">
                  <Phone size={20} />
                  <span>+1 800-643-4300</span>
                </div>
                <div className="contact-item">
                  <Mail size={20} />
                  <span>info@prophysio.com</span>
                </div>
              </div>
            </div>
            <SlideInRight>
              <div className="appointment-image">
                <SvgAssetAppointmentHome />
              </div>
            </SlideInRight>
          </div>
        </SlideInLeft>
      </div>
      <FadeInSection>
        <div className="appointment-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2317278087676!2d-98.42264345297794!3d21.143174454171252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d726ea4ad4ec25%3A0xe58eef2079c1b9fa!2sPROphysio%20FISIOTERAPIA!5e0!3m2!1ses!2smx!4v1737326156240!5m2!1ses!2smx"
            title="Ubicación de PROphysio FISIOTERAPIA"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </FadeInSection>
    </section>
  )
}

export default AppointmentSection

