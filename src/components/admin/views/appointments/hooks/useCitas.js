"use client"

import { useState, useEffect, useCallback } from "react"
import { appointmentService } from "../services/appointment-service"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

export const useCitas = () => {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCitas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await appointmentService.getAllAppointments()
      setCitas(data)
    } catch (err) {
      setError(err)
      toast.error("Error al cargar las citas.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCitas()
  }, [fetchCitas])

  const addCita = async (citaData) => {
    try {
      const newCita = await appointmentService.createAppointment(citaData)
      setCitas((prev) => [...prev, newCita])
      toast.success("Cita agendada con éxito.")
      return newCita
    } catch (err) {
      console.error("Error al crear cita:", err)
      toast.error(err.response?.data?.message || "Error al agendar la cita.")
      throw err
    }
  }

  const updateCita = async (id, citaData) => {
    try {
      const updatedCita = await appointmentService.updateAppointment(id, citaData)
      setCitas((prev) => prev.map((cita) => (cita.id_cita === id ? updatedCita : cita)))
      toast.success("Cita actualizada con éxito.")
      return updatedCita
    } catch (err) {
      console.error(`Error al actualizar cita ${id}:`, err)
      toast.error(err.response?.data?.message || "Error al actualizar la cita.")
      throw err
    }
  }

  const deleteCita = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la cita permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      try {
        await appointmentService.deleteAppointment(id)
        setCitas((prev) => prev.filter((cita) => cita.id_cita !== id))
        toast.success("Cita eliminada con éxito.")
      } catch (err) {
        console.error(`Error al eliminar cita ${id}:`, err)
        toast.error(err.response?.data?.message || "Error al eliminar la cita.")
        throw err
      }
    }
  }

  const cancelCita = async (id, reason) => {
    try {
      const updatedCita = await appointmentService.cancelAppointment(id, reason)
      setCitas((prev) => prev.map((cita) => (cita.id_cita === id ? updatedCita : cita)))
      toast.success("Cita cancelada con éxito.")
      return updatedCita
    } catch (err) {
      console.error(`Error al cancelar cita ${id}:`, err)
      toast.error(err.response?.data?.message || "Error al cancelar la cita.")
      throw err
    }
  }

  const postponeCita = async (id, newDateTime, reason) => {
    try {
      const updatedCita = await appointmentService.postponeAppointment(id, newDateTime, reason)
      setCitas((prev) => prev.map((cita) => (cita.id_cita === id ? updatedCita : cita)))
      toast.success("Cita postergada con éxito.")
      return updatedCita
    } catch (err) {
      console.error(`Error al postergar cita ${id}:`, err)
      toast.error(err.response?.data?.message || "Error al postergar la cita.")
      throw err
    }
  }

  const marcarAsistida = async (id) => {
    try {
      const updatedCita = await appointmentService.markAsAttended(id)
      setCitas((prev) => prev.map((cita) => (cita.id_cita === id ? updatedCita : cita)))
      toast.success("Cita marcada como asistida.")
      return updatedCita
    } catch (err) {
      console.error(`Error al marcar cita ${id} como asistida:`, err)
      toast.error(err.response?.data?.message || "Error al marcar la cita como asistida.")
      throw err
    }
  }

  const marcarInasistencia = async (id) => {
    try {
      const updatedCita = await appointmentService.markAsNoShow(id)
      setCitas((prev) => prev.map((cita) => (cita.id_cita === id ? updatedCita : cita)))
      toast.success("Cita marcada como inasistencia.")
      return updatedCita
    } catch (err) {
      console.error(`Error al marcar cita ${id} como inasistencia:`, err)
      toast.error(err.response?.data?.message || "Error al marcar la cita como inasistencia.")
      throw err
    }
  }

  return {
    citas,
    loading,
    error,
    fetchCitas,
    addCita,
    updateCita,
    deleteCita,
    cancelCita,
    postponeCita,
    marcarAsistida,
    marcarInasistencia,
  }
}
