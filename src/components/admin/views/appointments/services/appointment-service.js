import axiosInstance from "@/components/api/axiosConfig";
const API_URL= "/citas"
export const appointmentService = {
  getAllAppointments: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/getAllCitas`)
      return response.data
    } catch (error) {
      console.error("Error fetching all appointments:", error)
      throw error
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/adminCreateCita`, appointmentData)
      return response.data
    } catch (error) {
      console.error("Error creating appointment:", error)
      throw error
    }
  },

  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/citas/${id}`, appointmentData)
      return response.data
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error)
      throw error
    }
  },

  deleteAppointment: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/deleteCita/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting appointment ${id}:`, error)
      throw error
    }
  },

  cancelAppointment: async (id, reason) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/cancelarCita/${id}`, { motivo_cancelacion: reason })
      return response.data
    } catch (error) {
      console.error(`Error cancelling appointment ${id}:`, error)
      throw error
    }
  },

  postponeAppointment: async (id, newDateTime, reason) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/postergarCita/${id}`, {
        nueva_fecha_hora: newDateTime,
        motivo_postergacion: reason,
      })
      return response.data
    } catch (error) {
      console.error(`Error postponing appointment ${id}:`, error)
      throw error
    }
  },

  markAsAttended: async (id) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/markAsistio/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error marking appointment ${id} as attended:`, error)
      throw error
    }
  },

  markAsNoShow: async (id) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/markInasistencia/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error marking appointment ${id} as no-show:`, error)
      throw error
    }
  },

  getAppointmentAndUserProfile: async (appointmentId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/getPerfilPorCita/${appointmentId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching appointment and user profile for appointment ${appointmentId}:`, error)
      throw error
    }
  },
}