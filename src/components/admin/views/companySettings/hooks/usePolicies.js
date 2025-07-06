import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createOrUpdatePolicy, getPolicyByCompany, deletePolicy } from "../services/policyService"
import { toast } from "react-toastify"

export const usePolicy = (companyId) => {
  const queryClient = useQueryClient()

  const {
    data: policy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["policy", companyId],
    queryFn: async () => {
      try {
        const data = await getPolicyByCompany(companyId)
        return data
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return null
        }
        throw err
      }
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })

  const createOrUpdateMutation = useMutation({
    mutationFn: createOrUpdatePolicy,
    onSuccess: (data) => {
      queryClient.setQueryData(["policy", companyId], data)
      toast.success("Políticas guardadas correctamente.")
    },
    onError: (err) => {
      toast.error("Error al guardar las políticas.")
      console.error("Error en createOrUpdatePolicy:", err)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePolicy,
    onSuccess: () => {
      queryClient.setQueryData(["policy", companyId], null)
      toast.success("Políticas eliminadas correctamente.")
    },
    onError: (err) => {
      toast.error("Error al eliminar las políticas.")
      console.error("Error en deletePolicy:", err)
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
