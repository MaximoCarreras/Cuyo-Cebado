import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // 1. Conectamos con el cerebro del carrito
import './Navbar.css';

export default function Navbar() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 2. Traemos el contador de productos
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Guía de Curado', to: '/guia-curado' },
  ];

  return (
    <nav className={`navbar ${isCompact ? 'navbar--compact' : ''}`} id="navbar">
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

        <li>
          <Link
            to="/carrito"
            className="navbar__cart-link"
            onClick={() => setIsMobileOpen(false)}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span className="material-symbols-outlined">shopping_cart</span>

            {/* 3. El círculo con el número de productos */}
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}

            <span className="cart-text">Carrito</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}