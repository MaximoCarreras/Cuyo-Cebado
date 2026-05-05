/**
 * Hero — Full-screen hero section with two columns.
 * Left: heading, subtitle, CTAs, social proof.
 * Right: premium mate image. [SF]
 */
import heroImage from '../../assets/hero_mate.png';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero section" id="hero">
      <div className="hero__container section__container">
        {/* Left column — content */}
        <div className="hero__content">
          <h1 className="hero__title">
            El mate perfecto, hecho en Mendoza
          </h1>
          <p className="hero__subtitle">
            Piezas únicas talladas a mano. Envío a todo el país en 48hs.
          </p>

          {/* Dual CTA buttons */}
          <div className="hero__actions">
            <a href="#productos" className="btn btn--primary">
              <span className="material-symbols-outlined">storefront</span>
              Ver productos
            </a>
            <a href="#kit-regalo" className="btn btn--secondary">
              <span className="material-symbols-outlined">redeem</span>
              Kits de regalo
            </a>
          </div>

          {/* Social proof line */}
          <p className="hero__proof">
            ⭐ +15 materos satisfechos · Envío gratis desde $80.000
          </p>
        </div>

        {/* Right column — image */}
        <div className="hero__image">
          <img
            src={heroImage}
            alt="Mate artesanal de madera tallado a mano en Mendoza"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
