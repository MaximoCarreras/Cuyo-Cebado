import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [banner, setBanner] = useState({ text: '', active: false });
  
  // --- ESTADO PARA LA ANIMACIÓN DEL CARRITO ---
  const [isBouncing, setIsBouncing] = useState(false);

  const navigate = useNavigate();
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- EFECTO: ESCUCHAR CAMBIOS EN EL CARRITO ---
  useEffect(() => {
      if (totalItems > 0) {
          setIsBouncing(true);
          const timer = setTimeout(() => setIsBouncing(false), 300); // La animación dura 300ms
          return () => clearTimeout(timer);
      }
  }, [totalItems]);

  const normalize = (text) => text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

  const fetchUserData = async (userId) => {
    if (!userId) {
      setUserRole(null);
      setUserPoints(0);
      return;
    }
    const { data: profile } = await supabase.from('profiles').select('role, puntos').eq('id', userId).single();
    if (profile) {
      setUserRole(profile.role);
      setUserPoints(profile.puntos || 0);
    }
  };

  useEffect(() => {
    const fetchNavbarData = async () => {
      const { data: bData } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
      if (bData) setBanner({ text: bData.banner_text, active: bData.banner_active });

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    };
    fetchNavbarData();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setUserRole(null);
          setUserPoints(0);
        }
      }
    );

    const channel = supabase.channel('site_settings_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings' }, (payload) => {
        setBanner({ text: payload.new.banner_text, active: payload.new.banner_active });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      authSubscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const phrases = banner.text ? banner.text.split(',').map(p => p.trim()).filter(Boolean) : [];

  return (
    <>
      {banner.active && phrases.length > 0 && (
        <div className="announcement-banner">
          <div className="announcement-banner__track">
            <div className="announcement-banner__content">
              {Array(6).fill(phrases).flat().map((phrase, idx) => (
                <span key={`c1-${idx}`} className="banner-phrase">{phrase} <span className="banner-diamond">✦</span></span>
              ))}
            </div>
            <div className="announcement-banner__content" aria-hidden="true">
              {Array(6).fill(phrases).flat().map((phrase, idx) => (
                <span key={`c2-${idx}`} className="banner-phrase">{phrase} <span className="banner-diamond">✦</span></span>
              ))}
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
              
              {userRole === 'admin' ? (
                <Link to="/admin" className="nav-item nav-item--admin" style={{ color: '#a5813a', fontWeight: 'bold' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '4px' }}>admin_panel_settings</span> ADMIN
                </Link>
              ) : (
                <Link to="/mi-cuenta" className="nav-item nav-item--account" style={{ color: userPoints > 0 ? '#a5813a' : 'inherit', fontWeight: userPoints > 0 ? '700' : 'normal' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '4px' }}>
                    {userPoints > 0 ? 'stars' : 'person'}
                  </span>
                  {userPoints > 0 ? `✨ ${userPoints} PUNTOS` : 'Mi Cuenta'}
                </Link>
              )}
            </div>

            {/* --- ACÁ APLICAMOS LA CLASE DE ANIMACIÓN --- */}
            <Link to="/carrito" className={`navbar__cart-link ${isBouncing ? 'cart-bounce' : ''}`} onClick={() => setIsMenuOpen(false)}>
              <span className="material-symbols-outlined cart-icon-nav">shopping_cart</span>
              {totalItems > 0 && <span className="cart-count-premium">{totalItems}</span>}
            </Link>
            
            <button className="navbar__hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && <div className="navbar__blur-overlay" onClick={() => setIsMenuOpen(false)}></div>}
      
      <div className={`navbar__mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <button className="navbar__close-btn" onClick={() => setIsMenuOpen(false)}>
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
        <Link to="/productos" onClick={() => setIsMenuOpen(false)}>Productos</Link>
        <Link to="/nosotros" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
        <Link to="/guia-curado" onClick={() => setIsMenuOpen(false)}>Guía de Curado</Link>
        
        {userRole === 'admin' ? (
          <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: '#a5813a', fontWeight: 'bold' }}>Panel Admin</Link>
        ) : (
          <Link to="/mi-cuenta" onClick={() => setIsMenuOpen(false)} style={{ color: userPoints > 0 ? '#a5813a' : 'inherit' }}>
            {userPoints > 0 ? `✨ ${userPoints} PUNTOS` : 'Mi Cuenta'}
          </Link>
        )}
      </div>
    </>
  );
}