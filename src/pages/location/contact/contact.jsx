"use client"

import { useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"
import "../styles/contact.css"

function ContactItem({ icon, title, content }) {
  return (
    <div className="location-contact-item">
      <div className="location-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
    aceptaPolitica: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica de envío del formulario
    console.log("Formulario enviado:", formData)
  }

  return (
    <div className="location-contact-section">
      <div className="location-contact-content">
        <h2>Contáctame</h2>

        <div className="location-contact-grid">
          <div className="location-contact-info">
            <p className="location-contact-description">
              Ahora que ya me conoces y sabes lo que podría hacer por ti, no dudes en contactar conmigo sin ningún
              compromiso.
            </p>

            <div className="location-contact-details">
              <ContactItem icon={<Phone />} title="Por teléfono o WhatsApp:" content="+34 611 007 411" />
              <ContactItem icon={<Mail />} title="Por mail en:" content="carlos@fisioalandia.com" />
              <ContactItem
                icon={<MapPin />}
                title="¿Dónde me desplazo?"
                content="Huejutla y alrededores, El Alto, Atlapexco, Jaltocan"
              />
            </div>
          </div>

          <form className="location-contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="mensaje"
              placeholder="Cuéntame qué puedo hacer por ti"
              value={formData.mensaje}
              onChange={handleChange}
              rows={4}
              required
            />
            <div className="form-checkbox">
              <input
                type="checkbox"
                name="aceptaPolitica"
                checked={formData.aceptaPolitica}
                onChange={handleChange}
                required
              />
              <label htmlFor="aceptaPolitica">Acepto la política de privacidad</label>
            </div>
            <button type="submit" className="location-btn primary">
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

