import "./about.css"
import collageImg1 from "./assets/collageImg1.jpeg"
import collageImg2 from "./assets/collageImg2.jpg"
import collageImg3 from "./assets/collageImg3.jpg"
import MVSectionImg from "./assets/MyVSectionImg.jpg"

export default function AboutClinic() {
    return (
        <div className="meet-us-container">
            <div className="about-header">
                <h1 className="meet-us-title">CONOCENOS</h1>

                <div className="therapy-gallery">
                    <img
                        src={collageImg1}
                        alt="Terapia física con paciente"
                        className="therapy-image therapy-left"
                    />
                    <img
                        src={collageImg2}
                        alt="Sesión de rehabilitación"
                        className="therapy-image therapy-center"
                    />
                    <img
                        src={collageImg3}
                        alt="Ejercicios terapéuticos"
                        className="therapy-image therapy-right"
                    />
                </div>
            </div>

            <div className="clinic-info">
                <div className="mission-section">
                    <h2 className="mission-title">MISION</h2>
                    <p className="mission-text">
                        Contribuir en la salud y bienestar de la población infantil, adulta y adulta mayor, poniendo a su
                        disposición servicios de calidad a través de diversos métodos y técnicas de intervención de fisioterapia
                        reconociendo el valor y dignidad de cada paciente.
                    </p>
                </div>

                <div className="vision-wrapper">
                    <div className="vision-content">
                        <img
                            src={MVSectionImg}
                            alt="Profesional de fisioterapia"
                            className="vision-image"
                        />
                        <div className="vision-section">
                            <h2 className="vision-title">VISION</h2>
                            <p className="vision-text">
                                Ser una clínica de fisioterapia reconocida por su constante capacitación y actualización en los temas
                                relacionados en rehabilitación y bienestar para sus pacientes y trabajadores con enfoque personalista.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="values-container">
                <h2 className="values-title">VALORES</h2>
                <div className="values-grid">
                    <div className="value-item">
                        <div className="value-icon responsibility-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="value-name">RESPONSABILIDAD</h3>
                    </div>

                    <div className="value-item">
                        <div className="value-icon respect-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                            </svg>
                        </div>
                        <h3 className="value-name">RESPETO</h3>
                    </div>

                    <div className="value-item">
                        <div className="value-icon equality-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                                <path d="M16 3.13a4 4 0 010 7.75" />
                            </svg>
                        </div>
                        <h3 className="value-name">IGUALDAD</h3>
                    </div>

                    <div className="value-item">
                        <div className="value-icon honesty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                        </div>
                        <h3 className="value-name">HONESTIDAD</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

