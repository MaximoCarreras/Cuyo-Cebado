import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-layered">
      
      {/* 🔥 CORDILlERA CON PROFUNDIDAD (3 Capas superpuestas) */}
      <div className="footer-layered__landscape">
        <svg className="andes-depth" viewBox="0 0 1440 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          
          {/* Capa 1: Fondo (Montañas chiquitas en las esquinas) - Tono más claro para dar lejanía */}
          <path d="M0,150 L0,90 L150,50 L350,130 L1090,130 L1290,50 L1440,90 L1440,150 Z" fill="#2a2420" />
          
          {/* Capa 2: Medio (Montañas medianas) - Tono intermedio */}
          <path d="M0,150 L100,150 L350,20 L600,130 L840,130 L1090,20 L1340,150 L1440,150 Z" fill="#211c19" />
          
          {/* Capa 3: Frente (Montaña ALFA gigante) - Mismo color exacto del footer */}
          <path d="M0,150 L0,130 L450,130 L720,0 L990,130 L1440,130 L1440,150 Z" fill="#1a1614" />
          
        </svg>
      </div>

      {/* CONTENEDOR CENTRAL: Explorar | Logo | Contacto */}
      <div className="footer-layered__container">
        
        <div className="footer-layered__column">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/productos">Todos los productos</Link></li>
            <li><Link to="/nosotros">Nuestra Historia</Link></li>
            <li><Link to="/guia-curado">Guía de Curado</Link></li>
          </ul>
        </div>

        <div className="footer-layered__logo-wrapper">
          <img src="/logo.png" alt="Logo Cuyo Cebado" className="footer-layered-logo" />
        </div>

        <div className="footer-layered__column">
          <h4>Contacto</h4>
          <ul>
            <li><Link to="/contacto">Escribinos</Link></li>
            <li><Link to="/envios">Envíos y Retiros</Link></li>
            <li><Link to="/carrito">Mi Carrito</Link></li>
          </ul>
        </div>

      </div>

      {/* REDES SOCIALES (Solo los iconos oficiales en alta definición) */}
      <div className="footer-layered__socials">
        
        {/* INSTAGRAM */}
        <a href="#" target="_blank" rel="noreferrer" title="Instagram" className="icon-official">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>

        {/* WHATSAPP (Logo Oficial) */}
        <a href="#" target="_blank" rel="noreferrer" title="WhatsApp Chat" className="icon-official">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        </a>

        {/* MEGÁFONO (Canal de difusión) */}
        <a href="#" target="_blank" rel="noreferrer" title="Canal de Difusión" className="icon-official">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M4.34 5.34C3.89 5.34 3.5 5.68 3.5 6.13v11.74c0 .45.39.79.84.79h3.69l6.19 4.1c.45.3.99.04.99-.48V1.71c0-.52-.54-.78-.99-.48l-6.19 4.1H4.34zm12.33 2.05c-.24-.24-.62-.24-.86 0-.24.24-.24.62 0 .86 1.4 1.4 1.4 3.69 0 5.09-.24.24-.24.62 0 .86.12.12.28.18.43.18s.31-.06.43-.18c1.88-1.87 1.88-4.93 0-6.81zm2.39-2.39c-.24-.24-.62-.24-.86 0-.24.24-.24.62 0 .86 2.72 2.72 2.72 7.15 0 9.87-.24.24-.24.62 0 .86.12.12.28.18.43.18s.31-.06.43-.18c3.2-3.19 3.2-8.39 0-11.59z"/>
          </svg>
        </a>

        {/* TIKTOK (Logo Oficial) */}
        <a href="#" target="_blank" rel="noreferrer" title="TikTok" className="icon-official">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.25-6.36V8.05a8.36 8.36 0 0 0 4.39 1.49V6.1a4.9 4.9 0 0 1-2.32-.41z"/>
          </svg>
        </a>

      </div>

      {/* COPYRIGHT CENTRADO ABSOLUTO */}
      <div className="footer-layered__bottom">
        <p>&copy; 2026 Cuyo Cebado. Todos los derechos reservados.</p>
      </div>

    </footer>
  );
}