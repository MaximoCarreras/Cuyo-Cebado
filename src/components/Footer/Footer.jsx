/**
 * Footer — 4-column footer with logo, navigation, support, and payments.
 * Includes social links and copyright. [SF]
 */
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container section__container">
        {/* Column 1 — Brand */}
        <div className="footer__brand">
          <h3 className="footer__logo">Mates Mendoza</h3>
          <p className="footer__desc">
            Mates artesanales tallados a mano en Mendoza. 
            Tradición y calidad desde la Cordillera.
          </p>
          <div className="footer__social">
            <a href="https://instagram.com/matesmendoza" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
            <a href="https://facebook.com/matesmendoza" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <span className="material-symbols-outlined">group</span>
            </a>
            <a href="https://pinterest.com/matesmendoza" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <span className="material-symbols-outlined">push_pin</span>
            </a>
          </div>
        </div>

        {/* Column 2 — Navigation */}
        <div className="footer__column">
          <h4>Navegación</h4>
          <ul>
            <li><a href="#hero">Inicio</a></li>
            <li><a href="#productos">Productos</a></li>
            <li><a href="#kit-regalo">Kits Regalo</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        {/* Column 3 — Customer support */}
        <div className="footer__column">
          <h4>Atención al cliente</h4>
          <ul>
            <li><a href="#careguide">Cómo curar tu mate</a></li>
            <li><a href="#faq">Preguntas frecuentes</a></li>
            <li><a href="#">Envíos y entregas</a></li>
            <li><a href="#">Devoluciones</a></li>
          </ul>
        </div>

        {/* Column 4 — Payment methods */}
        <div className="footer__column">
          <h4>Métodos de pago</h4>
          <div className="footer__payments">
            <div className="footer__payment-badge">Mercado Pago</div>
            <div className="footer__payment-badge">Visa</div>
            <div className="footer__payment-badge">Mastercard</div>
            <div className="footer__payment-badge">Transferencia</div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p>© 2024 Mates Mendoza. Todos los derechos reservados. Hecho con ❤️ en Mendoza, Argentina</p>
      </div>
    </footer>
  );
}
