import { Navigate, Outlet } from "react-router-dom";

import { useGlobalError } from "../context/errorContext"; 
import { useAuth } from "../context/authContext"; // 🔥 Importar useAuth para acceder a `isLoading`


const ProtectedRoute = ({ allowedRoles, children }) => {
  const { setError } = useGlobalError();
  const { user,  isLoading } = useAuth(); // ✅ Ahora verificamos `isLoading`

  if (isLoading) {
   
    return null; // 🔥 No renderiza nada hasta que termine la carga
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.redirectTo) return <Navigate to={user.redirectTo} replace />;

  if (!user?.rol) {
    
    return <Navigate to="/error403" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    setError("Acceso denegado.");
    return <Navigate to="/error403" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
