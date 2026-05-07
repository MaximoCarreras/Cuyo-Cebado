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
            Tradición y calidad desde Mendoza hacia todo el país.
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

        {/* COLUMNA 3: Ayuda */}
        <div className="footer__group">
          <h4 className="footer__subtitle">Atención</h4>
          <ul className="footer__list">
            <li><a href="#faq">Preguntas Frecuentes</a></li>
            <li><a href="/carrito">Mi Carrito</a></li>
            <li><a href="https://wa.me/5492625597956">Envíos y Entregas</a></li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Cuyo Cebado. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}