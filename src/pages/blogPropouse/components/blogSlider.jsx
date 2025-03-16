"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../styles/blogSlider.css";
import IMG1 from "../assets/IMG_2044.jpeg"
import IMG2 from "../assets/Prophysio 62.jpg"
import IMG3 from "../assets/Prophysio 66.jpg"
const slides = [
  {
    id: 1,
    title: "Salud",
    description: "Descubre como la salud y la tecnología se unen para mejorar la calidad de vida.",
    image: IMG1,
  },
  {
    id: 2,
    title: "Rehabilitacion",
    description: "Explora las nuevas tecnologías en rehabilitación y fisioterapia.",
    image: IMG2,
  },
  {
    id: 3,
    title: "Ejercicio",
    description: "Ejercitate de forma segura y eficiente",
    image: IMG3,
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  arrows: false,
};

export default function BlogSlider() {
  return (
    <section className="blog-slider-section">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="blog-slider--slide">
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="overlay">
              <div className="blog-slider--content">
                <h1 className="blog-slider--title">{slide.title}</h1>
                <p className="blog-slider--description">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
