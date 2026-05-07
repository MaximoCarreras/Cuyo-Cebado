/**
 * WhyUs — Value proposition with 3 columns.
 * Icons in golden circles with descriptions. [SF]
 */
import './WhyUs.css';

const VALUES = [
  {
    icon: 'construction',
    title: '100% artesanal',
    desc: 'Cada pieza es tallada a mano por artesanos mendocinos con más de 20 años de experiencia.',
  },
  {
    icon: 'park',
    title: 'Materiales nobles',
    desc: 'Lapacho, calabaza curada, cuero vacuno y alpaca. Solo lo mejor de la tierra argentina.',
  },
  {
    icon: 'history_edu',
    title: 'Tradición mendocina',
    desc: 'Técnica ancestral preservada de generación en generación al pie de la Cordillera.',
  },
];

export default function WhyUs() {
  return (
    <section className="whyus section">
      <div className="section__container">

        {/* DOMAMOS EL TÍTULO CON UNA CLASE ESPECÍFICA */}
        <div className="section__title whyus__header">
          <h2>¿Por qué elegirnos?</h2>
          <div className="gold-line"></div>
        </div>

        <div className="whyus__grid">
          {VALUES.map((val, i) => (
            <div className="whyus__card" key={i}>
              <div className="whyus__icon">
                <span className="material-symbols-outlined">{val.icon}</span>
              </div>
              <h3>{val.title}</h3>
              <p>{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}