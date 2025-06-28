import { useEffect, useState } from "react";
import {
  getPerfilUsuario,
  crearPerfilUsuario,
  actualizarPerfilUsuario,

} from "../services/createCitaService";

import { citaService } from "../services/appointmentService";

export const useAgendarCita = (userId) => {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [incompleto, setIncompleto] = useState(false)
  const [datosExtra, setDatosExtra] = useState({ alergias: "", motivo_consulta: "" })
  const [paso, setPaso] = useState(1)
  const [citaCreada, setCitaCreada] = useState(null)
  const [error, setError] = useState(null)

  // Paso 1: Cargar perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await getPerfilUsuario(userId)
        setPerfil(data)
        const camposNecesarios = ["nombre", "sexo", "telefono"]
        const falta = camposNecesarios.some((c) => !data[c])
        setIncompleto(falta)
      } catch (err) {
        setIncompleto(true) // No hay perfil
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
        // Asegurarse de que id_perfil existe para actualizar
        perfilFinal = await actualizarPerfilUsuario(perfil.id_perfil, { ...perfil, ...datosPerfil })
      } else {
        perfilFinal = await crearPerfilUsuario({ ...datosPerfil, id_usuario: userId })
      }
      setPerfil(perfilFinal)
      setDatosExtra(extras)
      setIncompleto(false)
      setPaso(3) // Avanzar al siguiente paso
    } catch (err) {
      console.error("Error guardando perfil:", err)
      setError("Hubo un error al guardar tus datos")
    } finally {
      setLoading(false)
    }
  }

  // Paso 3: Agendar cita
  const agendarCita = async (citaFormData) => {
    // Cambiado para aceptar FormData
    try {
      setLoading(true)
      const cita = await citaService.crearCita(citaFormData) // Pasa el FormData directamente
      setCitaCreada(cita)
      setPaso(4) // Cita creada
    } catch (err) {
      console.error("Error al agendar cita:", err)
      setError("Error al agendar la cita")
    } finally {
      setLoading(false)
    }
  }

  return {
    perfil,
    loading,
    paso, // indica en qué parte del flujo estás (1, 2, 3, 4)
    incompleto, // si el perfil necesita datos
    error,
    citaCreada,
    guardarDatosCliente,
    agendarCita,
  }
}