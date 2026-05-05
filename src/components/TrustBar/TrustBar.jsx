/**
 * TrustBar — Barra de confianza y beneficios reales de Cuyo Cebado.
 * Fondo oscuro, iconos claros. Ajustado para reflejar atención directa y calidad.
 */
import './TrustBar.css'; // Asegurate de que el nombre del CSS coincida con el tuyo

export default function TrustBar() {
  const trustFeatures = [
    {
      icon: 'local_shipping',
      title: 'Envíos a todo el país',
      desc: 'Despachos seguros desde Cuyo.'
    },
    {
      icon: 'forum',
      title: 'Atención por WhatsApp',
      desc: 'Trato directo y personal.'
    },
    {
      icon: 'handshake',
      title: 'Selección Personal',
      desc: 'Elegimos tu mate con vos.'
    },
    {
      icon: 'workspace_premium',
      title: 'Calidad Artesanal',
      desc: 'Revisión pieza por pieza.'
    }
  ];

  return (
    <section className="trustbar">
      <div className="trustbar__container section__container">
        {trustFeatures.map((feature, index) => (
          <div className="trustbar__item" key={index}>
            <span className="material-symbols-outlined trustbar__icon">
              {feature.icon}
            </span>
            <div className="trustbar__text">
              <h4 className="trustbar__title">{feature.title}</h4>
              {/* Opcional: Si antes no tenías descripción (desc), podés borrar esta línea de abajo */}
              <p className="trustbar__desc">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
