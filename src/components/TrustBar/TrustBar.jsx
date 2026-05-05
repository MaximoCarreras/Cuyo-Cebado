/**
 * TrustBar — Horizontal bar with 4 trust indicators.
 * Dark background with golden icons and white text. [SF]
 */
import './TrustBar.css';

/* Trust indicators data — constants to avoid magic strings [CMV] */
const TRUST_ITEMS = [
  { icon: 'local_shipping', text: 'Envíos a todo el país' },
  { icon: 'verified_user', text: 'Pago 100% seguro – Mercado Pago' },
  { icon: 'groups', text: '+500 clientes satisfechos' },
  { icon: 'workspace_premium', text: 'Garantía de calidad 30 días' },
];

export default function TrustBar() {
  return (
    <section className="trustbar">
      <div className="trustbar__container section__container">
        {TRUST_ITEMS.map((item, index) => (
          <div className="trustbar__item" key={index}>
            <span className="material-symbols-outlined trustbar__icon">
              {item.icon}
            </span>
            <span className="trustbar__text">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
