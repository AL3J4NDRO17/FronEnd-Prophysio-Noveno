import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

// 🛠️ Ahora `handleGlobalError` se pasa como parámetro
export const setupInterceptors = (handleGlobalError) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      handleGlobalError(error); // 🔥 Manejar error de conexión o servidor
      return Promise.reject(error);
    }
  );
};


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.warn("⚠️ Error de API oculto:", error.response?.data?.message || "Error desconocido.");
        return Promise.reject(error);
    }
);


export default axiosInstance;
