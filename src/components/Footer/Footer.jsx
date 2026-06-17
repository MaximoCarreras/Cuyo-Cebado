import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-ultimate">
      
      {/* 🔥 MONTAÑAS INSPIRADAS EN TU LOGO (Con el río sutil) */}
      <div className="footer-ultimate__landscape">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sombra suave de las montañas de fondo */}
          <path d="M0,200 L0,120 L180,80 L320,110 L500,50 L650,90 L850,10 L1050,100 L1200,70 L1200,200 Z" fill="rgba(165, 129, 58, 0.05)" />
          
          {/* Silueta principal: Picos chicos -> Pico gigante (Color del footer) */}
          <path d="M0,200 L0,140 L150,100 L280,130 L450,70 L600,110 L800,20 L1000,120 L1200,90 L1200,200 Z" fill="#1a1614" />
          
          {/* El Río: Una línea dorada que fluye desde la montaña grande hacia abajo */}
          <path d="M800,110 Q 600,150 350,170 T -20,190" fill="none" stroke="#a5813a" strokeWidth="1.5" opacity="0.4" strokeDasharray="5 5" />
        </svg>
      </div>

      {/* CONTENEDOR DE ENLACES (Limpio y ordenado) */}
      <div className="footer-ultimate__container">
        
        <div className="footer-ultimate__info">
          <p>
            Curaduría premium de piezas artesanales. <br />
            Tradición y diseño desde Mendoza hacia todo el país.
          </p>
        </div>

        <div className="footer-ultimate__column">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/productos">Todos los productos</Link></li>
            <li><Link to="/nosotros">Nuestra Historia</Link></li>
            <li><Link to="/guia-curado">Guía de Curado</Link></li>
          </ul>
        </div>

        <div className="footer-ultimate__column">
          <h4>Contacto</h4>
          <ul>
            <li><Link to="/contacto">Escribinos</Link></li>
            <li><Link to="/envios">Envíos y Retiros</Link></li>
            <li><Link to="/carrito">Mi Carrito</Link></li>
          </ul>
        </div>

      </div>

      {/* 🔥 EL GRAN CIERRE: Nombre con efecto brillo */}
      <div className="footer-ultimate__brand-finale">
        <h2>CUYO CEBADO</h2>
      </div>

      {/* BARRA INFERIOR DE COPYRIGHT */}
      <div className="footer-ultimate__bottom">
        <div className="footer-ultimate__bottom-content">
          <p>&copy; {new Date().getFullYear()} Cuyo Cebado. Todos los derechos reservados.</p>
          <div className="footer-ultimate__payments">
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