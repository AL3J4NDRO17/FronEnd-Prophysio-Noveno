
import './styles/hero.css';
import IMG from "./assets/image.webp" 

const HeroSection = () => {
    return (
        <section className="hero-container">
            <div className="hero">
                <img 
                    src={IMG} 
                    alt="Bienvenidos a ProPhysio" 
                    className="hero-img"
                    width="1920"
                    height="800"
                    loading="eager"
                    fetchpriority="high"
                />
                <div className="hero-content">
                    <h1>Bienvenidos a ProPhysio</h1>
                    <p className="hero-tagline">
                        "Tu cuerpo es tu compañero de vida, cuídalo, escúchalo y atiéndelo"
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
