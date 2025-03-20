import axiosInstance from "@/components/api/axiosConfig";


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
export const uploadLogo = async (companyId, file) => {
   
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", companyId);

    const response = await axiosInstance.post(`${API_URL}/uploadLogo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

// 📌 Obtener historial de logos de la empresa
export const getCompanyLogos = async (companyId) => {
    const response = await axiosInstance.get(`${API_URL}/getCompanyLogos/${companyId}`);
    
    return response.data;
};

// 📌 Establecer un logo del historial como actual
export const setCurrentLogo = async (companyId, logoUrl) => {
    const response = await axiosInstance.post(`${API_URL}/set-current-logo`, { companyId, logoUrl });
    return response.data;
};