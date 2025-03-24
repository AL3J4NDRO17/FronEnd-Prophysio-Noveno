"use client"

import { useState } from "react"
import FormField from "./FormField"

const PersonalInfoForm = ({ formData, handleInputChange }) => {
  const [errors, setErrors] = useState({})

  // Validar campo específico
  const validateField = (name, value) => {
    let error = null

    switch (name) {
      case "telefono":
        if (value && !/^\d{10}$/.test(value)) {
          error = "Ingrese un número de teléfono válido (10 dígitos)"
        }
        break
      case "codigoPostal":
        if (value && !/^\d{5}$/.test(value)) {
          error = "El código postal debe tener 5 dígitos"
        }
        break
      case "email":
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          error = "Ingrese un correo electrónico válido"
        }
        break
      default:
        break
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))

    return error === null
  }

  // Manejar cambios con validación
  const handleChange = (e) => {
    const { name, value } = e.target
    handleInputChange(e)
    validateField(name, value)
  }

  return (
    <div className="personal-info-form">
      <FormField
        label="Nombre Completo"
        name="nombre"
        type="text"

        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ingrese su nombre completo"
        error={errors.nombre}
      />

      <FormField
        label="Correo Electrónico"
        name="email"
        type="email"
        value={formData.email}
        disabled={true}
        onChange={handleChange}
        placeholder="correo@ejemplo.com"
        error={errors.email}
      />
      <FormField
        label="Teléfono"
        name="telefono"
        type="tel"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="Ej. 5512345678"
        error={errors.telefono}
      />

      <div className="form-field">
        <label>Sexo</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="sexo"
              value="masculino"
              checked={formData.sexo === "masculino"}
              onChange={handleChange}
            />
            <span>Masculino</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="sexo"
              value="femenino"
              checked={formData.sexo === "femenino"}
              onChange={handleChange}
            />
            <span>Femenino</span>
          </label>
        </div>
      </div>

      <div className="form-field">
        <label>Método de contacto preferido</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="medio_contacto_preferido"
              value="telefono"
              checked={formData.medio_contacto_preferido === "telefono"}
              onChange={handleChange}
            />
            <span>Teléfono</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="medio_contacto_preferido"
              value="email"
              checked={formData.medio_contacto_preferido === "email"}
              onChange={handleChange}
            />
            <span>Correo electrónico</span>
          </label>
        </div>
      </div>
      <FormField
        label="Edad"
        name="edad"
        type="number"
        value={formData.edad}
        onChange={handleChange}
        placeholder="Ej. 21"
        error={errors.edad}
      />


      <div className="form-row">
        <FormField
          label="Estado"
          name="estado"
          type="text"
          value={formData.estado}
          onChange={handleChange}
          placeholder="Ej. Ciudad de México"
          error={errors.estado}
        />
        <FormField
          label="Dirección"
          name="direccion"
          type="text"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Ej. Av. Principal #123"
          error={errors.direccion}
        />
      </div>


      <div className="form-row">
        <FormField
          label="Ciudad"
          name="ciudad"
          type="text"
          value={formData.ciudad}
          onChange={handleChange}
          placeholder="Ej. Ciudad de México"
          error={errors.ciudad}
        />

        <FormField
          label="Código Postal"
          name="codigo_postal"
          type="text"
          value={formData.codigo_postal}
          onChange={handleChange}
          placeholder="Ej. 01000"
          error={errors.codigo_postal}
        />
      </div>

    </div>
  )
}

export default PersonalInfoForm

