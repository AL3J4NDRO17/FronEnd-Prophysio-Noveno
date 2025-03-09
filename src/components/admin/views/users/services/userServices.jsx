
import axiosInstance from "../../../../api/axiosConfig";
const   API_URL= `/users`

export const getUsers = async () => {
  const response = await axiosInstance.get(`${API_URL}/getAllUsers`);

  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};

export const checkSession = async () => {
  const response = await axiosInstance.get(`${API_URL}/session`, { withCredentials: true });
  return response.data;
};
