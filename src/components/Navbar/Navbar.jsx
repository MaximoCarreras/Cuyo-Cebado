import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState(null);

  const navigate = useNavigate();
  const { cart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Función para verificar rol
    const checkRole = async (user) => {
      if (!user) {
        setUserRole(null);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setUserRole(data?.role || 'cliente');
    };

    // Verificar sesión inicial
    supabase.auth.getUser().then(({ data: { user } }) => {
      checkRole(user);
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkRole(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        <div className="navbar__left">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo" />
            <span className="navbar__logo-text">CUYO <span>CEBADO</span></span>
          </Link>
        </div>

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

        <div className="navbar__right">
          <div className="navbar__desktop-links">
            <Link to="/" className="nav-item">Inicio</Link>
            <Link to="/productos" className="nav-item">Productos</Link>
            <Link to="/nosotros" className="nav-item">Nosotros</Link>
            <Link to="/guia-curado" className="nav-item">Guía</Link>

            {userRole === 'admin' && (
              <Link to="/admin" className="nav-item" style={{ color: '#a5813a', fontWeight: 'bold' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '4px' }}>admin_panel_settings</span>
                ADMIN
              </Link>
            )}

            <Link to="/mi-cuenta" className="nav-item nav-item--account">
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '4px' }}>person</span>
              Mi Cuenta
            </Link>
          </div>

          <Link to="/carrito" className="navbar__cart-link" onClick={closeMenu}>
            <span className="material-symbols-outlined cart-icon-nav">shopping_cart</span>
            {totalItems > 0 && <span className="cart-count-premium">{totalItems}</span>}
          </Link>

          <button className="navbar__hamburger-btn" onClick={toggleMenu}>
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      <div className={`navbar__mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={closeMenu}>Inicio</Link>
        <Link to="/productos" onClick={closeMenu}>Productos</Link>
        <Link to="/nosotros" onClick={closeMenu}>Nosotros</Link>
        <Link to="/guia-curado" onClick={closeMenu}>Guía de Curado</Link>

        {userRole === 'admin' && (
          <Link to="/admin" onClick={closeMenu} style={{ color: '#a5813a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined">admin_panel_settings</span>
            Panel Admin
          </Link>
        )}

        <Link to="/mi-cuenta" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined">person</span>
          Mi Cuenta
        </Link>
      </div>

      {isMenuOpen && <div className="navbar__blur-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}