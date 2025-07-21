import axiosInstance from "@/components/api/axiosConfig";

const API_URL = "/citas";

export const citaService = {
  crearCita: async (citaData) => {
    try {
      console.log(
        "citaService.crearCita: Tipo de citaData antes de enviar:",
        typeof citaData,
        "Es instancia de FormData:",
        citaData instanceof FormData,
      )
      if (citaData instanceof FormData) {
        console.log("citaService.crearCita: Contenido de FormData antes de enviar:")
        for (const pair of citaData.entries()) {
          if (pair[1] instanceof File) {
            console.log(
              `  ${pair[0]}: File (name: ${pair[1].name}, type: ${pair[1].type}, size: ${pair[1].size} bytes)`,
            )
          } else {
            console.log(`  ${pair[0]}: ${pair[1]}`)
          }
        }
      }

      // CAMBIO CLAVE AQUÍ: Establecer Content-Type a undefined para que Axios lo maneje automáticamente
      const response = await axiosInstance.post(`${API_URL}/createCita`, citaData, {
        headers: {
          "Content-Type": undefined, // Esto es crucial para que Axios envíe multipart/form-data
        },
      })

      return response.data
    } catch (error) {
      console.error("Error al crear cita en citaService:", error.response?.data || error.message)
      const errorMessage = error.response?.data?.message || "Error al agendar la cita."

      throw new Error(errorMessage)
    }
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
