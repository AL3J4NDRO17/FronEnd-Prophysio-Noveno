import { useState, useEffect, useCallback } from "react";
import { fetchBlogs, fetchBlogById } from "../services/homeBlogService";

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los blogs
  useEffect(() => {
    const getBlogs = async () => {
      console.log("fectch blog")
      try {
        setIsLoading(true);
        const data = await fetchBlogs();
        console.log(data)
        setBlogs(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los blogs");
      } finally {
        setIsLoading(false);
      }
    };

    getBlogs();
  }, []);

  // Función que obtiene un blog específico por ID de manera dinámica
  const getBlogById = useCallback(
    (id) => {
      const found = blogs.find((blog) => blog.id === Number(id));
      return found || null;
    },
    [blogs]
  );

  // Función para obtener blog por ID desde API directamente si no existe en memoria
  const fetchBlogIfMissing = useCallback(
    async (id) => {
      let blog = getBlogById(id);
      if (!blog) {
        try {
          blog = await fetchBlogById(id);
          setBlogs((prevBlogs) => [...prevBlogs, blog]);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error al obtener el blog por ID");
          return null;
        }
      }
      return blog;
    },
    [getBlogById]
  );

  return { blogs, getBlogById, fetchBlogIfMissing, isLoading, error };
}
