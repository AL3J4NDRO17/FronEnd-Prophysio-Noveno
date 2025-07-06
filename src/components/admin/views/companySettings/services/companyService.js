import axiosInstance from "@/components/api/axiosConfig"

const API_URL = "/companie"

export const getCompanyById = async (companyId) => {
  const response = await axiosInstance.get(`${API_URL}/getByIdCompanies/${companyId}`)
  return response.data
}

export const updateDataCompany = async (companyId, companyData) => {
  const response = await axiosInstance.put(`${API_URL}/updateCompanies/${companyId}`, companyData)
  return response.data
}

export const createCompany = async (companyData) => {
  const response = await axiosInstance.post(`${API_URL}/createCompanie`, companyData)
  return response.data
}

export const getallCompanies = async () => {
  const response = await axiosInstance.get(`${API_URL}/getAllCompanies`)
  return response.data
}

export const uploadLogo = async (companyId, file) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("company_id", companyId)

  const response = await axiosInstance.post(`${API_URL}/uploadLogo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return response.data
}

export const getCompanyLogos = async (companyId) => {
  const response = await axiosInstance.get(`${API_URL}/getCompanyLogos/${companyId}`)
  return response.data
}

export const setCurrentLogo = async (companyId, logo) => {
  const response = await axiosInstance.post(`${API_URL}/setCurrentLogo`, { companyId, logo })
  return response.data
}

export const deleteCompanyLogo = async (companyId, publicId) => {
  const response = await axiosInstance.post(`${API_URL}/deleteLogo`, { companyId, publicId })
  return response.data
}
