import React from 'react';
import './OurStory.css';
// Importá una foto que represente el espíritu de la marca
import storyImage from '../../assets/historia-cuyo.png';

export default function OurStory() {
  return (
    <section className="ourstory" id="nuestra-historia">
      <div className="ourstory__container section__container">

        {/* Lado Izquierdo: Imagen */}
        <div className="ourstory__image">
          <img src={storyImage} alt="Mates artesanales de Cuyo Cebado" />
          <div className="ourstory__image-badge">Artesanal</div>
        </div>

        {/* Lado Derecho: Texto */}
        <div className="ourstory__content">
          <span className="ourstory__overline">Desde el corazón de Cuyo</span>
          <h2 className="ourstory__title">Nuestra Historia</h2>

          <p>
            <b>Cuyo Cebado</b> nació de una charla entre dos amigos, uno de Mendoza y otro de San Luis,
            con una idea clara: encontrar el mate que nos represente. Lo que empezó como un proyecto para
            generar nuestro propio camino, se convirtió en una búsqueda por la <b>calidad artesanal</b>.
          </p>

          <p>
            No somos una corporación, somos un emprendimiento que está naciendo. Por eso, nos tomamos
            el tiempo de <b>seleccionar personalmente cada pieza</b>. Estamos en la etapa de buscar y
            elegir a los mejores artesanos de nuestra región, asegurándonos de que cada mate que llegue
            a tus manos sea el mismo que elegiríamos para nosotros.
          </p>

          <p>
            Nuestra misión es simple: unir la tradición de nuestra tierra con el ritual diario de compartir un mate.
            Creemos en la transparencia y en el valor del esfuerzo compartido. <b>Gracias por ser parte de este comienzo.</b>
          </p>
        </div>

      </div>
    </section>
  );
}