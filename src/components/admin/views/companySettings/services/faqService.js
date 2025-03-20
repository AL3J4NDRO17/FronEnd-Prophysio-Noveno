import axiosInstance from "@/components/api/axiosConfig";

const API_URL = "companie"; // Ajusta la URL según tu backend

export const getFaqs = async (companyId) => {
  const response = await axiosInstance.get(`${API_URL}/${companyId}`);
  return response.data;
};

export const createFaq = async (faqData) => {
  const response = await axiosInstance.post(API_URL, faqData);
  return response.data;
};

export const updateFaq = async (id, faqData) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, faqData);
  return response.data;
};

export const deleteFaq = async (id) => {
  await axiosInstance.delete(`${API_URL}/${id}`);
};

