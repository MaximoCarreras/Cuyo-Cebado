import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__brand">
          <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo" />
          <span className="navbar__brand-text">CUYO CEBADO</span>
        </Link>
      </div>

      <ul className="navbar__menu">
        <li><Link to="/" className="navbar__link">Inicio</Link></li>
        <li><Link to="/productos" className="navbar__link">Productos</Link></li>
        <li><Link to="/nosotros" className="navbar__link">Nosotros</Link></li>
        <li><Link to="/guia-curado" className="navbar__link">Guía de Curado</Link></li>
      </ul>

      <Link to="/carrito" className="navbar__cart-container">
        <span className="material-symbols-outlined cart-icon-main">
          shopping_cart
        </span>
        {totalItems > 0 && (
          <div className="cart-badge-premium">
            {totalItems}
          </div>
        )}
      </Link>
    </nav>
  );
}