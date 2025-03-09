import React from "react";
import "./css/404.css";
import doctorImage from "./assets/Doctora1.png"; // Imagen de la doctora
import errorIcon from "./assets/yoga-ball.png"; // Icono para el "0"

const Error404 = () => {
  return (
    <section className="error-container-404">
      <div className="error-left-404">
        <h1 className="error-code-404">
          4 <img src={errorIcon} alt="Error Icon" className="error-icon-404" /> 4
        </h1>
        <h2 className="error-title-404">¡Oops! Esta página está fuera de alineación</h2>
        <p className="error-message-404">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <button 
          className="error-button-404" 
          onClick={() => window.location.href = "/"}
        >
          Volver al inicio
        </button>
      </div>
      <div className="error-right-404">
        <img src={doctorImage} alt="Doctora" className="doctor-image-404" />
      </div>
      <div className="error-circle-404"></div>
    </section>
  );
};

export default Error404;
