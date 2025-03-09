import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createOrUpdatePolicy, getPolicyByCompany, deletePolicy } from "../services/policyService"

export const usePolicy = (companyId) => {
  const queryClient = useQueryClient()

  // ✅ Obtener políticas de una empresa
  const {
    data: policy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["policy", companyId],
    queryFn: () => getPolicyByCompany(companyId),
    enabled: !!companyId, // Solo ejecuta la consulta si hay un companyId
  })

  // ✅ Crear o actualizar políticas
  const createOrUpdateMutation = useMutation({
    mutationFn: createOrUpdatePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["policy", companyId]) // Refresca los datos después de actualizar
    },
  })

  // ✅ Eliminar políticas
  const deleteMutation = useMutation({
    mutationFn: deletePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["policy", companyId]) // Refresca después de eliminar
    },
  })

  return {
    policy,
    isLoading,
    error,
    createOrUpdatePolicy: createOrUpdateMutation.mutate,
    deletePolicy: deleteMutation.mutate,
  }
}

