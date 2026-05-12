import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${searchTerm.trim()}`);
      setSearchTerm('');
      closeMenu();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">

        {/* 1. LOGO */}
        <div className="navbar__left">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo" />
            <span className="navbar__logo-text">CUYO <span>CEBADO</span></span>
          </Link>
        </div>

        {/* 2. BUSCADOR UNIVERSAL */}
        <div className="navbar__center">
          <form className="navbar__search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="¿Qué buscás?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="material-symbols-outlined">search</button>
          </form>
        </div>

        {/* 3. NAVEGACIÓN Y CARRITO */}
        <div className="navbar__right">
          <div className="navbar__desktop-links">
            <Link to="/" className="nav-item">Inicio</Link>
            <Link to="/productos" className="nav-item">Productos</Link>
            <Link to="/nosotros" className="nav-item">Nosotros</Link>
            <Link to="/guia-curado" className="nav-item">Guía</Link>
          </div>

          {/* LINK DEL CARRITO - AHORA CON CLASE ESPECÍFICA PARA MÓVIL */}
          <Link to="/carrito" className="navbar__cart-link" onClick={closeMenu}>
            <span className="material-symbols-outlined cart-icon-nav">shopping_cart</span>
            {totalItems > 0 && <span className="cart-count-premium">{totalItems}</span>}
          </Link>

          <button className="navbar__hamburger-btn" onClick={toggleMenu}>
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL (Carrito eliminado de aquí por pedido) */}
      <div className={`navbar__mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={closeMenu}>Inicio</Link>
        <Link to="/productos" onClick={closeMenu}>Productos</Link>
        <Link to="/nosotros" onClick={closeMenu}>Nosotros</Link>
        <Link to="/guia-curado" onClick={closeMenu}>Guía de Curado</Link>
      </div>

      {isMenuOpen && <div className="navbar__blur-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}