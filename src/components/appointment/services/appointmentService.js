import axiosInstance from "@/components/api/axiosConfig";

const API_URL = "/citas";

export const citaService = {
  crearCita: async (formData) => {
    const res = await axiosInstance.post(`${API_URL}/createCita`, formData)
    return res.data
  },

  obtenerCitas: async () => {
    const res = await axiosInstance.get(`${API_URL}/getAllCitas`)
    return res.data
  },

  obtenerCitaPorId: async (id_cita) => {
    const res = await axiosInstance.get(`${API_URL}/getCitaById/${id_cita}`)
    return res.data
  },

  actualizarCita: async (id_cita, data) => {
    const res = await axiosInstance.put(`${API_URL}/updateCitaEstado/${id_cita}`, data)
    return res.data
  },
  confirmarCitaPorToken: async (token) => {
    const res = await axiosInstance.post(`${API_URL}/confirmarCitaToken`, { token })
    return res.data // Debería devolver la cita confirmada
  },
  eliminarCita: async (id_cita) => {
    const res = await axiosInstance.delete(`${API_URL}/deleteCita/${id_cita}`)
    return res.data
  },
  // No necesitamos una función específica para postergar o cancelar si usamos `actualizarCita`
  // para cambiar el estado y otros campos. Si tu backend tiene endpoints dedicados, añádelos aquí.
}
