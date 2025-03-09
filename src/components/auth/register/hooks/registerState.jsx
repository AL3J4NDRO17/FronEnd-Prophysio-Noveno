import { useState } from "react";
import { toast } from "react-toastify";
import { registerService } from "../services/registerServices"; // Servicio para manejar el registro
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // 🔥 Importamos reCAPTCHA

const SITE_KEY = "6LdDDl0qAAAAAGQd0JluGGMC45SVseGltEUsrs-p"; // 🔥 Usa tu clave pública de Google reCAPTCHA

export default function useRegister() {
  const [nombre, setnombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validación del nombre
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido.";
    }

    // Validación del email
    if (!email.trim()) {
      newErrors.email = "El email es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Formato de email inválido.";
    }

    // Validación de la contraseña
    if (!password) {
      newErrors.password = "La contraseña es requerida.";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "La contraseña debe incluir al menos una letra mayúscula.";
    } else if (!/\d/.test(password)) {
      newErrors.password = "La contraseña debe incluir al menos un número.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "La contraseña debe incluir al menos un carácter especial.";
    }

    // Validación de confirmación de contraseña
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    // Validación de reCAPTCHA
    if (!captchaValue) {
      newErrors.captcha = "Por favor, verifica que no eres un robot.";
    }

    // Mostrar errores con toast
    if (Object.keys(newErrors).length > 0) {
      toast.error(
        <div>
          {Object.values(newErrors).map((errMsg, idx) => (
            <div key={idx}>- {errMsg}</div>
          ))}
        </div>
      );
    }

    // Actualizar estado de errores
    setErrors(newErrors);

    // Devolver `true` si no hay errores, `false` si hay errores
    return Object.keys(newErrors).length === 0;
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // ❌ No enviar datos si hay errores
  
    setIsLoading(true);
    try {
      const formData = { nombre, email, password };
      const response = await registerService(formData);
  
      toast.success("Registro exitoso. Activa tu cuenta.");
      navigate("/requestactivate", { state: { token: response.token } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Ocurrió un error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };
  

  return {
    nombre,
    setnombre,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    captchaValue,
    setCaptchaValue,
    isLoading,
    errors,
    handleRegisterSubmit,
  };
}
