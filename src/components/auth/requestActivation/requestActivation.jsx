import React from 'react';
import { Link } from 'react-router-dom';

import "./styles/accounActivation.css"

import { ReactComponent as SvgActivation } from "./assets/undraw_arrived_3atp.svg";

const RequestActivation = ({ email = 'correo@ejemplo.com' }) => {
    const handleResendEmail = () => {
        // Lógica para reenviar el correo
       
    };

    return (
        <div className="activate-account-container">
            <div className="activate-account-card">
                <div className="activate-account-content">
                    <div className="activate-account-icon-container">
                        <SvgActivation className="activate-account-icon" />

                    </div>

                    <h1 className="activate-account-title">¡Verifica tu correo electrónico!</h1>

                    <p className="activate-account-description">
                        Hemos enviado un enlace de verificación a
                        <span className="activate-account-email">{email}</span>
                    </p>

                    <div className="activate-account-info-box">
                        <p>
                            Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta en ProPhysio.
                        </p>
                    </div>

                    <div className="activate-account-action-container">
                        <button className="activate-account-resend-button" onClick={handleResendEmail}>
                            Reenviar correo de verificación
                        </button>

                        <p className="activate-account-support-text">
                            ¿No recibiste el correo? Revisa tu carpeta de spam o
                            <button className="activate-account-support-link">contacta con soporte</button>
                        </p>
                    </div>
                </div>
            </div>

            <p className="activate-account-footer">
                ¿Volver al inicio?
                <Link to="/" className="activate-account-footer-link">
                    Ir a la página principal
                </Link>
            </p>
        </div>
    );
};

export default RequestActivation;
