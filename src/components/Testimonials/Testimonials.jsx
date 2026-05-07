/**
 * Testimonials / Nuestra Garantía — Compromisos de Cuyo Cebado.
 */
import './Testimonials.css';

const COMPROMISOS = [
  {
    id: 1,
    icon: 'verified',
    title: 'Selección Personal',
    text: '"Elegimos cada mate como si fuera para nosotros. Revisamos la madera, la virola y la terminación para asegurarnos de que recibas una pieza de exportación."'
  },
  {
    id: 2,
    icon: 'terrain',
    title: 'Origen Cuyano',
    text: '"Nacimos entre Mendoza y San Luis. Nuestra misión es llevar el ritual del mate artesanal desde el corazón de la Cordillera a cada rincón del país."'
  },
  {
    id: 3,
    icon: 'support_agent',
    title: 'Atención Directa',
    text: '"No somos una máquina. Te atendemos por WhatsApp, te mandamos fotos reales del stock y te asesoramos para que elijas el mate que mejor va con vos."'
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials section" id="compromiso">
      <div className="section__container">

        {/* Título domado y unificado */}
        <div className="section__title testimonials__header">
          <h2>Nuestra Garantía</h2>
          <div className="gold-line"></div>
        </div>

        <div className="testimonials__grid">
          {COMPROMISOS.map((item) => (
            <div key={item.id} className="testimonials__card">
              <span className="material-symbols-outlined testimonials__icon">
                {item.icon}
              </span>
              <h3>{item.title}</h3>
              <p className="testimonials__text">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="testimonials__footer">
          <p>Sumate a la comunidad de <b>Cuyo Cebado</b></p>
        </div>
      </div>
    </section>
  );
}