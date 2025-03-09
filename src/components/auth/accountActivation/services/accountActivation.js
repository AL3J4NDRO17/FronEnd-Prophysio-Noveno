import axiosInstance from "../../../api/axiosConfig";

export const verifyAccountService = async (token) => {
  const response = await axiosInstance.post('/auth/activate', { token });
  return response.data;
};
