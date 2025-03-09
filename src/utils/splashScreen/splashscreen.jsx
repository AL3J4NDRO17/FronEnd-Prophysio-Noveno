import React from "react";
import "./splashscreen.css"; // Asegúrate de tener el archivo CSS para el estilo
import Logo from "../../components/header/resources/LOGO-OFICIAL.jpg"

const SplashScreenView = () => {
    return (
        <div className="splash-screen-section">
            <div className="splash-screen">
                <div className="splash-content">
                    <img src={Logo} alt="Company Logo" className="splash-logo" />
                </div>
            </div>
        </div>
    );
};

export default SplashScreenView;