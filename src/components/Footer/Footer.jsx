import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      
      {/* 🔥 MONTAÑAS Y TEXTO GIGANTE QUE EMERGEN HACIA EL HOME */}
      <div className="footer__landscape">
        <svg className="mountain-watermark" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Capa de montañas que siluetean el borde superior */}
          <path d="M0,120 L0,60 L180,20 L400,90 L650,10 L900,80 L1050,40 L1200,90 L1200,120 Z" />
        </svg>
        
        {/* El único y principal título de marca en dorado premium */}
        <h2 className="footer__massive-text">CUYO CEBADO</h2>
      </div>

      <div className="footer__container">

        {/* COLUMNA 1: Identidad (Sin título repetido) */}
        <div className="footer__brand">
          <p className="footer__description">
            Curaduría premium de mates imperiales y artesanales.
            Tradición y calidad desde la cordillera hacia todo el país.
          </p>
          {/* Métodos de Pago sutiles */}
          <div className="footer__payments">
            <span className="footer__payment-label">Aceptamos:</span>
            <div className="footer__payment-icons">
              <span className="payment-badge">Mercado Pago</span>
              <span className="payment-badge">Tarjetas</span>
              <span className="payment-badge">Transferencia</span>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: Navegación */}
        <div className="footer__group">
          <h4 className="footer__subtitle">Navegación</h4>
          <ul className="footer__list">
            <li><a href="/">Inicio</a></li>
            <li><a href="/nosotros">Nosotros</a></li>
            <li><a href="/guia-curado">Guía de Curado</a></li>
          </ul>
        </div>

        {/* COLUMNA 3: Ayuda y Legales */}
        <div className="footer__group">
          <h4 className="footer__subtitle">Ayuda y Legales</h4>
          <ul className="footer__list">
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/envios">Envíos y Devoluciones</a></li>
            <li><a href="/terminos">Términos y Condiciones</a></li>
            <li><a href="/carrito">Mi Carrito</a></li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Cuyo Cebado. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}