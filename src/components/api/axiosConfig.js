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
// 🔥 Función para obtener el token CSRF al inicio


// 🔹 Función para obtener y guardar el token CSRF
export const fetchCsrfToken = async () => {
  try {
    const response = await axiosInstance.get("/csrf-token");
    const csrfToken = response.headers["x-csrf-token"]; // 📌 Extraer el token de los headers

    if (csrfToken) {
      axiosInstance.defaults.headers.common["X-CSRF-Token"] = csrfToken; // ✅ Guardarlo en Axios
      console.log("✅ CSRF Token guardado en Axios:", csrfToken);
    } else {
      console.error("❌ No se encontró CSRF Token en los headers.");
    }
  } catch (error) {
    console.error("❌ Error obteniendo CSRF Token:", error);
  }
};


// 🔥 Obtener el token CSRF automáticamente al cargar la app
fetchCsrfToken();

// 🔹 Interceptor para asegurar que el token se envía en `POST`, `PUT`, `DELETE`
axiosInstance.interceptors.request.use(async (config) => {
  // 🔹 Si la petición es protegida y no hay token, obtenerlo antes de enviarla
  if (["POST", "PUT", "DELETE", "PATCH"].includes(config.method.toUpperCase())) {
    if (!axiosInstance.defaults.headers.common["X-CSRF-Token"]) {
      await fetchCsrfToken(); // 🔥 Obtener el token si aún no está disponible
    }
  }

  console.log("🔹 Headers antes de la petición:", config.headers);
  return config;
}, (error) => Promise.reject(error));




axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("⚠️ Error de API oculto:", error.response?.data?.message || "Error desconocido.");
    return Promise.reject(error);
  }
);


export default axiosInstance;
