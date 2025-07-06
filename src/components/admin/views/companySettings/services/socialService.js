import axiosInstance from "@/components/api/axiosConfig"
const API_URL = "/companie"

export const getSocialLinks = async (companyId) => {
  const response = await axiosInstance.get(`${API_URL}/getAllSocialLink/${companyId}`)
  return response.data
}

export const createSocialLink = async (socialData) => {
  const response = await axiosInstance.post(`${API_URL}/createSocialLink`, socialData)
  return response.data
}

export const updateSocialLink = async (socialId, socialData) => {
  const response = await axiosInstance.put(`${API_URL}/updateSocialLink/${socialId}`, socialData)
  return response.data
}

export const deleteSocialLink = async (socialId) => {
  const response = await axiosInstance.delete(`${API_URL}/deleteSocialLink/${socialId}`)
  return response.data
}
