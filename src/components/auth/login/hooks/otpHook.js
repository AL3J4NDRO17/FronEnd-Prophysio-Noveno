import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { verifyOtpService, resendOtpService } from "../services/loginService";
import { useAuth } from "../../../../context/authContext"; // 🔥 Importamos el contexto
import { useNavigate } from "react-router-dom";

export function useOTP(email) {
  const navigate = useNavigate(); // 🔥 Inicializar navegación
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setLoading, finishLoading } = useAuth(); // 🔥 Usamos el contexto de autenticación

  /**
   * Maneja la entrada de los dígitos del OTP.
   */
  const handleChange = useCallback((element, index) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    setOTP((currentOTP) => {
      const newOTP = [...currentOTP];
      newOTP[index] = value;
      return newOTP;
    });

    if (value !== "" && index < 5) {
      const nextElement = document.getElementById(`otp-${index + 1}`);
      if (nextElement) nextElement.focus();
    }
  }, []);

  /**
   * Maneja la eliminación de caracteres en OTP y retroceso.
   */
  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === "Backspace") {
        if (otp[index] === "" && index > 0) {
          const prevElement = document.getElementById(`otp-${index - 1}`);
          if (prevElement) prevElement.focus();
        }
        setOTP((currentOTP) => {
          const newOTP = [...currentOTP];
          newOTP[index] = "";
          return newOTP;
        });
      }
    },
    [otp]
  );

  /**
   * Maneja la verificación del código OTP.
   */
  const handleVerify = async () => {
    setIsLoading(true);

    try {
      const response = await verifyOtpService({ code: otp.join("") });

      if (!response.success) {
        throw response; // 🔥 Lanza el error completo si no fue exitoso
      }

      toast.success(response.data.message || "Código verificado correctamente.");

      // 🔥 Redirigir tras éxito
      navigate("/");

    } catch (error) {
   
      toast.error(error.message|| "Hubo un error al verificar el código.");

    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pastedData)) return; // Solo aceptar 6 dígitos numéricos

    setOTP(pastedData.split(""));
  }, []);

  /**
   * Maneja el reenvío del código OTP.
   */
  const handleResend = async () => {
    setIsLoading(true);
    try {
      const response = await resendOtpService({ email });
      toast.success(response.message || "Código reenviado con éxito.");
      setOTP(new Array(6).fill("")); // 🔥 Restablecer los valores del OTP
    } catch (error) {
      toast.error(error?.message || "Error al reenviar el código.");
    } finally {
      setIsLoading(false);
    }
  };

  return { otp, handleChange, handleVerify, handleResend, isLoading, handleKeyDown, handlePaste };
}
