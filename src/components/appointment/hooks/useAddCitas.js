"use client"

import { useEffect, useState } from "react"
import { getPerfilUsuario, crearPerfilUsuario, actualizarPerfilUsuario } from "../services/createCitaService"
import { citaService } from "../services/appointmentService"
import { radiografiaService } from "../services/radiografiaService" // Re-importar el servicio de radiografías
import { toast } from "react-toastify"

export const useAgendarCita = (userId) => {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [incompleto, setIncompleto] = useState(false)
  const [datosExtra, setDatosExtra] = useState({ alergias: "", motivo_consulta: "" })
  const [paso, setPaso] = useState(1)
  const [citaCreada, setCitaCreada] = useState(null)
  const [error, setError] = useState(null)
  const [radiografiaToUpload, setRadiografiaToUpload] = useState(null) // Nuevo estado para la radiografía
  const [radiografiaDescription, setRadiografiaDescription] = useState("") // Nuevo estado para la descripción

  // Función para manejar la radiografía seleccionada desde AppointmentDetailsStep
  const handleRadiografiaSelected = (file, description) => {
    setRadiografiaToUpload(file)
    setRadiografiaDescription(description)
  }

  // Paso 1: Cargar perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true)
        const data = await getPerfilUsuario(userId)
        setPerfil(data)
        const camposNecesarios = ["nombre", "sexo", "telefono"]
        const falta = camposNecesarios.some((c) => !data[c])
        setIncompleto(falta)
      } catch (err) {
        setIncompleto(true)
        console.error("Error cargando perfil:", err)
        toast.error("Error al cargar su perfil. Por favor, complete sus datos.")
      } finally {
        setLoading(false)
      }
    }

    if (userId) cargarPerfil()
  }, [userId])

  // Paso 2: Guardar o actualizar perfil
  const guardarDatosCliente = async (datosPerfil, extras) => {
    try {
      setLoading(true)
      let perfilFinal
      if (perfil && perfil.id_perfil) {
        perfilFinal = await actualizarPerfilUsuario(perfil.id_perfil, { ...perfil, ...datosPerfil })
      } else {
        perfilFinal = await crearPerfilUsuario({ ...datosPerfil, id_usuario: userId })
      }
      setPerfil(perfilFinal)
      setDatosExtra(extras)
      setIncompleto(false)

      // Si hay una radiografía para subir y el perfil ya tiene un ID, subirla
      if (radiografiaToUpload && perfilFinal?.id_perfil) {
        await radiografiaService.subirRadiografia(perfilFinal.id_perfil, radiografiaToUpload, radiografiaDescription)
        setRadiografiaToUpload(null) // Limpiar después de subir
        setRadiografiaDescription("")
      }

      setPaso(3) // Avanzar al siguiente paso
      toast.success("Datos de perfil guardados exitosamente.")
    } catch (err) {
      console.error("Error guardando perfil:", err)
      setError("Hubo un error al guardar tus datos")
      toast.error("Hubo un error al guardar tus datos.")
    } finally {
      setLoading(false)
    }
  }

  // Paso 3: Agendar cita
   const agendarCita = async (citaData) => {
    try {
      console.log("useAgendarCita: Datos de citaData recibidos en agendarCita:")
      if (citaData instanceof FormData) {
        for (const [key, value] of citaData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File (name: ${value.name}, type: ${value.type}, size: ${value.size} bytes)`)
          } else {
            console.log(`  ${key}: ${value}`)
          }
        }
      } else {
        console.log(citaData)
      }
      setLoading(true)

      // CAMBIO CLAVE AQUÍ: Pasar citaData directamente al servicio
      // No necesitas crear un finalCitaData si citaData ya es un FormData
      // y tu servicio está configurado para enviarlo como multipart/form-data.
      const cita = await citaService.crearCita(citaData) // Pasa el FormData directamente
      setCitaCreada(cita)
      setPaso(4) // Cita creada
      toast.success("Cita agendada exitosamente.")
    } catch (err) {
      console.error("Error al agendar cita:", err)
      setError("Error al agendar la cita")
      toast.error(err.response?.data?.message || "Error al agendar la cita.")
    } finally {
      setLoading(false)
    }
  }

  return {
    perfil,
    loading,
    paso,
    incompleto,
    error,
    citaCreada,
    guardarDatosCliente,
    agendarCita,
    handleRadiografiaSelected, // Exponer la función para el componente de paso
  }
}
