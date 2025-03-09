import React, { useState } from "react";
import useRegister from "../hooks/registerState";
import "../styles/registerForm.css";
import IMG from "../assets/usuario.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6"; // 🔥 Iconos para mostrar/ocultar contraseña
import ReCAPTCHA from "react-google-recaptcha"; // 🔥 reCAPTCHA para seguridad

const SITE_KEY = "6LdFN18qAAAAAB5WT437-hRS9w4jTFRoGKjIdIBe"; // 🔥 Reemplaza con tu clave pública de Google reCAPTCHA

const RegisterForm = () => {
  const {
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
    errors, // 🔥 Capturar errores de validación
    handleRegisterSubmit,
  } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-icon-section">
          <img src={IMG} alt="ProPhysio registro" className="signup-icon-img" />
          <h1 className="signup-brand-title">Crear cuenta en ProPhysio</h1>
          <p className="signup-brand-subtitle">Tu cuerpo es tu compañero de vida</p>
        </div>

        <div className="signup-card-header">
          <h2 className="signup-card-title">Registro</h2>
          <p className="signup-card-description">Completa tus datos para crear una cuenta</p>
        </div>

        <form onSubmit={handleRegisterSubmit}>
          <div className="signup-form-group">
            <label htmlFor="username" className="signup-form-label">Nombre completo</label>
            <input
              id="username"
              type="text"
              className="signup-form-input"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setnombre(e.target.value)}
            />
            
          </div>

          <div className="signup-form-group">
            <label htmlFor="email" className="signup-form-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="signup-form-input"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
        
          </div>

          <div className="signup-form-group">
            <label htmlFor="password" className="signup-form-label">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="signup-form-input"
                value={password}
                placeholder="Mínimo 8 caracteres, una mayúscula y un número"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
           
          </div>

          <div className="signup-form-group">
            <label htmlFor="confirmPassword" className="signup-form-label">Confirmar contraseña</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                className="signup-form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
           
          </div>

          {/* Captcha */}
          <div className="captcha-form-group">
            <ReCAPTCHA sitekey="6LdFN18qAAAAAB5WT437-hRS9w4jTFRoGKjIdIBe" onChange={(value) => setCaptchaValue(value)} />
            {errors.captcha && <p className="error-text">{errors.captcha}</p>}
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Crear cuenta"}
          </button>

          <div className="signup-link">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
