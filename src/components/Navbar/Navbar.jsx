import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import LogoCuyo from './LogoCuyo'; // Importamos el logo en código
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">

        {/* IZQUIERDA: LOGO EN CÓDIGO (SVG) */}
        <div className="navbar__left">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <LogoCuyo className="navbar__logo-svg" />
            <span className="navbar__brand-text">CUYO CEBADO</span>
          </Link>
        </div>

        {/* CENTRO: LINKS */}
        <ul className="navbar__desktop-menu">
          <li><Link to="/" className="navbar__link">Inicio</Link></li>
          <li><Link to="/productos" className="navbar__link">Productos</Link></li>
          <li><Link to="/nosotros" className="navbar__link">Nosotros</Link></li>
          <li><Link to="/guia-curado" className="navbar__link">Guía de Curado</Link></li>
        </ul>

        {/* DERECHA: CARRITO + HAMBURGUESA */}
        <div className="navbar__right">
          <Link to="/carrito" className="navbar__cart-container" onClick={closeMenu}>
            <span className="material-symbols-outlined cart-icon-main">shopping_cart</span>
            {totalItems > 0 && <div className="cart-badge-premium">{totalItems}</div>}
          </Link>

          <button className="navbar__hamburger" onClick={toggleMenu} aria-label="Menu">
            <span className="material-symbols-outlined">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={`navbar__mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Inicio</Link>
        <Link to="/productos" onClick={closeMenu}>Productos</Link>
        <Link to="/nosotros" onClick={closeMenu}>Nosotros</Link>
        <Link to="/guia-curado" onClick={closeMenu}>Guía de Curado</Link>
      </div>

      {isMenuOpen && <div className="navbar__overlay" onClick={closeMenu}></div>}
    </nav>
  );
}