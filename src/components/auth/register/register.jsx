import React from "react";

import RegisterForm from "./utils/registerForm";

import "./styles/register.css"

import { ReactComponent as SvgRegister } from "./assets/undraw_sign-up_z2ku.svg";




export default function Login() {
  return (
    <>

      <div className="register-section">

        <div className="asset-register">
          <SvgRegister
            height="780px" // Aquí defines la altura
             // O dejas que el ancho sea automático
          />
        </div>

        <div className="signup-decoration-decoration-1" />
        <div className="signup-decoration-decoration-2" />

        <RegisterForm />
        {/* <LoginOtp /> */}
      </div>
    </>
  );
}
