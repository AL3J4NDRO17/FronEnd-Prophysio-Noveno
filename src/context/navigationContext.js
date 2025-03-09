import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth(); // Escuchar el usuario autenticado
    const navigateRef = useRef(navigate); // ✅ Usamos useRef para evitar renders innecesarios

    // 🔥 Solución: Solo actualizar navigate si realmente cambió
    useEffect(() => {
        if (navigateRef.current !== navigate && isAuthenticated) {
           
            navigateRef.current = navigate;
        }
    }, [navigate, isAuthenticated]); // ✅ Se ejecuta solo cuando `navigate` cambia

    return (
        <NavigationContext.Provider value={{ navigate: navigateRef.current, user }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    return useContext(NavigationContext);
};
