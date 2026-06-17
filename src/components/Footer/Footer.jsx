import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-premium-clean">
      
      {/* 🔥 CORDILlERA SIMÉTRICA ESTILO LOGO (5 PICOS QUE INCOPORAN EL HOME) */}
      <div className="footer-premium-clean__landscape">
        <svg className="andes-five-peaks" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Trazado exacto de las 5 montañas: 
              Esquina Izq (Baja) -> Mediana -> CENTRO ALFA (Alta) -> Mediana -> Esquina Der (Baja) */}
          <path d="M0,120 L0,95 L180,65 L360,90 L520,40 L720,10 L920,40 L1080,90 L1260,65 L1440,95 L1440,120 Z" fill="#1a1614" />
        </svg>
      </div>

      <div className="footer-premium-clean__container">
        
        {/* COLUMNA 1: Explorar Centrado */}
        <div className="footer-premium-clean__column">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/productos">Todos los productos</Link></li>
            <li><Link to="/nosotros">Nuestra Historia</Link></li>
            <li><Link to="/guia-curado">Guía de Curado</Link></li>
          </ul>
        </div>

        {/* COLUMNA 2: Contacto Centrado */}
        <div className="footer-premium-clean__column">
          <h4>Contacto</h4>
          <ul>
            <li><Link to="/contacto">Escribinos</Link></li>
            <li><Link to="/envios">Envíos y Retiros</Link></li>
            <li><Link to="/carrito">Mi Carrito</Link></li>
          </ul>
        </div>

      </div>

      {/* SECCIÓN DE REDES SOCIALES CON ICONOS */}
      <div className="footer-premium-clean__socials">
        <a href="#" target="_blank" rel="noreferrer" title="Instagram" className="social-link-icon">
          <span className="material-symbols-outlined">brand_awareness</span> {/* Representación sutil para IG si usas Material Icons, o podés cambiar por etiquetas svg/img */}
          <span>Instagram</span>
        </a>
        <a href="#" target="_blank" rel="noreferrer" title="WhatsApp Chat" className="social-link-icon">
          <span className="material-symbols-outlined">chat</span>
          <span>WhatsApp</span>
        </a>
        <a href="#" target="_blank" rel="noreferrer" title="Canal de Difusión" className="social-link-icon">
          <span className="material-symbols-outlined">campaign</span>
          <span>Canal Difución</span>
        </a>
        <a href="#" target="_blank" rel="noreferrer" title="TikTok" className="social-link-icon">
          <span className="material-symbols-outlined">music_note</span>
          <span>TikTok</span>
        </a>
      </div>

      {/* COPYRIGHT CENTRADO ABSOLUTO */}
      <div className="footer-premium-clean__bottom">
        <p>&copy; 2026 Cuyo Cebado. Todos los derechos reservados.</p>
      </div>

    </footer>
  );
}