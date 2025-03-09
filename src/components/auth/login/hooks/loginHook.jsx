import { useState } from "react";
import { toast } from "react-toastify";
import { loginService } from "../services/loginService"; // Asegúrate de importar el servicio
import { useNavigate } from "react-router-dom";

export const useLoginState = (setStep, setEmail) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e, email) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginService({ email, password });

      if (!response.success) {
        toast.error(response.message || "Error desconocido."); // Mostramos el mensaje de error
        return;
      }

      toast.success(response.data.message || "Código de verificación enviado a tu correo.");
      setEmail(email);
      setStep(2); // Cambiar el paso en el flujo
    } catch (error) {
      console.error("Error inesperado al iniciar sesión:", error);
      toast.error("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    isLoading,
    handleLoginSubmit,
  };
};
