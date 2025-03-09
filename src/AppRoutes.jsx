import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NavigationProvider } from "./context/navigationContext.js";
import { AuthProvider, useAuth } from "./context/authContext.js";

import BreadCrumbs from "./utils/breadCrumbs/breadCrumbs.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { SplashScreen } from "./utils/splashScreen/splashcreen.js";
import SplashScreenView from "./utils/splashScreen/splashscreen.jsx";
import Error400 from "./pages/errorPages/Error400.jsx";
import Error404 from "./pages/errorPages/Error404.jsx";
import Error500 from "./pages/errorPages/Error500.jsx";
import ServerOfflinePage from "./pages/errorPages/Maintenance.jsx";
import LoaderPublic from "./utils/skeletons/skeleton.js";
import ScrollToTop from "./utils/animations/scrollTop.jsx";




import { ErrorProvider, useGlobalError } from "./context/errorContext.js";
import { setupInterceptors } from "./components/api/axiosConfig.js";

// 🚀 CARGA DIFERIDA DE COMPONENTES PARA MEJOR RENDIMIENTO
const Home = lazy(() => import(/* webpackPrefetch: true */ "./pages/home/home"));
const LoginPage = lazy(() => import(/* webpackPrefetch: true */ "./components/auth/login/login"));
const RegistroForm = lazy(() => import("./components/auth/register/register"));
const ContactPage = lazy(() => import("./pages/location/contactPage"));
const BlogPropuse = lazy(() => import("./pages/blogPropouse/blogPropouse.jsx"));
const ServicesSection = lazy(() => import("./pages/services/services.jsx"));
const MainAdmin = lazy(() => import("./components/admin/layout.jsx"));


const AdminDashboard = lazy(() => import("./components/admin/views/dashboard/adminDashboard.jsx"));
const PatientDatabase = lazy(() => import("./components/admin/views/users/adminUsers.jsx"));

const BlogEditor = lazy(() => import("./components/admin/views/blogPrueba/blogPage.jsx"));

const RequestActivation = lazy(() => import("./components/auth/requestActivation/requestActivation.jsx"));
const AccountActivation = lazy(() => import("./components/auth/accountActivation/accountActivation.jsx"));
const AppointmentScheduler = lazy(() => import("./components/sheduler/sheduler.jsx"));
const AdminAppointments = lazy(() => import("./components/admin/views/appointments/appointments.jsx"));


const BlogDetail = lazy(() => import("./pages/blogDetail/blogDetailPage.jsx"));
const AdminTestimonials = lazy(() => import("./components/admin/views/testimoniasEditor/testimonialsControl.jsx"));
const CompanySettings = lazy(() => import("./components/admin/views/companySettings/companySettings.jsx"));
const FaqSection = lazy(() => import("./pages/FAQ/FAQ.jsx"));
const AboutClinic = lazy(() => import("./pages/about/about.jsx"));

// 🔥 VARIANTES DE ANIMACIÓN PARA TRANSICIONES MÁS FLUIDAS
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const AdminRouteWithMotion = ({ path, element }) => (
  <Route
    path={path}
    element={
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        {element}
      </motion.div>
    }
  />
);


const AppRoutes = () => {
  const showSplash = SplashScreen();
  const location = useLocation();


  return (
    <AnimatePresence mode="wait">
      <AuthProvider>
        <NavigationProvider>
          <ErrorProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <AppContent showSplash={showSplash} location={location} />
            </ErrorBoundary>
          </ErrorProvider>
        </NavigationProvider>
      </AuthProvider>
    </AnimatePresence>
  );
};

const AppContent = ({ showSplash, location }) => {
  const { isLoading } = useAuth();
  const { handleGlobalError } = useGlobalError();

  useEffect(() => {
    setupInterceptors(handleGlobalError); // ✅ Pasamos la función como argumento
  }, [handleGlobalError]);

  if (showSplash || isLoading) {
    return <SplashScreenView key="splash" />;
  }

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key={location.pathname}
      >

        {/* <ScrollToTop />
      <BreadCrumbs /> */}
        <Suspense fallback={<LoaderPublic />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistroForm />} />
            <Route path="/location" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPropuse />} />
            <Route path="/services" element={<ServicesSection />} />
            <Route path="/requestactivate" element={<RequestActivation />} />
            <Route path="activate" element={<AccountActivation />} />

            <Route path="/blog/:id" element={<BlogDetail />} />

            <Route path="/sheduler" element={<AppointmentScheduler />} />
            <Route path="/faq" element={<FaqSection />} />
            <Route path="/about" element={<AboutClinic />} />

            <Route path="/maintenance" element={<ServerOfflinePage />} />
            <Route path="/error400" element={<Error400 />} />
            <Route path="/error500" element={<Error500 />} />

            <Route path="*" element={<Error404 />} />

            {/* 🔥 RUTAS PROTEGIDAS */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<MainAdmin />}>
                <Route index element={<AdminDashboard />} />
                <Route path="admindashboard" element={<AdminDashboard />} />

                <Route path="adminUser" element={<PatientDatabase />} />

                <Route path="adminBlogEditor" element={<BlogEditor />} />

                <Route path="adminTestimonials" element={<AdminTestimonials />} />

                <Route path="adminCompanySettings" element={<CompanySettings />} />

                <Route path="adminAppointments" element={<AdminAppointments />} />


              </Route>
            </Route>
          </Routes>

        </Suspense>
      </motion.div>
    </>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error("Error capturado:", error); // 👀 Registra el error en la consola (o en Sentry)

  return (
    <div role="alert" style={{ padding: "20px", textAlign: "center" }}>
      <h2>¡Oops! Algo salió mal 😞</h2>
      <p style={{ color: "red" }}>{error?.message || "Error desconocido"}</p>

      <button onClick={resetErrorBoundary} style={{ marginTop: "20px" }}>
        Intentar de nuevo
      </button>

      <button onClick={() => window.location.reload()} style={{ marginLeft: "10px" }}>
        Recargar página 🔄
      </button>
    </div>
  );
};

export default AppRoutes;
