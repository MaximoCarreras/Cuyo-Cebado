import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Esto fuerza al navegador a ir a la coordenada 0,0 (arriba de todo)
        window.scrollTo(0, 0);
    }, [pathname]); // Se ejecuta cada vez que cambia la ruta (pathname)

    return null;
}