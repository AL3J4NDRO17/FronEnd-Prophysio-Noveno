import { MapPin, Clock, Phone } from "lucide-react"
import "../styles/locationpage.css"
import IMG from "../assets/ubicacionProphysio.png"

const LocationPage = () => {
  return (
    <div className="location-container">
      <section className="location-map">
        <iframe
          title="Ubicación de la clínica PROphysio"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2317278087676!2d-98.42264345297794!3d21.143174454171252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d726ea4ad4ec25%3A0xe58eef2079c1b9fa!2sPROphysio%20FISIOTERAPIA!5e0!3m2!1ses!2smx!4v1737326156240!5m2!1ses!2smx"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
     
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
      <section className="location-hero">
        <h1>Clínica de Fisioterapia PROphysio</h1>
        <p>Tu bienestar, nuestra prioridad</p>
      </section>

      <section className="location-info">
        <div className="location-image">
          <img src={IMG || "/placeholder.svg"} alt="Vista de la calle de la clínica" />
        </div>

        <div className="location-details">
          <InfoItem
            icon={<MapPin />}
            title="Dirección"
            content={["Col. Tehuizan", "C.P. 43000, Huejutla de Reyes, Hgo"]}
          />
          <InfoItem icon={<Clock />} title="Horario" content={["L: 09:30-20:00", "M-V: 10:00-20:00"]} />
          <InfoItem icon={<Phone />} title="Teléfono" content={["222 508 1501", "WhatsApp: +52 222 508 1501"]} />

          <div className="location-action-buttons">
            <button className="location-btn primary">¡VISÍTANOS!</button>
            <button className="location-btn secondary">WHATSAPP</button>
          </div>
        </div>
      </section>


    </div>
  )
}

const InfoItem = ({ icon, title, content }) => (
  <div className="info-item-txt">
    <div className="info-icon">{icon}</div>
    <div>
      <h3>{title}</h3>
      {content.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  </div>
)

export default LocationPage

