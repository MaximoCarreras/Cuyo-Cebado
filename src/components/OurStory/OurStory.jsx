/**
 * OurStory — Brand story section with dark background.
 * Left: artisan image. Right: narrative text + CTA. [SF]
 */
import artesanoImage from '../../assets/artesano_taller.png';
import './OurStory.css';

export default function OurStory() {
  return (
    <section className="ourstory section" id="nosotros">
      <div className="ourstory__container section__container">
        {/* Left — Image */}
        <div className="ourstory__image">
          <img src={artesanoImage} alt="Artesano mendocino tallando un mate" loading="lazy" />
        </div>

        {/* Right — Story content */}
        <div className="ourstory__content">
          <span className="ourstory__overline">NUESTRA HISTORIA</span>
          <h2 className="ourstory__title">Nacimos del amor al mate</h2>

          <p>
            En un pequeño taller al pie de la Cordillera mendocina, nuestro abuelo Don Carlos 
            comenzó a tallar sus primeros mates hace más de 40 años. Con paciencia infinita y 
            manos curtidas por el sol, transformaba troncos de lapacho en verdaderas obras de arte.
          </p>

          <p>
            Hoy, tres generaciones después, seguimos honrando esa tradición. Cada mate que sale 
            de nuestro taller lleva consigo horas de trabajo artesanal, el aroma de la madera 
            mendocina y el orgullo de una familia que vive para crear piezas que acompañen 
            tus mejores momentos.
          </p>

          <a href="#contacto" className="btn btn--outline-gold">
            Conocé más sobre nosotros
          </a>
        </div>
      </div>
    </section>
  );
}
