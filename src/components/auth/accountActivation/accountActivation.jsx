import React, { useEffect, useState } from "react";
import useAccountVerification from "./hooks/accountActivationHook";
import "./styles/accountActivation.css";
import { CheckCircle, XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const AccountActivation = () => {
  const { status, message, verifyAccount } = useAccountVerification();
  const location = useLocation();
  const navigate = useNavigate();
  const [isActivated, setIsActivated] = useState(false); // 🔥 Nuevo estado para evitar múltiples llamadas

  useEffect(() => {
    if (isActivated) return; // 🔥 Evita que se ejecute más de una vez

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      verifyAccount(token);
      setIsActivated(true); // 🔥 Marcar como activado para no ejecutar de nuevo
    } else {
      console.error("Token de activación no proporcionado.");
    }
  }, [isActivated, location, verifyAccount]);

  useEffect(() => {
    if (status === "success") {
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [status, navigate]);

  return (
    <div className="account-verification-container">
      <div className="account-verification-card">
        <div className="account-verification-status-icon">
          {status === "loading" && (
            <div className="account-verification-loading-container">
              <div className="account-verification-loading-circle" />
              <div className="account-verification-loading-spinner" />
            </div>
          )}
          {status === "success" && (
            <CheckCircle size={60} className="account-verification-success-icon" />
          )}
          {status === "error" && (
            <XCircle size={60} className="account-verification-error-icon" />
          )}
        </div>

        <h1 className="account-verification-title">
          {status === "loading" && "Activando tu cuenta..."}
          {status === "success" && "¡Cuenta activada con éxito!"}
          {status === "error" && "Error al activar la cuenta"}
        </h1>

        <p className="account-verification-message">{message}</p>

        {status === "error" && (
          <button
            className="account-verification-support-button"
            onClick={() => navigate("/contact")}
          >
            Contactar soporte
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountActivation;
