
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
