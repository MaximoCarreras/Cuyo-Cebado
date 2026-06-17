import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-clean">
      
      {/* CONTENEDOR DE ENLACES Y BIO */}
      <div className="footer-clean__container">
        
        <div className="footer-clean__info">
          <p>
            Curaduría premium de piezas artesanales. <br />
            Tradición y diseño desde Mendoza hacia todo el país.
          </p>
        </div>

        <div className="footer-clean__column">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/productos">Todos los productos</Link></li>
            <li><Link to="/nosotros">Nuestra Historia</Link></li>
            <li><Link to="/guia-curado">Guía de Curado</Link></li>
          </ul>
        </div>

        <div className="footer-clean__column">
          <h4>Contacto</h4>
          <ul>
            <li><Link to="/contacto">Escribinos</Link></li>
            <li><Link to="/envios">Envíos y Retiros</Link></li>
            <li><Link to="/carrito">Mi Carrito</Link></li>
          </ul>
        </div>

      </div>

      {/* EL LOGO ORIGINAL COMO CIERRE */}
      <div className="footer-clean__brand">
        <img src="/logo.png" alt="Logo Cuyo Cebado" className="footer-clean__logo" />
      </div>

      {/* COPYRIGHT CENTRADO */}
      <div className="footer-clean__bottom">
        <p>&copy; 2026 Cuyo Cebado. Todos los derechos reservados.</p>
      </div>

    </footer>
  );
}