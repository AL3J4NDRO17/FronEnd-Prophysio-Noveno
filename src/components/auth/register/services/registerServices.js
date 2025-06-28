import axiosInstance from "@/components/api/axiosConfig";

export const registerService = async (userData) => {
   
    const response = await axiosInstance.post('auth/register', userData);

    return response.data;
};

export const getAllPreguntasSecretasService = async () => {
    const response = await axiosInstance.get('public/getAllPreguntasSecretas');
    return response.data;
}
