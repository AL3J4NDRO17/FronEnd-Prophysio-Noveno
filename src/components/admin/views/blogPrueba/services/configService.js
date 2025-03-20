// services/categoryService.js

import axiosInstance from "@/components/api/axiosConfig";
const API_URL = '/categoria';  // Asegúrate de que esta URL esté bien configurada

export const getCategories = async () => {
  const { data } = await axiosInstance.get(`${API_URL}/getAllCategoria`);
  return data;
};

export const createCategory = async (name) => {
  const { data } = await axiosInstance.post(`${API_URL}/createCategoria`, { nombre: name });
  return data;
};

export const updateCategory = async (id, newName) => {
  const { data } = await axiosInstance.put(`${API_URL}/updateCategoria/${id}`, { nombre: newName });
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await axiosInstance.delete(`${API_URL}/deleteCategoria/${id}`);

  return data;
};
