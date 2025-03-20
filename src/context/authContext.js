import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/components/api/axiosConfig";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: sessionData, isLoading: isCheckingSession } = useQuery({
    queryKey: ["sessionStatus"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/auth/checkSession", { withCredentials: true });
        return response.data;
      } catch {
        return { isAuthenticated: false, user: null };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const user = sessionData?.user || null;
  const isAuthenticated = sessionData?.isAuthenticated || false;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.invalidateQueries(["sessionStatus"]);
      navigate("/login");
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        logout: logoutMutation.mutate,
        isLoading: isCheckingSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
