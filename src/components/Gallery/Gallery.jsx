/**
 * Gallery — Instagram-style photo grid.
 * 6 lifestyle images + CTA to follow on Instagram. [SF]
 */
import gallery1 from '../../assets/gallery_1.png';
import gallery2 from '../../assets/gallery_2.png';
import gallery3 from '../../assets/gallery_3.png';
import gallery4 from '../../assets/gallery_4.png';
import gallery5 from '../../assets/gallery_5.png';
import gallery6 from '../../assets/gallery_6.png';
import './Gallery.css';

const GALLERY_IMAGES = [
  { src: gallery1, alt: 'Mate en viñedo mendocino al atardecer' },
  { src: gallery2, alt: 'Manos sosteniendo mate humeante' },
  { src: gallery3, alt: 'Mate con montañas de los Andes de fondo' },
  { src: gallery4, alt: 'Mesa familiar con mates y medialunas' },
  { src: gallery5, alt: 'Mate sobre poncho de lana rústico' },
  { src: gallery6, alt: 'Close-up de mate de calabaza con bombilla' },
];

export default function Gallery() {
  return (
    <section className="gallery section">
      <div className="section__container">
        <div className="section__title">
          <h2>Compartí tu momento #MatesMendoza</h2>
          <div className="gold-line"></div>
        </div>

        <div className="gallery__grid">
          {GALLERY_IMAGES.map((img, i) => (
            <div className="gallery__item" key={i}>
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div className="gallery__overlay">
                <span className="material-symbols-outlined">favorite</span>
              </div>
            </div>
          ))}
        </div>

        <div className="gallery__cta">
          <a
            href="https://instagram.com/matesmendoza"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline-gold"
          >
            <span className="material-symbols-outlined">photo_camera</span>
            Seguinos en Instagram @matesmendoza
          </a>
        </div>
      </div>
    </section>
  );
}
