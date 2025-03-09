import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/configService';

export function useCategories() {
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // Cache the result for 5 minutes
  });

  // Mutation to add a category
  const addCategory = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      // Optimistically update the query data to include the new category
      queryClient.setQueryData(['categories'], (oldData) => [...oldData, newCategory]);
    },
    onError: (error) => {
      console.error('Error adding category:', error);
    },
  });

  // Mutation to update a category
  const editCategory = useMutation({
    mutationFn: updateCategory,
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(
        ['categories'],
        (oldData) =>
          oldData.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          ) // Actualiza la categoría en la caché
      );
      queryClient.invalidateQueries(['categories']); // También invalidar la caché para una nueva consulta
    },
    onError: (error) => {
      console.error('Error editing category:', error);
    },
  });


  // Mutation to delete a category
  const removeCategory = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (id) => {
      queryClient.setQueryData(
        ['categories'],
        (oldData) => oldData.filter((category) => category.id !== id) // Actualiza la caché eliminando la categoría
      );
      queryClient.invalidateQueries(['categories']); // Asegúrate de invalidar la caché para que se realice una nueva consulta
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
    },
  });

  return {
    categories,
    isLoading,
    addCategory: addCategory.mutate,
    editCategory: editCategory.mutate,
    removeCategory: removeCategory.mutate,
  };
}
