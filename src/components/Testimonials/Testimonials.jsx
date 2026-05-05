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
    icon: 'terrain', // Este es el nombre correcto para el icono de montañas
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
        <h2 className="section__title">Nuestra Garantía</h2>
        
        <div className="testimonials__grid">
          {COMPROMISOS.map((item) => (
            <div key={item.id} className="testimonial__card">
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#c5a059', marginBottom: '1rem' }}>
                {item.icon}
              </span>
              <h3 style={{ marginBottom: '0.5rem', color: '#2d1b0d' }}>{item.title}</h3>
              <p className="testimonial__text" style={{ fontStyle: 'normal' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Eliminamos el contador de 4.9 estrellas por ahora para ser honestos */}
        <div className="testimonials__footer">
          <p>Sumate a la comunidad de <b>Cuyo Cebado</b></p>
        </div>
      </div>
    </section>
  );
}
