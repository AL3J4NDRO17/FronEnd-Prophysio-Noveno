import axiosInstance from "@/components/api/axiosConfig"

const API_URL = "/horarios" // Asume que tienes un endpoint para los horarios de la clínica

export const horarioService = {
  getHorariosClinica: async () => {
    const res = await axiosInstance.get(`${API_URL}/getAllHorarios`) // Ajusta este endpoint si es diferente
    return res.data
  },
}
