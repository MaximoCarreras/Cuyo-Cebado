import heroImage from '../../assets/hero_mate.png';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero section" id="hero">
      <div className="hero__container section__container">
        {/* Columna izquierda — Contenido de marca */}
        <div className="hero__content">
          <h1 className="hero__title">
            Cuyo Cebado: El mate perfecto hecho en Mendoza
          </h1>
          <p className="hero__subtitle">
            Piezas únicas talladas a mano que cuentan nuestra historia. Envío a todo el país.
          </p>

          {/* Botones de acción con tu WhatsApp real */}
          <div className="hero__actions">
            <a href="#productos" className="btn btn--primary">
              <span className="material-symbols-outlined">storefront</span>
              Ver Catálogo
            </a>
            {/* Link directo al WhatsApp del emprendimiento */}
            <a href="https://wa.me/5492625597956" target="_blank" rel="noreferrer" className="btn btn--secondary">
              <span className="material-symbols-outlined">chat</span>
              WhatsApp
            </a>
          </div>

          {/* Prueba social — Genera confianza en el cliente */}
          <p className="hero__proof">
            ⭐ +100 materos cebados en todo el país · Envío gratis en Mendoza
          </p>
        </div>

        {/* Columna derecha — Imagen del producto */}
        <div className="hero__image">
          <img
            src={heroImage}
            alt="Mate artesanal premium de Cuyo Cebado hecho en Mendoza"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
