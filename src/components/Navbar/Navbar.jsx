import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Guía de Curado', to: '/guia-curado' },
  ];

  const handleNavClick = () => {
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <div className="announcement-bar">
        <p><b>Beneficio Cuyo:</b> Entrega personalizada en Mendoza y San Luis. Envíos protegidos a todo el país.</p>
      </div>

      <nav className="navbar">
        <div className="navbar__container">

          {/* IZQUIERDA: Logo */}
          <div className="navbar__left">
            <Link to="/" className="navbar__logo" onClick={handleNavClick}>
              <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo-img" />
            </Link>
          </div>

          {/* CENTRO: Links (Se ocultan en móvil, se ven en escritorio) */}
          <div className={`navbar__center ${isMobileOpen ? 'navbar__center--open' : ''}`}>
            <ul className="navbar__links">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} onClick={handleNavClick}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DERECHA: Carrito y Hamburguesa */}
          <div className="navbar__right">
            <Link to="/carrito" className="navbar__cart-link" onClick={handleNavClick}>
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <button
              className={`navbar__toggle ${isMobileOpen ? 'navbar__toggle--active' : ''}`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <span className="material-symbols-outlined">
                {isMobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}