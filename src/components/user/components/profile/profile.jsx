"use client"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import usePerfilUsuario from "./hooks/useProfileEditor"
import ProfileHeader from "./components/ProfileHeader"
import ProfileAvatar from "./components/ProfileAvatar"
import ProfileTabs from "./components/ProfileTabs"
import PersonalInfoForm from "./components/PersonalInfoForm"
import MedicalInfoForm from "./components/MedicalInfoForm"
import AccountInfoForm from "./components/AccountInfoForm"

import "./styles/profile.css"
import "./styles/ProfileTabs.css"
import "./styles/ProfileAvatar.css"
import "./styles/AccountInfoForm.css"
import "./styles/FormField.css"
import "./styles/MedicalInfoForm.css"
import "./styles/PersonalInfoForm.css"
import "./styles/ProfileHeader.css"

const ProfileSettings = () => {
  const {user} = useOutletContext()
  console.log(user)

  const userId = user?.id_Perfil   // Usar el ID del usuario actual o un valor por defecto
  const { perfiles: perfil, loading, actualizarPerfil } = usePerfilUsuario(userId)
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    sexo: "",
    edad: "",
    estado: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigo_postal: "",
    medio_contacto_preferido: "",
    alergias: "",
    medicamentos_alergia: "",
    profilePicture: null,

  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")

  // Cargar datos del perfil cuando estén disponibles
  useEffect(() => {
    if (perfil) {
      setFormData({
        nombre: perfil.nombre_completo || "",
        email: user.email || "",
        sexo: perfil.sexo || "",
        edad: perfil.edad|| "",
        telefono: perfil.telefono || "",
        direccion: perfil.direccion || "",
        estado: perfil.estado || "",
        ciudad: perfil.ciudad || "",
        codigo_postal: perfil.codigo_postal || "",   
        medio_contacto_preferido: perfil.medio_contacto_preferido || "telefono",
        alergias: perfil.alergias || "",
        medicamentos_alergia: perfil.medicamentos_alergia || "",
        profilePicture: perfil.profilePicture || null,
      })
    } 
  }, [perfil, user])

  // Generar URL para el avatar basado en las iniciales del usuario
  useEffect(() => {
    if (formData.nombre) {
      const encodedName = encodeURIComponent(formData.nombre)
      setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}`)
    }
  }, [formData.nombre])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (perfil) {
        // Si existe un perfil, actualizarlo
        await actualizarPerfil(userId, formData)
      } else {
        // Si no existe un perfil, mostrar error
        // Nota: Podrías implementar la creación de perfil si es necesario
        toast.error("No se puede actualizar el perfil porque no existe")
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p>Cargando información del perfil...</p>
      </div>
    )
  }

  return (
    <div className="profile-settings">
      <ProfileHeader />

      <ProfileAvatar avatarUrl={avatarUrl} nombre={formData.nombre} />

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <form className="profile-content" onSubmit={handleSubmit}>
        {activeTab === "personal" && <PersonalInfoForm formData={formData} handleInputChange={handleInputChange} />}

        {activeTab === "medical" && <MedicalInfoForm formData={formData} handleInputChange={handleInputChange} />}

        {activeTab === "account" && <AccountInfoForm userData={user} perfilActual={perfil} />}

        <div className="profile-actions">
          <button type="submit" className="profile-save-button" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileSettings

