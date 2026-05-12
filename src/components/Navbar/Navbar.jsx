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
        {/* IZQUIERDA: LOGO */}
        <div className="navbar__left">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo" />
            <span className="navbar__brand-text">CUYO CEBADO</span>
          </Link>
        </div>

        {/* CENTRO: BUSCADOR BOUTIQUE */}
        <div className="navbar__search-container">
          <form className="navbar__search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar mate, bombilla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="material-symbols-outlined">search</button>
          </form>
        </div>

        {/* DERECHA: LINKS + CARRITO */}
        <div className="navbar__right">
          <ul className="navbar__desktop-menu">
            <li><Link to="/productos" className="navbar__link">Tienda</Link></li>
          </ul>

          <Link to="/carrito" className="navbar__cart-container" onClick={closeMenu}>
            <span className="material-symbols-outlined cart-icon-main">shopping_cart</span>
            {totalItems > 0 && <div className="cart-badge-premium">{totalItems}</div>}
          </Link>

          <button className="navbar__hamburger" onClick={toggleMenu} aria-label="Menu">
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={`navbar__mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
        <form className="mobile-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <Link to="/" onClick={closeMenu}>Inicio</Link>
        <Link to="/productos" onClick={closeMenu}>Productos</Link>
        <Link to="/nosotros" onClick={closeMenu}>Nosotros</Link>
        <Link to="/guia-curado" onClick={closeMenu}>Guía de Curado</Link>
      </div>

      {isMenuOpen && <div className="navbar__overlay" onClick={closeMenu}></div>}
    </nav>
  );
}