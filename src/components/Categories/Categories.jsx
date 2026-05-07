/**
 * Categories — Visual product category filters.
 */
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
  return (
    <section className="categories section" id="categorias">
      <div className="section__container">

        {/* Título unificado */}
        <div className="section__title categories__header">
          <h2>Encontrá tu mate ideal</h2>
          <div className="gold-line"></div>
        </div>

        <div className="categories__grid">
          {CATEGORIES.map(cat => (
            <a
              key={cat.slug}
              href="#productos"
              className="categories__card"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="categories__overlay">
                <span className="categories__name">{cat.name}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}