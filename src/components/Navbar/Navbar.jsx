import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      {/* 1. IZQUIERDA: LOGO */}
      <div className="navbar__left">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo" />
          <span className="navbar__brand-text">CUYO CEBADO</span>
        </Link>
      </div>

      {/* 2. CENTRO: LINKS (En escritorio se ven acá, en móvil vuelan al drawer) */}
      <ul className={`navbar__menu ${isMenuOpen ? 'navbar__menu--open' : ''}`}>
        <li><Link to="/" className="navbar__link" onClick={closeMenu}>Inicio</Link></li>
        <li><Link to="/productos" className="navbar__link" onClick={closeMenu}>Productos</Link></li>
        <li><Link to="/nosotros" className="navbar__link" onClick={closeMenu}>Nosotros</Link></li>
        <li><Link to="/guia-curado" className="navbar__link" onClick={closeMenu}>Guía de Curado</Link></li>
      </ul>

      {/* 3. DERECHA: ICONOS (Carrito + Hamburguesa) */}
      <div className="navbar__right">
        <Link to="/carrito" className="navbar__cart-container" onClick={closeMenu}>
          <span className="material-symbols-outlined cart-icon-main">
            shopping_cart
          </span>
          {totalItems > 0 && (
            <div className="cart-badge-premium">{totalItems}</div>
          )}
        </Link>

        <button className="navbar__hamburger" onClick={toggleMenu} aria-label="Menu">
          <span className="material-symbols-outlined">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {isMenuOpen && <div className="navbar__overlay" onClick={closeMenu}></div>}
    </nav>
  );
}