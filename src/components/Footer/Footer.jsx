import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-artistic">
      
      {/* 🔥 CORDILlERA MAJESTUOSA QUE INVADE EL HOME */}
      <div className="footer-artistic__landscape">
        {/* SVG con trazado orgánico detallado de picos andinos */}
        <svg className="andes-skyline" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Capa de montañas lejanas (sutiles en dorado muy bajo) */}
          <path d="M0,200 L0,140 L120,90 L260,150 L410,60 L580,130 L720,40 L900,140 L1080,70 L1260,130 L1440,80 L1440,200 Z" fill="rgba(165, 129, 58, 0.04)" />
          {/* Capa principal (sólida, se une al cuerpo del footer) */}
          <path d="M0,200 L0,160 L90,110 L220,170 L340,120 L480,180 L620,80 L780,160 L940,95 L1100,150 L1240,110 L1350,165 L1440,130 L1440,200 Z" fill="#1a1614" />
        </svg>
        
        {/* El alma del footer: Firma única de marca en dorado premium */}
        <h2 className="footer-artistic__brand-text">CUYO CEBADO</h2>
      </div>

      <div className="footer-artistic__container">
        
        {/* COLUMNA 1: Esencia de marca */}
        <div className="footer-artistic__info">
          <p>
            Curaduría premium de piezas artesanales. <br />
            Tradición y diseño desde Mendoza hacia todo el país.
          </p>
        </div>

        {/* COLUMNA 2: Navegación limpia */}
        <div className="footer-artistic__column">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/productos">Todos los productos</Link></li>
            <li><Link to="/nosotros">Nuestra Historia</Link></li>
            <li><Link to="/guia-curado">Guía de Curado</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: Soporte y Gestión */}
        <div className="footer-artistic__column">
          <h4>Contacto</h4>
          <ul>
            <li><Link to="/contacto">Escribinos</Link></li>
            <li><Link to="/envios">Envíos y Retiros</Link></li>
            <li><Link to="/carrito">Mi Carrito</Link></li>
          </ul>
        </div>

      </div>

      {/* BARRA INFERIOR: Transparencia legal y pagos limpios */}
      <div className="footer-artistic__bottom">
        <div className="footer-artistic__bottom-content">
          <p>&copy; {new Date().getFullYear()} Cuyo Cebado. Todos los derechos reservados.</p>
          <div className="footer-artistic__payments">
            <span>Mercado Pago</span>
            <span>•</span>
            <span>Tarjetas</span>
            <span>•</span>
            <span>Transferencia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}