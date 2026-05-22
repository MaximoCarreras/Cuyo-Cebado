import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './NotFound.css';

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Escuchador manual del mouse para un Spotlight sutil y compatible
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="boutique-404" style={{
      '--mask-x': `${mousePos.x}%`,
      '--mask-y': `${mousePos.y}%`
    }}>
      <div className="boutique-overlay"></div>
      
      <div className="boutique-content fade-in">
        <span className="boutique-tag">Interrupción</span>
        <h1 className="boutique-title">Un rincón sin cebar.</h1>
        <div className="boutique-divider"></div>
        <p className="boutique-text">
          A veces el camino se pierde, pero el ritual siempre nos guía de vuelta.<br />
          Te invitamos a reanudar la cebada en nuestra tienda principal.
        </p>
        
        <Link to="/" className="boutique-btn">
          <span>Retomar el Ritual</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}