import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./AppRoutes";
import { queryClient } from "./utils/queryclient/queryclient.js";
import { AuthProvider } from "./context/authContext";
import Header from "./components/header/header";
import Footer from "./components/footer/footer.jsx";
import React from "react";
import "./App.css"
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 🚀 MEMORIZAMOS HEADER Y FOOTER PARA EVITAR RENDERIZADOS INNECESARIOS
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);

function App() {
  const location = useLocation();
  const hideHeaderRoutes = [
    "/admin",
    "/admin/adminUser",
    "/admin/adminDashboard",
    "/admin/blogEditor",
    "/admin/adminTestimonials",
    "/admin/adminCompanySettings",
    "/maintenance",
    "/admin/adminBlogEditor",
     "/admin/adminAppointments",
     "/admin/pruebaaa"



  ];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);
  const shouldShowFooter = shouldShowHeader; // 🔥 También ocultamos el Footer
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={2500} // Tiempo moderado para no ser molesto
            hideProgressBar={true} // Se ve más limpio
            newestOnTop={true} // Las notificaciones recientes van arriba
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false} // Sigue el conteo aunque el usuario cambie de pestaña
            draggable={true} // Permite moverlas
            pauseOnHover={false} // No pausa al pasar el mouse (para no retrasarlas)
            theme="dark" // Se ve mejor en interfaces modernas
            limit={3} // Máximo 3 toasts visibles a la vez
          />

          {shouldShowHeader && <MemoizedHeader />}
          <main>
            <DndProvider backend={HTML5Backend}>
              <AppRoutes />
            </DndProvider>
          </main>
          {shouldShowFooter && <MemoizedFooter />}

        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Root;
