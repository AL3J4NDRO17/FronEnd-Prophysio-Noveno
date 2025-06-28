import axiosInstance from "@/components/api/axiosConfig";



// Asegúrate de que esta URL sea accesible desde tu frontend
// Si Next.js y tu backend están en el mismo dominio en producción, puedes usar rutas relativas.
// Para desarrollo, localhost:3000 puede ser tu backend y Next.js en otro puerto.

export const citaService = {
  crearCita: async (data) => {
    const res = await axiosInstance.post(`citas//createCita`, data)
    return res.data
  },

  obtenerCitas: async () => {
    const res = await axiosInstance.get(`citas/getallCitas`)
    return res.data
  },

  obtenerCitaPorId: async (id_cita) => {
    const res = await axiosInstance.get(`citas/getCitaById/${id_cita}`)
    return res.data
  },
  obtenerPerfilPorCita: async (id_cita) => {
    const res = await axiosInstance.get(`citas/getPerfilPorCita/${id_cita}`)
    return res.data
  },
  actualizarCita: async (id_cita, data) => {
    const res = await axiosInstance.put(`citas/updateCitaEstado/${id_cita}`, data)
    return res.data
  },

  eliminarCita: async (id_cita) => {
    const res = await axiosInstance.delete(`citas/deleteCita/${id_cita}`)
    return res.data
  },
  // No necesitamos una función específica para postergar o cancelar si usamos `actualizarCita`
  // para cambiar el estado y otros campos. Si tu backend tiene endpoints dedicados, añádelos aquí.
}
