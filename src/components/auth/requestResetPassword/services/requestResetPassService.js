import axiosInstance from "@/components/api/axiosConfig";
const API_URL = "public";

// 🔹 1️⃣ Solicitar código de recuperación por correo
export const solicitarCodigoRecuperacion = async (email) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/requestRecoverPass`, { email });
    return response.data;
  } catch (error) {
    console.error("❌ Error al solicitar código de recuperación:", error);
    throw error;
  }
};

export const verificarCodigoRecuperacion = async (email,code) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/verifyCode`, {email, code });
      return response.data;
    } catch (error) {
      console.error("❌ Error al verificar codigo:", error);
      throw error;
    }
  };

export const solicitarPreguntaSecreta = async (email) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/requestSecretQuestion`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
// 🔹 2️⃣ Restablecer contraseña con código OTP
export const restablecerPasswordConCodigo = async (email, code, nuevaPassword) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/SetRecoverPass`, { email, code, nuevaPassword });
    return response.data;
  } catch (error) {
    console.error("❌ Error al restablecer la contraseña:", error);
    throw error;
  }
};

// 🔹 3️⃣ Verificar pregunta secreta y generar código de recuperación
export const verificarPreguntaSecreta = async (email, respuesta) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/requestRecoverByQuestion`, { email, respuesta });
    return response.data;
  } catch (error) {
    console.error("❌ Error al verificar pregunta secreta:", error);
    throw error;
  }
};
