const posts = [
    { id: 1, title: "Sedentarismo", description: "¿Qué es el sedentarismo?", image: "https://i.ibb.co/z1cMc6H/1.jpg", category: "rehab" },
    { id: 2, title: "Realidad Virtual En La Rehabilitacion", description: "Adentrándonos en un mundo virtual...", image: "https://i.ibb.co/230rrb87/imagen-2025-01-28-223011451.png", category: "rehab" },
    { id: 3, title: "Ejercicios Durante el Embarazo", description: "En Physiplus somos expertos en embarazo...", image: "https://i.ibb.co/xKWddP9p/imagen-2025-01-28-223121323.png", category: "kids" },
    { id: 4, title: "Estimulación temprana", description: "El aprendizaje se adapta en todas las etapas...", image: "https://i.ibb.co/Lz5MDq7Q/imagen-2025-01-28-223231639.png", category: "kids" },
    { id: 5, title: "Fisioterapia Deportiva", description: "Cómo mejorar el rendimiento deportivo...", image: "https://i.ibb.co/zHrN2XCc/imagen-2025-01-28-223329565.png", category: "rehab" },
    { id: 6, title: "Terapia Ocupacional", description: "Importancia de la terapia ocupacional...", image: "https://i.ibb.co/spn2y2cH/imagen-2025-01-28-223424661.png", category: "rehab" },
    { id: 7, title: "Ergonomía en el Trabajo", description: "Mejorando la postura en el trabajo...", image: "https://i.ibb.co/q4VypkF/imagen-2025-01-28-223459642.png", category: "tech" },
    { id: 8, title: "Neurorehabilitación", description: "Avances en neurorehabilitación...", image: "https://i.ibb.co/7dPm4GzN/imagen-2025-01-28-223535869.png", category: "rehab" },
  ];
  
  /**
   * Filtra y ordena los posts según la categoría, la búsqueda y el ordenamiento seleccionado.
   */
  export function getFilteredPosts(selectedCategory, searchQuery, sortOrder) {
    return posts
      .filter((post) => {
        // Si hay una búsqueda, filtrar por título o categoría
        const matchesSearch =
          !searchQuery ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase());
  
        // Filtrar por categoría si es diferente de "all"
        const matchesCategory =
          selectedCategory === "all" || selectedCategory === "news" || post.category === selectedCategory;
  
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === "recent") return b.id - a.id;
        if (sortOrder === "oldest") return a.id - b.id;
        if (sortOrder === "az") return a.title.localeCompare(b.title);
        if (sortOrder === "za") return b.title.localeCompare(a.title);
        return 0;
      });
  }
  
  export default posts;
  