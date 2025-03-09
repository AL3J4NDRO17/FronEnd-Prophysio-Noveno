import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/api/axiosConfig"
// 🔥 Crear el contexto
const ErrorContext = createContext(null);

// 🔥 Hook personalizado para usar el contexto
export const useGlobalError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useGlobalError debe ser usado dentro de un <ErrorProvider>");
  }
  return context;
};

// 🔄 Función para verificar si el servidor está en línea
const checkServerStatus = async () => {
  try {
    const response = await axiosInstance.get("/test"); // Ruta de salud del backend
    if (response.status === 200) {
      console.log("✅ Servidor detectado en línea");
      return true;
    }
  } catch (err) {
    console.log("❌ El servidor sigue caído");
    return false;
  }
};

// 🔥 Proveedor del contexto
export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [isServerDown, setIsServerDown] = useState(false);
  const navigate = useNavigate();

  // 🛠️ Función para manejar errores globales
  const handleGlobalError = (error) => {
    if (!error.response) {
      console.error("🚨 Error de conexión detectado:", error.message);
      
      if (error.message.includes("ERR_CONNECTION_REFUSED") || error.message.includes("Network Error")) { 
        console.log("⚠️ Servidor caído, redirigiendo a /maintenance...");
        setIsServerDown(true);
        setError("El servidor está en mantenimiento.");
        navigate("/maintenance");
      }
      return;
    }

    if (error.response.status === 500) {
      console.error("🔥 Error 500 en el servidor");
      setError("Error interno del servidor.");
      navigate("/error500");
    }
  };

  // 🔄 Verificar si el servidor vuelve a estar en línea cada 5 segundos
  useEffect(() => {
    if (isServerDown) {
      const interval = setInterval(async () => {
        const serverOnline = await checkServerStatus();
        if (serverOnline) {
          console.log("✅ Servidor restaurado, redirigiendo a Home...");
          setIsServerDown(false);
          setError(null);
          
          navigate("/");
          window.location.reload()
          clearInterval(interval); // 🔥 Detener el intervalo cuando el servidor vuelva
        }
      }, 5000);

      return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }
  }, [isServerDown, navigate]);

  return (
    <ErrorContext.Provider value={{ error, setError, handleGlobalError }}>
      {children}
    </ErrorContext.Provider>
  );
};
