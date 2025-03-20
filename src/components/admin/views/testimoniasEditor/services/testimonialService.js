
import axiosInstance from "@/components/api/axiosConfig"
const API_URL="testimonial"

// Get all testimonials
export const getAllTestimonials = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/getAllTestimonial`)
    return response.data
  } catch (error) {
    console.error("Error al obtener testimonios:", error)
    throw error
  }
}

// Get a single testimonial by ID
export const getTestimonialById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/getTestimonialById/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error al obtener testimonio con ID ${id}:`, error)
    throw error
  }
}

// Create a new testimonial
export const createTestimonial = async (testimonialData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/createTestimonial`, testimonialData)
    return response.data
  } catch (error) {
    console.error("Error al crear testimonio:", error)
    throw error
  }
}

// Update an existing testimonial
export const updateTestimonial = async (id, testimonialData) => {
  console.log(testimonialData, "Datos")
  try {
    const response = await axiosInstance.put(`${API_URL}/updateTestimonial/${id}`, testimonialData)
    return response.data
  } catch (error) {
    console.error(`Error al actualizar testimonio con ID ${id}:`, error)
    throw error
  }
}

// Delete a testimonial
export const deleteTestimonial = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/deleteTestimonial/${id}`)
    return true
  } catch (error) {
    console.error(`Error al eliminar testimonio con ID ${id}:`, error)
    throw error
  }
}

// Update testimonial status
export const updateTestimonialStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/updateStatusTestimonial/${id}`, { status })
    return response.data
  } catch (error) {
    console.error(`Error al actualizar estado del testimonio con ID ${id}:`, error)
    throw error
  }
}

// Get testimonial statistics
export const getTestimonialStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/testimonials/stats`)
    return response.data
  } catch (error) {
    console.error("Error al obtener estadísticas de testimonios:", error)
    throw error
  }
}

