import Error500 from "./Error500";
import Error404 from "./Error404";
import Error400 from "./Error400";
import MaintenancePage from "./Maintenance";

const ErrorFallback = ({ error, resetErrorBoundary }) => {

    if (error?.code === "ECONNREFUSED") {
        return <MaintenancePage />; // Muestra la página de mantenimiento
    }

    // Manejo de otros errores según el código de estado HTTP
    if (error?.response) {
        const status = error.response.status;
        if (status >= 500) return <Error500 />;
        if (status === 404) return <Error404 />;
        if (status >= 400) return <Error400 />;
    }

    return (
        <div>
            <h1>Ocurrió un error inesperado</h1>
            <p>{error?.message}</p>
            <button onClick={resetErrorBoundary}>Reintentar</button>
        </div>
    );
};

export default ErrorFallback;
