import axiosInstance from "@/components/api/axiosConfig";

const API_URL = "/perfil"

export const getPerfilUsuario = async (userId) => {
  const res = await axiosInstance.get(`${API_URL}/userData/${userId}`)
  return res.data
}

export const crearPerfilUsuario = async (data) => {
  const res = await axiosInstance.post(`${API_URL}`, data)
  return res.data
}

export const actualizarPerfilUsuario = async (idPerfil, data) => {
  const res = await axiosInstance.put(`${API_URL}/updateUserData/${idPerfil}`, data)
  return res.data
}


