import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FadeInSection = ({ children }) => {
  const { ref, inView, entry } = useInView({
    threshold: 0.2, // 10% de visibilidad
    triggerOnce: false,
  });

  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + 5) {
        // Scroll hacia abajo
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY - 5) {
        // Scroll hacia arriba
        setScrollDirection("up");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Define un umbral personalizado para ocultar el componente
  const isAlmostInvisible = entry && entry.intersectionRatio < 0.2;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 70 }} // Comienza oculto y desplazado hacia abajo
      animate={
        inView
          ? { opacity: 1, y: 0 } // Cuando está en vista, se muestra
          : scrollDirection === "down" && isAlmostInvisible
          ? { opacity: 0, y: 70 } // Al hacer scroll hacia abajo y casi invisible, se oculta desplazándose hacia abajo
          : { opacity: 1, y: 0 } // Si no está casi invisible, permanece visible
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
