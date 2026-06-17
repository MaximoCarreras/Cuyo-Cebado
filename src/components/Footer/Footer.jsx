import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">

        {/* COLUMNA 1: Identidad */}
        <div className="footer__brand">
          <h3 className="footer__title">Cuyo Cebado</h3>
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

      {/* 🔥 NUEVO: PAISAJE Y MARCA GIGANTE */}
      <div className="footer__landscape">
        {/* SVG de montañas minimalistas generadas por código */}
        <svg className="mountain-watermark" viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,300 L0,200 L150,100 L300,220 L500,50 L750,250 L900,120 L1200,280 L1200,300 Z" fill="rgba(165, 129, 58, 0.03)" />
          <path d="M0,300 L0,250 L200,150 L400,260 L650,80 L850,220 L1050,150 L1200,290 L1200,300 Z" fill="rgba(165, 129, 58, 0.05)" />
        </svg>
        
        <h2 className="footer__massive-text">CUYO CEBADO</h2>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Cuyo Cebado. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}