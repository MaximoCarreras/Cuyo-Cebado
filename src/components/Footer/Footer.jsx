import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-premium">
      <div className="footer-premium__container">
        
        {/* SECCIÓN SUPERIOR: Logo y Declaración de Marca */}
        <div className="footer-premium__brand">
          <img src="/logo.png" alt="Cuyo Cebado" className="footer-premium__logo" />
          <p className="footer-premium__bio">
            Curaduría de mates imperiales y artesanales. <br/>
            Tradición y calidad desde Mendoza hacia todo el país.
          </p>
        </div>

        {/* SECCIÓN MEDIA: Grilla de Navegación Perfecta */}
        <div className="footer-premium__links-wrapper">
          <div className="footer-premium__column">
            <h4>Tienda</h4>
            <ul>
              <li><Link to="/productos">Todos los productos</Link></li>
              <li><Link to="/productos?search=imperial">Mates Imperiales</Link></li>
              <li><Link to="/productos?search=bombilla">Bombillas de Alpaca</Link></li>
            </ul>
          </div>
          
          <div className="footer-premium__column">
            <h4>Comunidad</h4>
            <ul>
              <li><Link to="/nosotros">Nuestra Historia</Link></li>
              <li><Link to="/guia-curado">Guía de Curado</Link></li>
              <li><Link to="/mi-cuenta">Cuyo Puntos ✨</Link></li>
            </ul>
          </div>

          <div className="footer-premium__column">
            <h4>Ayuda Legal</h4>
            <ul>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/envios">Envíos y Retiros</Link></li>
              <li><Link to="/terminos">Términos y Condiciones</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Copyright y Pagos Sutiles */}
      <div className="footer-premium__bottom">
        <div className="footer-premium__bottom-content">
          <p>&copy; {new Date().getFullYear()} Cuyo Cebado. Todos los derechos reservados.</p>
          
          <div className="footer-premium__payments">
            <span className="payment-dot">Mercado Pago</span>
            <span className="payment-dot">Tarjetas</span>
            <span className="payment-dot">Transferencia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}