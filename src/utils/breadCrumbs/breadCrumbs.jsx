import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./breadcrumbs.css";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import {
    FaHouse,
    FaUser,
    FaRightToBracket,
    FaUserPlus,
    FaCircleInfo,
    FaLocationDot,
    FaKeybase,
    FaLock,
    FaChevronRight,
    FaArrowLeft,
    FaFileContract,
} from "react-icons/fa6";
import { useBlogs } from "../../pages/blogPropouse/hooks/useClientBlog";
import { FaFile, FaServicestack } from "react-icons/fa";

// 🔥 Definir íconos para rutas específicas
const routeIcons = {
    "/": FaHouse,
    "/login": FaRightToBracket,
    "/services": FaServicestack,
    "/register": FaUserPlus,
    "/location": FaLocationDot,
    "/about": FaCircleInfo,
    "/requestActivate": FaKeybase,
    "/activate": FaLock,
    "/users": FaUser,
    "/blog": FaFile,
    "/blog/:id": FaFileContract,
};

// 🔥 Componente dinámico para título del blog
const BlogBreadcrumb = ({ match }) => {
    const { getBlogById } = useBlogs();
    const blog = getBlogById(match.params.id);
    return blog ? blog.title : "Cargando...";
};

// 🔥 Definir las rutas para breadcrumbs
const routes = [
    { path: "/", breadcrumb: "Inicio" },
    { path: "/login", breadcrumb: "Iniciar Sesión" },
    { path: "/register", breadcrumb: "Registro" },
    { path: "/location", breadcrumb: "Contacto" },
    { path: "/services", breadcrumb: "Servicios" },
    { path: "/about", breadcrumb: "Acerca de" },
    { path: "/blog", breadcrumb: "Blog" },
    { path: "/requestActivate", breadcrumb: "Solicitud de Activación" },
    { path: "/activate", breadcrumb: "Activación de Cuenta" },
    { path: "/blog/:id", breadcrumb: BlogBreadcrumb },
];

const Breadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs(routes);
    const navigate = useNavigate();
    const location = useLocation();

    const filteredBreadcrumbs = breadcrumbs.filter(({ match }) => {
        if (match.pathname === "/") return location.pathname === "/";
        return true;
    });

    return (
        <nav className="breadcrumb-nav" aria-label="breadcrumb">
            {/* 🔥 Ocultar el botón si estamos en "/" */}
            {location.pathname !== "/" && (
                <button onClick={() => navigate(-1)} className="breadcrumb-back-button">
                    <FaArrowLeft className="breadcrumb-back-icon" />
                    Regresar
                </button>
            )}
            <ol className="breadcrumb-list">
                {filteredBreadcrumbs.map(({ match, breadcrumb }, index) => {
                    const routePath = `/${match.pathname.split("/")[1]}`;
                    const Icon = routeIcons[routePath] || FaCircleInfo;
                    const isLast = index === filteredBreadcrumbs.length - 1;

                    return (
                        <li key={match.pathname} className="breadcrumb-item">
                            {!isLast ? (
                                <>
                                    <Link to={match.pathname} className="breadcrumb-link">
                                        <Icon className="breadcrumb-icon" />
                                        <span>{breadcrumb}</span>
                                    </Link>
                                    <FaChevronRight className="breadcrumb-separator" />
                                </>
                            ) : (
                                <span className="breadcrumb-current">
                                    <Icon className="breadcrumb-icon" />
                                    <span>{breadcrumb}</span>
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
