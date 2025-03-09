import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 🔥 Cachea las consultas por 5 minutos
      refetchOnWindowFocus: false, // 🔥 Evita recargas innecesarias al cambiar de pestaña
    },
  },
});
