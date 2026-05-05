/**
 * Navbar — Fixed navigation bar.
 * Features: backdrop blur, golden border, compact mode on scroll,
 * cart counter from context, WhatsApp CTA. [SF]
 */
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { itemCount } = useCart();
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* Detect scroll to toggle compact mode [RM - listener cleaned up] */
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Navigation links — smooth scroll to section */
  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Productos', href: '#productos' },
    { label: 'Kits Regalo', href: '#kit-regalo' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className={`navbar ${isCompact ? 'navbar--compact' : ''}`} id="navbar">
      {/* Logo */}
      <a href="#hero" className="navbar__logo">Mates Mendoza</a>

      {/* Mobile hamburger toggle */}
      <button
        className="navbar__toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">
          {isMobileOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Navigation links — centered */}
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

      {/* Right side actions: cart + WhatsApp */}
      <div className="navbar__actions">
        <button className="navbar__cart" aria-label="Carrito de compras">
          <span className="material-symbols-outlined">shopping_bag</span>
          {itemCount > 0 && <span className="navbar__cart-count">{itemCount}</span>}
        </button>

        <a
          href="https://wa.me/5492615555555?text=Hola!%20Quiero%20consultar%20sobre%20sus%20mates"
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
