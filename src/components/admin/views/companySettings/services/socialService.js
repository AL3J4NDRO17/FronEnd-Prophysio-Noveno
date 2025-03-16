import axiosInstance from "../../../../api/axiosConfig";
const API_URL = "social-links"; // Ajusta la URL según tu backend

// ✅ Obtener redes sociales por empresa
export const getSocialLinks = async (companyId) => {
  const response = await axiosInstance.get(`${API_URL}/${companyId}`);
  return response.data;
};

// ✅ Crear una nueva red social
export const createSocialLink = async (socialData) => {
  const response = await axiosInstance.post(`${API_URL}/`, socialData);
  return response.data;
};

// ✅ Eliminar una red social
export const deleteSocialLink = async (socialId) => {
  const response = await axiosInstance.delete(`${API_URL}/${socialId}`);
  return response.data;
};
