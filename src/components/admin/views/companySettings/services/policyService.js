import axiosInstance from "@/components/api/axiosConfig"
const API_URL = "/companie"

export const getPolicyByCompany = async (companyId) => {
  const response = await axiosInstance.get(`${API_URL}/policies/${companyId}`)
  return response.data
}

export const createOrUpdatePolicy = async (policyData) => {
  if (policyData.policy_id) {
    const response = await axiosInstance.put(`${API_URL}/policies/${policyData.policy_id}`, policyData)
    return response.data
  } else {
    const response = await axiosInstance.post(`${API_URL}/policies`, policyData)
    return response.data
  }
}


export const deletePolicy = async (policyId) => {
  const response = await axiosInstance.delete(`${API_URL}/policies/${policyId}`)
  return response.data
}
