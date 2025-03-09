import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SlideInLeft = ({ children }) => {
  const { ref, inView, entry } = useInView({
    threshold: 0.2, // Se activa cuando el 20% del componente es visible
    triggerOnce: false,
  });

  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + 5) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY - 5) {
        setScrollDirection("up");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAlmostInvisible = entry && entry.intersectionRatio < 0.2;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -70 }} // Comienza desplazado desde la IZQUIERDA
      animate={
        inView
          ? { opacity: 1, x: 0 } // Cuando está en vista, se muestra
          : scrollDirection === "down" && isAlmostInvisible
          ? { opacity: 0, x: -70 } // Se oculta moviéndose hacia la izquierda si se hace scroll hacia abajo
          : { opacity: 1, x: 0 }
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInLeft;
