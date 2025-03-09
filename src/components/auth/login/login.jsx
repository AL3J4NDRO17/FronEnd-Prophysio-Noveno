import React, { useState } from "react";
import LoginForm from "./Utils/loginForm";
import LoginOtp from "./Utils/loginOtp";
import { ReactComponent as SvgAsset2 } from "./assets/undraw_access-account_aydp.svg";
import "./styles/login.css";

export default function Login() {
  const [step, setStep] = useState(1); // 🔥 1: Login, 2: OTP
  const [email, setEmail] = useState(""); // 🔥 Ahora aseguramos que setEmail esté aquí



  return (
    <div className="login-section">
      <div className="asset-decoration">
        <SvgAsset2 height="780px"  />
      </div>

      <div className="decoration decoration-1"></div>
      <div className="decoration decoration-2"></div>

     
      {step === 1 && <LoginForm setEmail={setEmail} setStep={setStep} />} 

      {step === 2 && <LoginOtp email={email} onBackToLogin={() => setStep(1)} />}
    </div>
  );
}
