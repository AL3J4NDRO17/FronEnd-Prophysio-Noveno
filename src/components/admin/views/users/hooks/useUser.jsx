import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserById, updateUser, deleteUser, checkSession } from "../services/userServices";

// Hook para obtener todos los usuarios
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutos antes de volver a buscar datos
  });
};

// Hook para obtener un usuario por ID
export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id, // Solo ejecuta la consulta si hay un ID válido
  });
};

// Hook para actualizar un usuario
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }) => updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Invalida el caché para actualizar la lista de usuarios
    },
  });
};

// Hook para eliminar un usuario
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Actualiza la lista después de eliminar un usuario
    },
  });
};

// Hook para verificar la sesión del usuario
export const useCheckSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: checkSession,
  });
};
