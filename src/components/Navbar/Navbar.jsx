import { useState } from 'react';
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

  const closeMenu = () => setIsMobileOpen(false);

  return (
    <>
      {/* --- ANNOUNCEMENT BAR (Barra Dorada Superior) --- */}
      <div className="announcement-bar">
        <p>
          🏔️ <b>Beneficio Cuyo:</b> Entrega personalizada en Mendoza y San Luis. Envíos protegidos a todo el país.
        </p>
      </div>

      <nav className="navbar" id="navbar">
        {/* 1. IZQUIERDA: Logo */}
        <div className="navbar__left">
          <Link to="/" className="navbar__logo" onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="Cuyo Cebado"
              className="navbar__logo-img"
            />
          </Link>
        </div>

        {/* 2. CENTRO: Menú lateral (Drawer) */}
        <div className={`navbar__center ${isMobileOpen ? 'navbar__center--open' : ''}`}>
          <ul className="navbar__links">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. DERECHA: Carrito y Botón Acción */}
        <div className="navbar__right">
          <Link
            to="/carrito"
            className="navbar__cart-link"
            onClick={closeMenu}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          <button
            className={`navbar__toggle ${isMobileOpen ? 'navbar__toggle--active' : ''}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <span className="material-symbols-outlined">
              {isMobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}