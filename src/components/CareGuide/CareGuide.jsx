/**
 * CareGuide — Guía de curado premium.
 */
import './CareGuide.css';

const CARE_STEPS = [
  { number: 1, title: 'Humedecé el interior', desc: 'Llenalo con yerba húmeda y dejalo reposar 24 horas.' },
  { number: 2, title: 'Vaciá y repetí', desc: 'Vaciá la yerba usada, volvé a llenar con yerba fresca y agua tibia.' },
  { number: 3, title: 'Raspá suavemente', desc: 'Con una cuchara, raspá las paredes internas para quitar restos blandos.' },
  { number: 4, title: 'Dejalo secar', desc: 'Poné el mate boca abajo al sol unas horas. ¡Listo para estrenar!' },
];

export default function CareGuide() {
  return (
    <section className="careguide section">
      <div className="section__container">

        <div className="section__title careguide__header">
          <h2>¿Cómo curar tu mate nuevo?</h2>
          <p>Un mate bien curado dura toda la vida</p>
          <div className="gold-line"></div>
        </div>

        <div className="careguide__steps">
          {CARE_STEPS.map(step => (
            <div className="careguide__card" key={step.number}>
              {/* ACÁ LE SACAMOS EL CERO */}
              <span className="careguide__number">{step.number}</span>
              <div className="careguide__text">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}