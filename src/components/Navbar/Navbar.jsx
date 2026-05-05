import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Productos', href: '#productos' },
    { label: 'Nosotros', href: '#nuestra-historia' },
    { label: 'Preguntas', href: '#faq' },
  ];

  return (
    <nav className={`navbar ${isCompact ? 'navbar--compact' : ''}`} id="navbar">
      {/* Reemplazamos el texto por el logo transparente */}
      <a href="#hero" className="navbar__logo">
        <img 
          src="/logo.png" 
          alt="Cuyo Cebado" 
          className="navbar__logo-img"
        />
      </a>

      <button
        className="navbar__toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">
          {isMobileOpen ? 'close' : 'menu'}
        </span>
      </button>

      <ul className={`navbar__links ${isMobileOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map(link => (
          <li key={link.href}>
            <a href={link.href} onClick={() => setIsMobileOpen(false)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
