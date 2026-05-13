import { useState, useEffect } from 'react'; // Agregamos useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient'; // Importamos supabase
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario

  const navigate = useNavigate();
  const { cart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Detectar el rol del usuario al cargar el Navbar
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setUserRole(profile?.role);
      } else {
        setUserRole(null);
      }
    };
    checkUser();

    // Escuchar cambios en la sesión (por si se desloguea)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
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

        {/* 1. IZQUIERDA: LOGO */}
        <div className="navbar__left">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo" />
            <span className="navbar__logo-text">CUYO <span>CEBADO</span></span>
          </Link>
        </div>

        {/* 2. CENTRO: BUSCADOR */}
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

        {/* 3. DERECHA: LINKS + CARRITO */}
        <div className="navbar__right">
          <div className="navbar__desktop-links">
            <Link to="/" className="nav-item">Inicio</Link>
            <Link to="/productos" className="nav-item">Productos</Link>
            <Link to="/nosotros" className="nav-item">Nosotros</Link>
            <Link to="/guia-curado" className="nav-item">Guía</Link>

            {/* BOTÓN ADMIN ESCRITORIO (Solo si es admin) */}
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

      {/* MENÚ MÓVIL */}
      <div className={`navbar__mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={closeMenu}>Inicio</Link>
        <Link to="/productos" onClick={closeMenu}>Productos</Link>
        <Link to="/nosotros" onClick={closeMenu}>Nosotros</Link>
        <Link to="/guia-curado" onClick={closeMenu}>Guía de Curado</Link>

        {/* BOTÓN ADMIN MÓVIL (Solo si es admin) */}
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