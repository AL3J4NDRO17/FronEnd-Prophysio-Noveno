import React from "react";
import "./css/Error500.css";
import doctorImage from "./assets/Doctora4.png"; // Imagen de la doctora
import errorIcon from "./assets/5.png"; // Icono para el "0"

const Error500 = () => {
  return (
    <div className="error-container-500">
      <div className="error-left">
        <img src={doctorImage} alt="Doctora" className="doctor-image-500" />
      </div>
      <div className="error-right-500">
        <h1 className="error-code-500">
          <img src={errorIcon} alt="Error Icon" className="error-icon-500" /> 00
        </h1>
        <h2 className="error-title-500">Incluso los mejores sistemas necesitan 
        un descanso</h2>
        <p className="error-message-500">
        Estamos trabajando para solucionar el problema. Regresa pronto.
        </p>
        <button className="error-button-500" onClick={() => window.location.href = "/"}>
          Volver al inicio
        </button>
      </div>
      <div className="error-circle-500"></div>
    </div>
  );
};

export default Error500;
