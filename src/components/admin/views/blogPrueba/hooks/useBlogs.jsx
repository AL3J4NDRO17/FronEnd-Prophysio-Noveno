import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBlogs, deleteBlogService, updateBlogService, updateStatusBlogService } from "../services/blogService"; // Importa los servicios
import { toast } from "react-toastify";
import Swal from "sweetalert2";
export function useBlogs() {
  const queryClient = useQueryClient();

  // Obtener los blogs
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
    onError: () => toast.error("Error al obtener los blogs.")
  });

  // Eliminar un blog
  const deleteBlog = useMutation({
    mutationFn: async (id) => {
      const result = await Swal.fire({
        title: '¿Seguro que deseas eliminar este blog?',
        text: "No podrás revertir esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo',
      });

      if (!result.isConfirmed) return;  // Si no se confirma, no ejecutamos la eliminación

      // Si se confirma, ejecutamos la eliminación
      await deleteBlogService(id);  // Llama al servicio de eliminación
      toast.success("Blog eliminado.");  // Solo se muestra si la eliminación es exitosa
      queryClient.invalidateQueries(["blogs"]); // Refresca la lista de blogs
    },

    onError: (error) => {
      toast.error("Error al eliminar el blog: " + error.message); // Error si ocurre algún problema en el servicio
    },
  });



  // Mutación para actualizar el estado de un blog
  const updateStatusBlog = useMutation({
    mutationFn: async ({ id, status }) => {
      // Llamamos al servicio de actualización de estado
      const updatedData = { status };
      return updateStatusBlogService(id, updatedData);
    },
    onSuccess: () => {
      toast.success("Estado del blog actualizado.");
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (error) => {
      toast.error("Error al actualizar el estado del blog: " + error.message);
    },
  });

  return { blogs, isLoading, error, deleteBlog, updateStatusBlog };
}
