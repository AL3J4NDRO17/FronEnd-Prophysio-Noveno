"use client"

import { useState, useEffect, useCallback } from "react"
import { citaService } from "../services/appointment-service" // Renombrado para claridad
import Swal from "sweetalert2"
import { toast } from "react-toastify"

export const useCitas = () => {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargarCitas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await citaService.obtenerCitas()
      setCitas(data)
      
    } catch (err) {
      console.error("Error al cargar citas:", err)
      toast.error("No se pudieron cargar las citas.")
      setError(err.message || "Error al cargar citas")
    } finally {
      setLoading(false)
    }
  }, [])

  const crearCita = async (citaData) => {
    try {
      setLoading(true)
      const nuevaCita = await citaService.crearCita(citaData)
      setCitas((prev) => [...prev, nuevaCita])
      toast.success("Cita agendada exitosamente")
      return nuevaCita
    } catch (err) {
      console.error("Error al crear cita:", err)
      toast.error(err.response?.data?.message || "Error al agendar cita")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const actualizarCita = async (id_cita, data) => {
    try {
      setLoading(true)
      const citaActualizada = await citaService.actualizarCita(id_cita, data)
      setCitas((prev) => prev.map((cita) => (cita.id_cita === id_cita ? citaActualizada : cita)))
      toast.success("Cita actualizada")
      return citaActualizada
    } catch (err) {
      console.error("Error al actualizar cita:", err)
      toast.error(err.response?.data?.message || "No se pudo actualizar la cita")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const eliminarCita = async (id_cita) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar cita?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })

      if (result.isConfirmed) {
        setLoading(true)
        await citaService.eliminarCita(id_cita)
        setCitas((prev) => prev.filter((cita) => cita.id_cita !== id_cita))
        toast.success("Cita eliminada exitosamente")
      }
    } catch (err) {
      console.error("Error al eliminar cita:", err)
      toast.error(err.response?.data?.message || "No se pudo eliminar la cita")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const postergarCita = async (id_cita, motivo, nuevaFecha) => {
    try {
      setLoading(true)
      const datosPostergacion = {
        estado: "postergada", // o el estado que manejes
        motivo_postergacion: motivo,
        fecha_cita: nuevaFecha, // actualiza la fecha de la cita
        // podrías querer guardar la fecha original también
      }
      const citaPostergada = await citaService.actualizarCita(id_cita, datosPostergacion)
      setCitas((prev) => prev.map((cita) => (cita.id_cita === id_cita ? citaPostergada : cita)))
      toast.success(`Cita postergada para el ${new Date(nuevaFecha).toLocaleDateString()}`)
      return citaPostergada
    } catch (err) {
      console.error("Error al postergar cita:", err)
      toast.error(err.response?.data?.message || "No se pudo postergar la cita")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelarCita = async (id_cita, motivo) => {
    try {
      setLoading(true)
      const datosCancelacion = {
        estado: "cancelada", // o el estado que manejes
        motivo_cancelacion: motivo,
        // podrías querer limpiar la fecha o marcarla como no activa
      }
      const citaCancelada = await citaService.actualizarCita(id_cita, datosCancelacion) // Reutilizamos actualizarCita
      setCitas((prev) => prev.map((cita) => (cita.id_cita === id_cita ? citaCancelada : cita)))
      toast.success("Cita cancelada exitosamente")
      return citaCancelada
    } catch (err) {
      console.error("Error al cancelar cita:", err)
      toast.error(err.response?.data?.message || "No se pudo cancelar la cita")
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarCitas()
  }, [cargarCitas])

  return {
    citas,
    loading,
    error,
    cargarCitas,
    crearCita,
    actualizarCita,
    eliminarCita,
    postergarCita,
    cancelarCita,
  }
}
