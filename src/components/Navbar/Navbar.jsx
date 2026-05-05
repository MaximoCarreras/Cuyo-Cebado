import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importante para la navegación fluida
import './Navbar.css';

export default function Navbar() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Definimos las rutas a las nuevas páginas que creaste
  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Guía de Curado', to: '/guia-curado' },
  ];

  return (
    <nav className={`navbar ${isCompact ? 'navbar--compact' : ''}`} id="navbar">
      {/* El logo ahora nos devuelve siempre al Inicio */}
      <Link to="/" className="navbar__logo">
        <img 
          src="/logo.png" 
          alt="Cuyo Cebado" 
          className="navbar__logo-img"
        />
      </Link>

      <button
        className="navbar__toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">
          {isMobileOpen ? 'close' : 'menu'}
        </span>
      </button>

      <ul className={`navbar__links ${isMobileOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map(link => (
          <li key={link.to}>
            <Link to={link.to} onClick={() => setIsMobileOpen(false)}>
              {link.label}
            </Link>
          </li>
        ))}
        
        {/* Agregamos el acceso directo al Carrito */}
        <li>
          <Link 
            to="/carrito" 
            className="navbar__cart-link" 
            onClick={() => setIsMobileOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="cart-text">Carrito</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
