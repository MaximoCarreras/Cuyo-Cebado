import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-premium-clean">
      
      {/* 🔥 CORDILlERA DE 5 PICOS (Diseño exacto de tu boceto) */}
      <div className="footer-premium-clean__landscape">
        <svg className="andes-five-peaks" viewBox="0 0 1440 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* M0,150 = Base izquierda
            L140,80 = Pico 1 (Chico)
            L450,40 = Pico 2 (Mediano)
            L720,0 = Pico 3 (ALFA - Centro, el más alto)
            L990,40 = Pico 4 (Mediano)
            L1300,80 = Pico 5 (Chico)
          */}
          <path d="M0,150 L0,120 L140,80 L280,120 L450,40 L580,110 L720,0 L860,110 L990,40 L1160,120 L1300,80 L1440,120 L1440,150 Z" fill="#1a1614" />
        </svg>
      </div>

      <div className="footer-premium-clean__container">
        
        {/* COLUMNA 1: Explorar */}
        <div className="footer-premium-clean__column">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/productos">Todos los productos</Link></li>
            <li><Link to="/nosotros">Nuestra Historia</Link></li>
            <li><Link to="/guia-curado">Guía de Curado</Link></li>
          </ul>
        </div>

        {/* LOGO CENTRAL */}
        <div className="footer-premium-clean__logo-wrapper">
          <img src="/logo.png" alt="Logo Cuyo Cebado" className="footer-center-logo" />
        </div>

        {/* COLUMNA 2: Contacto */}
        <div className="footer-premium-clean__column">
          <h4>Contacto</h4>
          <ul>
            <li><Link to="/contacto">Escribinos</Link></li>
            <li><Link to="/envios">Envíos y Retiros</Link></li>
            <li><Link to="/carrito">Mi Carrito</Link></li>
          </ul>
        </div>

      </div>

      {/* SECCIÓN DE REDES SOCIALES (Solo Iconos SVG Puros) */}
      <div className="footer-premium-clean__socials">
        
        {/* INSTAGRAM */}
        <a href="#" target="_blank" rel="noreferrer" title="Instagram" className="social-icon-only">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>

        {/* WHATSAPP */}
        <a href="#" target="_blank" rel="noreferrer" title="WhatsApp Chat" className="social-icon-only">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </a>

        {/* MEGÁFONO (Canal de difusión) */}
        <a href="#" target="_blank" rel="noreferrer" title="Canal de Difusión" className="social-icon-only">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </a>

        {/* TIKTOK */}
        <a href="#" target="_blank" rel="noreferrer" title="TikTok" className="social-icon-only">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
          </svg>
        </a>

      </div>

      {/* COPYRIGHT CENTRADO */}
      <div className="footer-premium-clean__bottom">
        <p>&copy; 2026 Cuyo Cebado. Todos los derechos reservados.</p>
      </div>

    </footer>
  );
}