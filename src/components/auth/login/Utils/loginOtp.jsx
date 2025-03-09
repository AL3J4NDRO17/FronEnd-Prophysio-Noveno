import React from "react";
import { useOTP } from "../hooks/otpHook";
import "../styles/loginOtp.css";

const LoginOtp = ({ email }) => {
  const {
    otp,
    handleChange,
    handlePaste,
    handleKeyDown,
    handleVerify, // 🔥 Renombrado para coincidir con `otpHook.jsx`
    handleResend,
    isLoading, // 🔥 Unificamos `isVerifying` y `isResending`
    errorMessage
  } = useOTP(email);

  return (
    <div className="otp-container">
      <div className="otp-header">
        <h2 className="otp-title">Verificar código</h2>
        <p className="otp-subtitle">Ingresa el código de 6 dígitos enviado a tu correo.</p>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="otp-input-group">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-input"
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={isLoading}
          />
        ))}
      </div>

      <button
        className="otp-verify-button"
        onClick={handleVerify} // 🔥 Asegurar que usa `handleVerify`
        disabled={isLoading || otp.join("").length !== 6}
      >
        {isLoading ? "Verificando..." : "Verificar código"}
      </button>

      <button className="otp-resend-button" onClick={handleResend} disabled={isLoading}>
        {isLoading ? "Reenviando..." : "Reenviar código"}
      </button>
    </div>
  );
};

export default LoginOtp;
