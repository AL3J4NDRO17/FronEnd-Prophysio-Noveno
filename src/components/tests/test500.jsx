// src/components/TestApiError.jsx
import React, { useEffect } from 'react';
import axios from '../api/axiosConfig'; // Importar la instancia de Axios configurada

const TestApiError = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Utiliza un endpoint que devuelva un error 500
                // httpstat.us/500 devuelve una respuesta con código 500
                await axios.get('https://httpstat.us/500');
            } catch (error) {
                // El error ya es manejado por el interceptor de Axios
                console.error("Error en la solicitud:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Prueba de Error 500</h2>
            <p>Este componente realiza una solicitud a un endpoint que devuelve un error 500.</p>
        </div>
    );
};

export default TestApiError;
