import SpotlightCard from '../Animations/SpotlightCard';
import './OurStory.css';

export default function OurStory() {
  return (
    <section className="ourstory ourstory--light" id="nuestra-historia">
      <div className="section__container">

        <SpotlightCard className="ourstory__card" spotlightColor="rgba(165, 129, 58, 0.3)">
          <div className="ourstory__content">
            <span className="ourstory__overline">Nuestra Identidad</span>

            {/* Título ahora con tamaño controlado */}
            <h2 className="ourstory__title">Nuestra Historia</h2>

            {/* Divisor dorado para mantener la coherencia con el resto de la web */}
            <div className="gold-line gold-line--small"></div>

            <div className="ourstory__text">
              <p>
                <b>Cuyo Cebado</b> nació de una charla entre dos amigos con una idea clara:
                encontrar el mate que nos represente. Lo que empezó como un proyecto personal
                se convirtió en una búsqueda por la <b>calidad artesanal</b>.
              </p>
              <p>
                Seleccionamos personalmente cada pieza, asegurándonos de que cada mate que llegue
                a tus manos sea el mismo que elegiríamos para nosotros. Unimos la tradición de
                nuestra tierra con el ritual diario de compartir.
              </p>
              <p className="ourstory__thanks">
                <b>Gracias por ser parte de este comienzo.</b>
              </p>
            </div>
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
}