import { useState, useEffect } from "react";
export const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);  // Mostrar splash de inicio
  
  useEffect(() => {
    // Simulamos un tiempo de carga inicial para el splash
    const timer = setTimeout(() => setShowSplash(false), 1400); // Ocultar el splash después de 2 segundos
    return () => clearTimeout(timer);
  }, []); 

  return showSplash;
};
