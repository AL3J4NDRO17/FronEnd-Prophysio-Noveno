import React from "react";
import "./css/Error.css";
import doctorImage from "./assets/Doctora2.png"; // Imagen de la doctora
import errorIcon from "./assets/mri.png"; // Icono para el "0"

const Error400 = () => {
  return (
    <div className="error-container-400">
      <div className="error-left-400">
        <img src={doctorImage} alt="Doctora" className="doctor-image-400" />
      </div>
      <div className="error-right-400">
        <h1 className="error-code-400">
          4 <img src={errorIcon} alt="Error Icon" className="error-icon-400" /> 0
        </h1>
        <h2 className="error-title-400">¡Solicitud Incorrecta!</h2>
        <p className="error-message-400">
          Parece que hay un problema con tu solicitud. Volvamos a intentarlo.
        </p>
        <button className="error-button-400" onClick={() => window.location.href = "/"}>
          Volver al inicio
        </button>
      </div>
      <div className="error-circle-400"></div>
    </div>
  );
};

export default Error400;
