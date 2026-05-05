/**
 * SpecialOffer — Urgency band with real-time countdown.
 * Golden background, countdown in days:hours:minutes:seconds. [SF]
 */
import { useCountdown } from '../../hooks/useCountdown';
import './SpecialOffer.css';

export default function SpecialOffer() {
  /* 3-day countdown from current moment */
  const { days, hours, minutes, seconds, isExpired } = useCountdown(3);

  /* Zero-pad helper for display [SF] */
  const pad = (n) => String(n).padStart(2, '0');

  if (isExpired) return null;

  return (
    <section className="offer">
      <div className="offer__container section__container">
        <p className="offer__text">
          🎁 ENVÍO GRATIS en compras mayores a $80.000 — Solo por esta semana
        </p>

        {/* Real-time countdown display */}
        <div className="offer__countdown">
          <div className="offer__time-block">
            <span className="offer__time-value">{pad(days)}</span>
            <span className="offer__time-label">días</span>
          </div>
          <span className="offer__separator">:</span>
          <div className="offer__time-block">
            <span className="offer__time-value">{pad(hours)}</span>
            <span className="offer__time-label">hs</span>
          </div>
          <span className="offer__separator">:</span>
          <div className="offer__time-block">
            <span className="offer__time-value">{pad(minutes)}</span>
            <span className="offer__time-label">min</span>
          </div>
          <span className="offer__separator">:</span>
          <div className="offer__time-block">
            <span className="offer__time-value">{pad(seconds)}</span>
            <span className="offer__time-label">seg</span>
          </div>
        </div>

        <a href="#productos" className="btn btn--dark btn--small">
          Aprovechar oferta
        </a>
      </div>
    </section>
  );
}
