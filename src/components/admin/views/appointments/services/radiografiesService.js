import axiosInstance from "@/components/api/axiosConfig"
import { toast } from "react-toastify"

const API_URL = "citas" // Ajusta esta URL a tu endpoint de backend

export const radiografiaService = {

    getRadiografiasByPerfil: async (idPerfil) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/getRadiografies/${idPerfil}`)
            return response.data.radiografias || []
        } catch (error) {
            console.error("Error al obtener radiografías:", error)
            const errorMessage = error.response?.data?.error || "Error al obtener las radiografías."
            toast.error(errorMessage)
            throw new Error(errorMessage)
        }
    },
}
