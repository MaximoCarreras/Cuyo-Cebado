/**
 * Navbar — Barra de navegación fija para Cuyo Cebado.
 * Se eliminó el carrito para priorizar el contacto directo por WhatsApp.
 */
import { useState, useEffect } from 'react';
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
      {/* Logo de marca */}
      <a href="#hero" className="navbar__logo">Cuyo Cebado</a>

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

      {/* Lista de enlaces */}
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

      {/* Acción principal: WhatsApp Directo */}
      <div className="navbar__actions">
        <a
          href="https://wa.me/5492625597956?text=Hola!%20Vengo%20desde%20la%20web%20y%20quiero%20consultar%20por%20un%20mate"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--whatsapp"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
          WhatsApp
        </a>
      </div>
    </nav>
  );
}
