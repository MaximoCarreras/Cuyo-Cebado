import { useState } from 'react'; // Eliminamos useEffect porque ya no hay animación de scroll
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Guía de Curado', to: '/guia-curado' },
  ];

  return (
    <nav className="navbar" id="navbar">
      {/* 1. IZQUIERDA: Logo */}
      <div className="navbar__left">
        <Link to="/" className="navbar__logo" onClick={() => setIsMobileOpen(false)}>
          <img
            src="/logo.png"
            alt="Cuyo Cebado"
            className="navbar__logo-img"
          />
        </Link>
      </div>

      {/* 2. CENTRO: Links de navegación (Se convierte en cajón lateral en móvil) */}
      <div className={`navbar__center ${isMobileOpen ? 'navbar__center--open' : ''}`}>

        {/* Cruz para cerrar en vista de celular */}
        <button
          className="navbar__close-mobile"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Cerrar menú"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <ul className="navbar__links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link to={link.to} onClick={() => setIsMobileOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. DERECHA: Carrito y Botón Hamburguesa */}
      <div className="navbar__right">
        <Link
          to="/carrito"
          className="navbar__cart-link"
          onClick={() => setIsMobileOpen(false)}
        >
          <span className="material-symbols-outlined">shopping_cart</span>

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}

          <span className="cart-text">Carrito</span>
        </Link>

        {/* Botón de las 3 rayitas (solo se ve en celulares) */}
        <button
          className="navbar__toggle"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
}