import axiosInstance from "@axiosInstance"

const APIURL = "perfil" // Ruta base de la API

const perfilUsuarioService = {
  getAll: () => axiosInstance.get(`${APIURL}/getAllUserData`),
  getById: (id) => axiosInstance.get(`${APIURL}/userData/${id}`),
  create: (data) => axiosInstance.post(`${APIURL}`, data),
  update: (id, data) => axiosInstance.put(`${APIURL}/updateUserData/${id}`, data),
  remove: (id) => axiosInstance.delete(`${APIURL}/${id}`),
}

export default perfilUsuarioService
