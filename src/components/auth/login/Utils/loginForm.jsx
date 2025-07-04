import React, { useState } from "react";
import { Link } from "react-router-dom"
import { useLoginState } from "../hooks/loginHook";
import "../styles/loginForm.css";
import IMG from "../assets/candado.png";

import { PasswordToggleButton } from "@uiButtons";

const LoginForm = ({ onEmailSubmit, setEmail, setStep }) => { // 🔥 Agregamos setStep
    const [email, setLocalEmail] = useState("");
    const { password, setPassword, isLoading, handleLoginSubmit } = useLoginState(setStep, setEmail);

    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => setShowPassword(!showPassword)



    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmail(email); // 🔥 Asegurar que el email se actualiza en el contexto global
        await handleLoginSubmit(e, email);
    };

    return (
        <div className="login-container">
            <div className="decoration decoration-1"></div>
            <div className="decoration decoration-2"></div>



            <div className="login-card">
                <div className="icon-img-section">
                    <img
                        src={IMG}
                        alt="ProPhysio icon-img"
                        className="icon-img"
                    />
                    <h1 className="brand-title">Bienvenido a ProPhysio</h1>
                    <p className="brand-subtitle">Tu cuerpo es tu compañero de vida</p>
                </div>
                <div className="card-header">
                    <h2 className="card-title">Iniciar sesión</h2>
                    <p className="card-description">
                        Ingresa tus credenciales para acceder
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setLocalEmail(e.target.value)} // 🔥 Usamos `setLocalEmail` para actualizar
                            required
                        />
                    </div>

                    <div className="form-group">

                        <label htmlFor="password" className="form-label">
                            Contraseña
                        </label>
                        <div className="password-wrapper">
                            <input
                                id="password"     
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                 placeholder="************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <PasswordToggleButton showPassword={showPassword} togglePassword={togglePassword} />
                        </div>
                    </div>

                    <button type="submit" className="login-submit-button" disabled={isLoading}>
                        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                    <div className="register-link">
                        ¿Olvidaste tu Contraseña? <Link to="/resetPass">Restablecela</Link>
                    </div>
                    <div className="register-link">
                        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default LoginForm;
