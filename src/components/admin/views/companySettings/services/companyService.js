import axiosInstance from "../../../../api/axiosConfig"


const API_URL = "companie"; // Ajusta la URL según tu backend

export const getCompanyById = async (companyId) => {

    const response = await axiosInstance.get(`${API_URL}/getByIdCompanies/${companyId}`);
    console.log(response)
    return response.data;
};

export const updateDataCompany = async (companyId, companyData) => {
    console.log(companyId,companyData)
    const response = await axiosInstance.put(`${API_URL}/updateCompanies/${companyId}`, companyData);
 
    return response.data;
};

export const createCompany = async (companyData) => {
    const response = await axiosInstance.post(`${API_URL}/createCompanie`, companyData);
    return response.data;
};
export const getallCompanies = async () => {
    const response = await axiosInstance.get(`${API_URL}/getAllCompanies`);
    console.log(response.data)
    return response.data;
};