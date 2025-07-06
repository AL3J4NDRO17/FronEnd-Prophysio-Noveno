import axiosInstance from "@/components/api/axiosConfig"

const API_URL="horarios"

export const horarioService = {
  getHorariosClinica: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/getAllHorarios`)
      return response.data
    } catch (error) {
      console.error("Error fetching clinic hours:", error)
      throw error
    }
  },

  updateClinicHours: async (hoursData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/updateHorarios`, { horarios: hoursData })
      return response.data
    } catch (error) {
      console.error("Error updating clinic hours:", error)
      throw error
    }
  },
}
