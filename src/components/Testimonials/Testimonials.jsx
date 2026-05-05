/**
 * Testimonials — Customer reviews with ratings.
 * 3 review cards + aggregate metrics below. [SF]
 */
import './Testimonials.css';

const REVIEWS = [
  {
    text: 'El mate de lapacho es una obra de arte. Se nota la dedicación en cada detalle. Lo uso todos los días y cada vez me gusta más.',
    name: 'Martín Gutiérrez',
    city: 'Buenos Aires',
    stars: 5,
  },
  {
    text: 'Compré el kit regalo para mi viejo y quedó encantado. La caja de madera, la bombilla... todo premium. Van a repetir.',
    name: 'Lucía Fernández',
    city: 'Córdoba',
    stars: 5,
  },
  {
    text: 'Llegó en 48hs tal cual prometieron. El mate de calabaza es hermoso, bien curado y con un acabado impecable. Súper recomendable.',
    name: 'Santiago Morales',
    city: 'Rosario',
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="section__container">
        <div className="section__title">
          <h2>Lo que dicen nuestros materos</h2>
          <div className="gold-line"></div>
        </div>

        <div className="testimonials__grid">
          {REVIEWS.map((review, i) => (
            <div className="testimonials__card" key={i}>
              {/* Star rating */}
              <div className="testimonials__stars">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <span key={j} className="material-symbols-outlined testimonials__star">
                    star
                  </span>
                ))}
              </div>

              {/* Review text in italics */}
              <p className="testimonials__text">"{review.text}"</p>

              {/* Reviewer info */}
              <div className="testimonials__author">
                <div className="testimonials__avatar">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="testimonials__name">{review.name}</p>
                  <p className="testimonials__city">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate metrics */}
        <p className="testimonials__metrics">
          ⭐ 4.9/5 promedio · 127 reseñas verificadas · 98% recomendaría
        </p>
      </div>
    </section>
  );
}
