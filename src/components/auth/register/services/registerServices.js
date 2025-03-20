import axiosInstance from "@/components/api/axiosConfig";

export const registerService = async (userData) => {
    console.log(userData)
    const response = await axiosInstance.post('auth/register', userData);
   
    return response.data;
};
