import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);  // Mostrar splash de inicio
  const location = useLocation();

  useEffect(() => {
    // Simulamos un tiempo de carga inicial para el splash
    const timer = setTimeout(() => setShowSplash(false), 2000); // Ocultar el splash después de 2 segundos
    return () => clearTimeout(timer);
  }, []); 

  return showSplash;
};
