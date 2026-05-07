import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // 1. Fuerza la ventana principal (Lo normal)
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // 2. Fuerza el HTML y el Body (Por si hay estilos bloqueando)
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // 3. Busca el contenedor de la App de React y lo sube a la fuerza
        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [pathname]);

    return null;
}