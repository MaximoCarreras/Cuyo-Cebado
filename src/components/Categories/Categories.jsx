/**
 * Categories — Visual product category filters (Standardized Premium)
 */
import { useRef, useEffect } from 'react';
import catMadera from '../../assets/cat_madera.png';
import catCalabaza from '../../assets/cat_calabaza.png';
import catCeramica from '../../assets/cat_ceramica.png';
import catKits from '../../assets/cat_kits.png';
import catAccesorios from '../../assets/cat_accesorios.png';
import './Categories.css';

const CATEGORIES = [
  { name: 'Madera', image: catMadera, slug: 'madera' },
  { name: 'Calabaza', image: catCalabaza, slug: 'calabaza' },
  { name: 'Cerámica', image: catCeramica, slug: 'ceramica' },
  { name: 'Kits Regalo', image: catKits, slug: 'kit' },
  { name: 'Accesorios', image: catAccesorios, slug: 'accesorio' },
];

export default function Categories() {
  const categoryCardRefs = useRef([]);

  // 🔥 Efecto Spotlight Estandarizado
  useEffect(() => {
      const handleCardMouse = (e, card) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
      };
      
      categoryCardRefs.current.forEach((card) => {
          if (!card) return;
          card.addEventListener('mousemove', (e) => handleCardMouse(e, card));
      });
      
      return () => {
          categoryCardRefs.current.forEach((card) => {
              if (!card) return;
              card.removeEventListener('mousemove', (e) => handleCardMouse(e, card));
          });
      };
  }, []);

  return (
    <section className="categories section" id="categorias">
      <div className="section__container">

        {/* Título unificado */}
        <div className="section__title categories__header">
          <h2>Encontrá tu mate ideal</h2>
          <div className="gold-line"></div>
        </div>

        {/* 🔥 Grilla y tarjetas actualizadas al formato Home */}
        <div className="categories-grid-premium">
          {CATEGORIES.map((cat, index) => (
            <a
              key={cat.slug}
              href="#productos"
              className="card-cat-dark-spotlight"
              ref={(el) => (categoryCardRefs.current[index] = el)}
            >
              {/* Reflector de luz */}
              <div className="spotlight-light-layer"></div>

              {/* Imagen a ancho completo */}
              <div className="category-full-image-wrapper">
                  <img src={cat.image} alt={cat.name} className="category-card-full-img" loading="lazy" />
              </div>

              {/* Textos */}
              <div className="card-cat-content">
                  <div className="cat-text-display">
                      <h3>{cat.name}</h3>
                      <span>Explorar</span>
                  </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}