import { useState, useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { useCart } from '../../context/CartContext';

import './Navbar.css';



export default function Navbar() {

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { cartCount } = useCart();

  const location = useLocation(); // Escuchamos la ubicación actual



  const navLinks = [

    { label: 'Inicio', to: '/' },

    { label: 'Nosotros', to: '/nosotros' },

    { label: 'Guía de Curado', to: '/guia-curado' },

  ];



  // FUNCIÓN MAESTRA: Cierra menú Y fuerza la subida al tope instantáneamente

  const handleNavClick = () => {

    setIsMobileOpen(false);

    // Usamos el método moderno y decisivo con behavior: 'instant'

    window.scrollTo({

      top: 0,

      behavior: 'instant' // Ni 'smooth' ni nada, ARRIBA YA.

    });

  };



  // Extra de seguridad: Cada vez que cambie la URL (location), forzamos subida.

  useEffect(() => {

    window.scrollTo({ top: 0, behavior: 'instant' });

  }, [location.pathname]);



  return (

    <>

      {/* --- ANNOUNCEMENT BAR (Sin emoji) --- */}

      <div className="announcement-bar">

        <p>

          <b>Beneficio Cuyo:</b> Entrega personalizada en Mendoza y San Luis. Envíos protegidos a todo el país.

        </p>

      </div>



      <nav className="navbar" id="navbar">

        {/* 1. IZQUIERDA: Logo */}

        <div className="navbar__left">

          <Link to="/" className="navbar__logo" onClick={handleNavClick}>

            <img

              src="/logo.png"

              alt="Cuyo Cebado"

              className="navbar__logo-img"

            />

          </Link>

        </div>



        {/* 2. CENTRO: Menú lateral (Drawer) */}

        <div className={`navbar__center ${isMobileOpen ? 'navbar__center--open' : ''}`}>

          <ul className="navbar__links">

            {navLinks.map(link => (

              <li key={link.to}>

                <Link to={link.to} onClick={handleNavClick}>

                  {link.label}

                </Link>

              </li>

            ))}

          </ul>

        </div>



        {/* 3. DERECHA: Carrito y Botón Acción */}

        <div className="navbar__right">

          <Link

            to="/carrito"

            className="navbar__cart-link"

            onClick={handleNavClick}

          >

            <span className="material-symbols-outlined">shopping_cart</span>

            {cartCount > 0 && (

              <span className="cart-badge">{cartCount}</span>

            )}

          </Link>



          <button

            className={`navbar__toggle ${isMobileOpen ? 'navbar__toggle--active' : ''}`}

            onClick={() => setIsMobileOpen(!isMobileOpen)}

            aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}

          >

            <span className="material-symbols-outlined">

              {isMobileOpen ? 'close' : 'menu'}

            </span>

          </button>

        </div>

      </nav>

    </>

  );

}

