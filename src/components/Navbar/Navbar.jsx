/**
 * Navbar — Barra de navegación fija para Cuyo Cebado.
 * Se eliminó el botón redundante de WhatsApp.
 * Preparado para mostrar el logo en imagen.
 */
import { useState, useEffect } from 'react';
// IMPORTANTE: Asegurate de tener tu logo guardado como logo.png en src/assets/
import logo from '../../assets/logo.png'; 
import './Navbar.css';

export default function Navbar() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* Detectar scroll para el modo compacto */
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Enlaces de navegación actualizados a las secciones del sitio */
  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Productos', href: '#productos' },
    { label: 'Nosotros', href: '#nuestra-historia' },
    { label: 'Preguntas', href: '#faq' },
  ];

  return (
    <nav className={`navbar ${isCompact ? 'navbar--compact' : ''}`} id="navbar">
      
      {/* 
        LOGOTIPO COMO IMAGEN 
        Si aún no tenés la imagen en assets, podés comentar la etiqueta <img> 
        y descomentar el texto "Cuyo Cebado" hasta que la tengas.
      */}
      <a href="#hero" className="navbar__logo">
        <img 
          src={logo} 
          alt="Cuyo Cebado Logo" 
          style={{ height: '40px', width: 'auto' }} /* Controla que no se vea gigante */
        />
        {/* Cuyo Cebado */} 
      </a>

      {/* Menú hamburguesa para dispositivos móviles */}
      <button
        className="navbar__toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">
          {isMobileOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Lista de enlaces centrada (sin el botón de WhatsApp a la derecha) */}
      <ul className={`navbar__links ${isMobileOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* EL BOTÓN DE WHATSAPP FUE ELIMINADO DE ESTA SECCIÓN */}

    </nav>
  );
}
