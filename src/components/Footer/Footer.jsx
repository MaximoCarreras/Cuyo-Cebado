import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-geometric">
      
      {/* 🔥 CORDILLERA ENTRELAZADA */}
      <div className="footer-geometric__landscape">
        <svg className="andes-sharp" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* CAPA 1 */}
          <path d="M0,200 L0,180 L320,80 L600,200 L840,200 L1120,80 L1440,180 L1440,200 Z" fill="#342c27" />
          {/* CAPA 2 */}
          <path d="M0,200 L240,200 L520,40 L720,180 L920,40 L1200,200 L1440,200 Z" fill="#231e1a" />
          {/* CAPA 3 */}
          <path d="M0,200 L0,200 L440,200 L720,10 L1000,200 L1440,200 Z" fill="#1a1614" />
        </svg>
      </div>

      {/* CONTENEDOR CENTRAL */}
      <div className="footer-geometric__container">
        
        <div className="footer-geometric__column">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/productos">Todos los productos</Link></li>
            <li><Link to="/nosotros">Nuestra Historia</Link></li>
            <li><Link to="/guia-curado">Guía de Curado</Link></li>
          </ul>
        </div>

        <div className="footer-geometric__logo-wrapper">
          <img src="/logo.png" alt="Logo Cuyo Cebado" className="footer-geometric-logo" />
        </div>

        <div className="footer-geometric__column">
          <h4>Contacto</h4>
          <ul>
            <li><Link to="/contacto">Escribinos</Link></li>
            <li><Link to="/envios">Envíos y Retiros</Link></li>
            <li><Link to="/carrito">Mi Carrito</Link></li>
          </ul>
        </div>

      </div>

      {/* REDES SOCIALES (Con Links Reales) */}
      <div className="footer-geometric__socials">
        
        {/* INSTAGRAM */}
        {/* Reemplazá "TU_USUARIO" por tu nombre de usuario exacto de IG */}
        <a href="https://www.instagram.com/cuyo_cebado" target="_blank" rel="noreferrer" title="Instagram" className="icon-social-sharp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>

        {/* WHATSAPP */}
        {/* Solo cambiá TU_NUMERO por los 7 u 8 dígitos que le siguen al 261 */}
        <a href="https://wa.me/5492612307516" target="_blank" rel="noreferrer" title="WhatsApp" className="icon-social-sharp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        </a>

        {/* CANAL DE DIFUSIÓN */}
        {/* Reemplazá TU_LINK_DEL_CANAL por el enlace de invitación largo que te da WhatsApp */}
        <a href="https://whatsapp.com/channel/https://whatsapp.com/channel/0029Vb7rceD4NVipcLXtzs3C" target="_blank" rel="noreferrer" title="Canal de Difusión" className="icon-social-sharp">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <path d="M18 8a3 3 0 0 1 0 6"></path>
            <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"></path>
            <path d="M12 8h0l4.524 -3.77a0.9 .9 0 0 1 1.476 .692v12.156a0.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-6.96h-1.04a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h1.04h6.96z"></path>
          </svg>
        </a>

        {/* TIKTOK */}
        {/* Reemplazá "TU_USUARIO" por el de TikTok (manteniendo el @) */}
        <a href="https://www.tiktok.com/@TU_USUARIO" target="_blank" rel="noreferrer" title="TikTok" className="icon-social-sharp">
          <svg viewBox="0 0 448 512" fill="currentColor" width="24" height="24">
            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
          </svg>
        </a>

      </div>

      {/* COPYRIGHT */}
      <div className="footer-geometric__bottom">
        <p>&copy; 2026 Cuyo Cebado. Todos los derechos reservados.</p>
      </div>

    </footer>
  );
}