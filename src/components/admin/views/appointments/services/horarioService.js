import axiosInstance from "@/components/api/axiosConfig"

const API_URL_HORARIOS = "/horarios" // Endpoint para horarios

export const horarioService = {
  getHorariosClinica: async () => {
    const res = await axiosInstance.get(`${API_URL_HORARIOS}/getAllHorarios`)
    return res.data
  },
}
