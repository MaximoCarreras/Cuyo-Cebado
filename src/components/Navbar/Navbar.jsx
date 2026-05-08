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
      <div className="navbar__container">

        {/* BLOQUE IZQUIERDA: LOGO */}
        <div className="navbar__column navbar__column--left">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo" />
            <span className="navbar__brand-text">CUYO CEBADO</span>
          </Link>
        </div>

        {/* BLOQUE CENTRO: LINKS (Solo Desktop) */}
        <div className="navbar__column navbar__column--center">
          <ul className="navbar__desktop-menu">
            <li><Link to="/" className="navbar__link">Inicio</Link></li>
            <li><Link to="/productos" className="navbar__link">Productos</Link></li>
            <li><Link to="/nosotros" className="navbar__link">Nosotros</Link></li>
            <li><Link to="/guia-curado" className="navbar__link">Guía de Curado</Link></li>
          </ul>
        </div>

        {/* BLOQUE DERECHA: ICONOS */}
        <div className="navbar__column navbar__column--right">
          <Link to="/carrito" className="navbar__cart-container" onClick={closeMenu}>
            <span className="material-symbols-outlined cart-icon-main">shopping_cart</span>
            {totalItems > 0 && <div className="cart-badge-premium">{totalItems}</div>}
          </Link>

          <button className="navbar__hamburger" onClick={toggleMenu}>
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

      </div>

      {/* MENÚ MÓVIL (DRAWER) */}
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