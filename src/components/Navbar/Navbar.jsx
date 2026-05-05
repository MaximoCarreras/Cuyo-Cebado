/**
 * Navbar — Barra de navegación fija para Cuyo Cebado.
 */
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { itemCount } = useCart();
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* Detectar scroll para el modo compacto */
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Enlaces de navegación */
  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Productos', href: '#productos' },
    { label: 'Kits Regalo', href: '#kit-regalo' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className={`navbar ${isCompact ? 'navbar--compact' : ''}`} id="navbar">
      {/* Logo con el nuevo nombre de marca */}
      <a href="#hero" className="navbar__logo">Cuyo Cebado</a>

      {/* Menú hamburguesa para celulares */}
      <button
        className="navbar__toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">
          {isMobileOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Enlaces de navegación */}
      <ul className={`navbar__links ${isMobileOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Acciones: Carrito + Tu WhatsApp real */}
      <div className="navbar__actions">
        <button className="navbar__cart" aria-label="Carrito de compras">
          <span className="material-symbols-outlined">shopping_bag</span>
          {itemCount > 0 && <span className="navbar__cart-count">{itemCount}</span>}
        </button>

        <a
          href="https://wa.me/5492625597956?text=Hola!%20Vengo%20desde%20la%20web%20y%20quiero%20consultar%20por%20un%20mate"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--whatsapp"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
          WhatsApp
        </a>
      </div>
    </nav>
  );
}
