import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [banner, setBanner] = useState({ text: '', active: false });

  const navigate = useNavigate();
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchNavbarData = async () => {
      const { data: bData } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
      if (bData) setBanner({ text: bData.banner_text, active: bData.banner_active });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: pData } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setUserRole(pData?.role);
      }
    };
    fetchNavbarData();

    const channel = supabase.channel('site_settings_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings' }, (payload) => {
        setBanner({ text: payload.new.banner_text, active: payload.new.banner_active });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* 💥 BARRA DORADA CON ANIMACIÓN INFINITA HACIA LA DERECHA 💥 */}
      {banner.active && (
        <div className="announcement-banner">
          <div className="announcement-banner__track">
            <div className="announcement-banner__content">
              <span>{banner.text}</span> • <span>{banner.text}</span> • <span>{banner.text}</span> • <span>{banner.text}</span> •
            </div>
            <div className="announcement-banner__content">
              <span>{banner.text}</span> • <span>{banner.text}</span> • <span>{banner.text}</span> • <span>{banner.text}</span> •
            </div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <Link to="/" className="navbar__brand" onClick={() => setIsMenuOpen(false)}>
              <img src="/logo.png" alt="Cuyo Cebado" className="navbar__logo" />
              <span className="navbar__logo-text">CUYO <span>CEBADO</span></span>
            </Link>
          </div>

          <div className="navbar__center">
            <form className="navbar__search" onSubmit={handleSearch}>
              <input type="text" placeholder="¿Qué buscás?" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                <Link to="/admin" className="nav-item nav-item--admin" style={{ color: '#a5813a', fontWeight: 'bold' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '4px' }}>admin_panel_settings</span>
                  ADMIN
                </Link>
              )}
              <Link to="/mi-cuenta" className="nav-item nav-item--account">
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '4px' }}>person</span>
                Mi Cuenta
              </Link>
            </div>

            <Link to="/carrito" className="navbar__cart-link" onClick={() => setIsMenuOpen(false)}>
              <span className="material-symbols-outlined cart-icon-nav">shopping_cart</span>
              {totalItems > 0 && <span className="cart-count-premium">{totalItems}</span>}
            </Link>
            <button className="navbar__hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}