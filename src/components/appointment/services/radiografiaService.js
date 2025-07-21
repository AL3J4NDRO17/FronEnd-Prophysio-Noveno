import axios from "axios"
import { toast } from "react-toastify"

const API_URL = "/api/radiografias" // Ajusta esta URL a tu endpoint de backend

export const radiografiaService = {
  /**
   * Sube una radiografía para un perfil de usuario específico.
   * @param {number} idPerfil - El ID del perfil de usuario.
   * @param {File} file - El objeto File de la radiografía.
   * @param {string} [descripcion] - Una descripción opcional para la radiografía.
   * @returns {Promise<object>} Los datos de la radiografía subida.
   */
  subirRadiografia: async (idPerfil, file, descripcion = "") => {
    try {
      const formData = new FormData()
      formData.append("radiografia", file) // El nombre del campo debe coincidir con lo que espera tu backend (ej. 'radiografia' o 'files')
      if (descripcion) {
        formData.append("descripcion", descripcion)
      }

      const response = await axios.post(`${API_URL}/${idPerfil}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("Radiografía subida exitosamente.")
      return response.data
    } catch (error) {
      console.error("Error al subir radiografía:", error)
      const errorMessage = error.response?.data?.error || "Error al subir la radiografía."
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },

  /**
   * Obtiene todas las radiografías para un perfil de usuario específico.
   * @param {number} idPerfil - El ID del perfil de usuario.
   * @returns {Promise<Array<object>>} Un array de objetos de radiografía.
   */
  getRadiografiasByPerfil: async (idPerfil) => {
    try {
      const response = await axios.get(`${API_URL}/${idPerfil}`)
      return response.data.radiografias || []
    } catch (error) {
      console.error("Error al obtener radiografías:", error)
      const errorMessage = error.response?.data?.error || "Error al obtener las radiografías."
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },
}
