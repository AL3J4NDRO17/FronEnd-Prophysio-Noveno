import axiosInstance from "@/components/api/axiosConfig";
const API_URL = "companie"; // Ajusta la URL según tu backend

// ✅ Crear o actualizar políticas
export const createOrUpdatePolicy = async (policyData) => {
  const response = await axiosInstance.post(`${API_URL}/`, policyData);
  return response.data;
};

// ✅ Obtener políticas por empresa
export const getPolicyByCompany = async (companyId) => {
  const response = await axiosInstance.get(`${API_URL}/${companyId}`);
  return response.data;
};

// ✅ Eliminar políticas de una empresa
export const deletePolicy = async (companyId) => {
  const response = await axiosInstance.delete(`${API_URL}/${companyId}`);
  return response.data;
};
