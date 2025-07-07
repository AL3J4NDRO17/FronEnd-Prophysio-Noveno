"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentService } from "../services/appointment-service"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

export const useCitas = () => {
  const queryClient = useQueryClient()

  const {
    data: citas = [],
    isLoading: loading,
    isError,
    error,
    refetch: fetchCitas,
  } = useQuery({
    queryKey: ["citas"],
    queryFn: appointmentService.getAllAppointments,
  })

  const addCitaMutation = useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: (newCita) => {
      queryClient.setQueryData(["citas"], (prev = []) => [...prev, newCita])
      toast.success("Cita agendada con éxito.")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error al agendar la cita.")
    },
  })

  const updateCitaMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.updateAppointment(id, data),
    onSuccess: (updatedCita) => {
      queryClient.setQueryData(["citas"], (prev = []) =>
        prev.map((cita) => (cita.id_cita === updatedCita.id_cita ? updatedCita : cita))
      )
      toast.success("Cita actualizada con éxito.")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error al actualizar la cita.")
    },
  })

  const cancelCitaMutation = useMutation({
    mutationFn: ({ id, reason }) => appointmentService.cancelAppointment(id, reason),
    onSuccess: (updatedCita) => {
      queryClient.setQueryData(["citas"], (prev = []) =>
        prev.map((cita) => (cita.id_cita === updatedCita.id_cita ? updatedCita : cita))
      )
      toast.success("Cita cancelada con éxito.")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error al cancelar la cita.")
    },
  })

  const postponeCitaMutation = useMutation({
    mutationFn: ({ id, newDateTime, reason }) =>
      appointmentService.postponeAppointment(id, newDateTime, reason),
    onSuccess: (updatedCita) => {
      queryClient.setQueryData(["citas"], (prev = []) =>
        prev.map((cita) => (cita.id_cita === updatedCita.id_cita ? updatedCita : cita))
      )
      toast.success("Cita postergada con éxito.")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error al postergar la cita.")
    },
  })

  const marcarAsistidaMutation = useMutation({
    mutationFn: (id) => appointmentService.markAsAttended(id),
    onSuccess: (updatedCita) => {
      queryClient.setQueryData(["citas"], (prev = []) =>
        prev.map((cita) => (cita.id_cita === updatedCita.id_cita ? updatedCita : cita))
      )
      toast.success("Cita marcada como asistida.")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error al marcar como asistida.")
    },
  })

  const marcarInasistenciaMutation = useMutation({
    mutationFn: (id) => appointmentService.markAsNoShow(id),
    onSuccess: (updatedCita) => {
      queryClient.setQueryData(["citas"], (prev = []) =>
        prev.map((cita) => (cita.id_cita === updatedCita.id_cita ? updatedCita : cita))
      )
      toast.success("Cita marcada como inasistencia.")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error al marcar como inasistencia.")
    },
  })

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
        queryClient.setQueryData(["citas"], (prev = []) =>
          prev.filter((cita) => cita.id_cita !== id)
        )
        toast.success("Cita eliminada con éxito.")
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al eliminar la cita.")
        throw err
      }
    }
  }

  return {
    citas,
    loading,
    error: isError ? error : null,
    fetchCitas,
    addCita: addCitaMutation.mutateAsync,
    updateCita: updateCitaMutation.mutateAsync,
    cancelCita: cancelCitaMutation.mutateAsync,
    postponeCita: postponeCitaMutation.mutateAsync,
    marcarAsistida: marcarAsistidaMutation.mutateAsync,
    marcarInasistencia: marcarInasistenciaMutation.mutateAsync,
    deleteCita,
  }
}
