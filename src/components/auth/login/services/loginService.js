import axiosInstance from "../../../api/axiosConfig";
import { queryClient } from "../../../../utils/queryclient/queryclient";

// Servicio para hacer login
export const loginService = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials, { withCredentials: true });

    if (!response || !response.data) {
      throw new Error("Respuesta inválida del servidor.");
    }

    return { success: true, data: response.data }; // Si el login fue exitoso
  } catch (error) {
    // Si el error viene del backend, obtenemos el mensaje del servidor
    if (error.response && error.response.data) {
      return { success: false, message: error.response.data.message || "Error al iniciar sesión." };
    }

    // Si no hay respuesta del servidor, retornamos un error genérico
    return { success: false, message: "No se pudo conectar con el servidor. Intenta más tarde." };
  }
};

export const verifyOtpService = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/verifyLogin", data, {
      withCredentials: true, // 🔥 Enviar cookies de sesión
    });

    if (!response || !response.data) {
      throw new Error("Respuesta inválida del servidor.");
    }

    if (response.data.status !== "success") {
      return { success: false, message: response.data.message || "Código OTP inválido." };
    }

    // 🔥 Refrescar el usuario autenticado en React Query
    await queryClient.invalidateQueries(["authUser"]);
    await queryClient.invalidateQueries(["sessionStatus"]); // 🔥 🔥 Forzar actualización de sesión

    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error al verificar OTP:", error);

    // Si el error viene del backend, obtenemos el mensaje del servidor
    if (error.response && error.response.data) {
      return { success: false, message: error.response.data.message || "Error al verificar OTP." };
    }

    // Si no hay respuesta del servidor, retornamos un error genérico
    return { success: false, message: "No se pudo conectar con el servidor. Intenta más tarde." };
  }
};

export const resendOtpService = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/resendOtp", data, {
      withCredentials: true, // 🔥 Enviar cookies de sesión
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error al reenviar OTP:", error);

    // Si el error viene del backend, obtenemos el mensaje del servidor
    if (error.response && error.response.data) {
      return { success: false, message: error.response.data.message || "Error al reenviar OTP." };
    }

    // Si no hay respuesta del servidor, retornamos un error genérico
    return { success: false, message: "No se pudo conectar con el servidor. Intenta más tarde." };
  }
};
