import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-geometric">
      
      {/* 🔥 CORDILLERA APLICADA: 3 CAPAS GEOMÉTRICAS CON PROFUNDIDAD */}
      <div className="footer-geometric__landscape">
        <svg className="andes-sharp" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          
          {/* CAPA 1 (Fondo lejano): Picos chicos en las esquinas. Color gris oscuro/marrón */}
          <path d="M0,200 L0,140 L180,100 L380,200 L1060,200 L1260,100 L1440,140 L1440,200 Z" fill="#342c27" />
          
          {/* CAPA 2 (Medio): Picos medianos cortando a los chicos. Color intermedio */}
          <path d="M0,200 L0,170 L350,70 L580,200 L860,200 L1090,70 L1440,170 L1440,200 Z" fill="#231e1a" />
          
          {/* CAPA 3 (Frente): Montaña ALFA central y base. Color exacto del footer */}
          <path d="M0,200 L0,190 L520,190 L720,20 L920,190 L1440,190 L1440,200 Z" fill="#1a1614" />
          
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

      {/* REDES SOCIALES (Solo íconos exactos y finos) */}
      <div className="footer-geometric__socials">
        
        {/* INSTAGRAM */}
        <a href="#" target="_blank" rel="noreferrer" title="Instagram" className="icon-social-sharp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>

        {/* WHATSAPP */}
        <a href="#" target="_blank" rel="noreferrer" title="WhatsApp" className="icon-social-sharp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        </a>

        {/* MEGÁFONO CLÁSICO (Canal de Difusión) */}
        <a href="#" target="_blank" rel="noreferrer" title="Canal de Difusión" className="icon-social-sharp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M4 7v10h3v5h4v-5h3l6 4V3l-6 4H4zm16 1.5v7a3.5 3.5 0 0 0 0-7z"/>
          </svg>
        </a>

        {/* TIKTOK OFICIAL (Trazo fino) */}
        <a href="#" target="_blank" rel="noreferrer" title="TikTok" className="icon-social-sharp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M12.53 0c1.31 0 2.61.01 3.91.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.11 7.47-1.93 1.9-4.57 2.95-7.3 2.91-2.92-.04-5.73-1.3-7.66-3.41-1.92-2.1-2.82-4.9-2.71-7.75.1-2.73 1.25-5.36 3.16-7.25 1.88-1.87 4.45-2.91 7.1-2.94v4.02c-1.57.06-3.1.66-4.26 1.75-1.15 1.07-1.85 2.58-1.95 4.16-.1 1.55.43 3.09 1.45 4.23 1.01 1.13 2.45 1.83 4.01 1.95 1.52.12 3.05-.28 4.25-1.14 1.22-.87 2-2.22 2.21-3.69.07-.48.1-.98.1-1.47V0h-4v.02z"/>
          </svg>
        </a>

      </div>

      {/* COPYRIGHT CENTRADO */}
      <div className="footer-geometric__bottom">
        <p>&copy; 2026 Cuyo Cebado. Todos los derechos reservados.</p>
      </div>

    </footer>
  );
}