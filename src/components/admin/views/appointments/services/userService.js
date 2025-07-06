import axiosInstance from "@/components/api/axiosConfig"

const API_URL = "/users" // Asume que tienes un endpoint para usuarios

export const userService = {
  // Función para buscar usuarios por un término de búsqueda
  searchUsers: async (searchTerm) => {
    try {
      const res = await axiosInstance.get(`${API_URL}/search`, {
        params: { q: searchTerm }, // Envía el término de búsqueda como parámetro de consulta
      })
      return res.data
    } catch (error) {
      console.error("Error al buscar usuarios:", error)
      throw error
    }
  },

  // Función para obtener un usuario por su ID (útil para pre-cargar datos)
  getUserById: async (userId) => {
    try {
      const res = await axiosInstance.get(`${API_URL}/${userId}`)
      return res.data
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${userId}:`, error)
      throw error
    }
  },

  // Nueva función para obtener todos los usuarios
  getAllUsers : async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/getAllUsers`) // Asume que GET /usuarios devuelve todos
      return res.data
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error)
      throw error
    }
  },

  // Nueva función para obtener el perfil completo de un paciente (usuario + perfil asociado)
  // Esto asume que tu backend tiene un endpoint como /usuarios/{userId}/profile
  getPatientProfile: async (userId) => {
    try {
      const res = await axiosInstance.get(`${API_URL}/${userId}/profile`)
      return res.data
    } catch (error) {
      console.error(`Error al obtener el perfil del paciente con ID ${userId}:`, error)
      throw error
    }
  },
}
