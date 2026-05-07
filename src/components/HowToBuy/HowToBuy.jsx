/**
 * HowToBuy — 4-step purchase process visualization.
 */
import './HowToBuy.css';

const STEPS = [
  { number: 1, icon: 'touch_app', title: 'Elegís tu mate', desc: 'Explorá nuestro catálogo y elegí tu favorito.' },
  { number: 2, icon: 'payments', title: 'Pagás con Mercado Pago', desc: 'Tarjeta, débito o transferencia. 100% seguro.' },
  { number: 3, icon: 'inventory_2', title: 'Lo preparamos con cuidado', desc: 'Embalaje artesanal para que llegue perfecto.' },
  { number: 4, icon: 'home', title: 'Lo recibís en tu casa', desc: 'Envío a todo el país en 24 a 48hs hábiles.' },
];

export default function HowToBuy() {
  return (
    <section className="howtobuy section">
      <div className="section__container">

        {/* Título unificado */}
        <div className="section__title howtobuy__header">
          <h2>Comprar es fácil</h2>
          <div className="gold-line"></div>
        </div>

        <div className="howtobuy__steps">
          {STEPS.map((step, index) => (
            <div className="howtobuy__step" key={step.number}>
              <div className="howtobuy__icon-wrapper">
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>
              <span className="howtobuy__number">{step.number}</span>
              <h3 className="howtobuy__step-title">{step.title}</h3>
              <p className="howtobuy__step-desc">{step.desc}</p>

              {index < STEPS.length - 1 && (
                <span className="material-symbols-outlined howtobuy__arrow">arrow_forward</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}