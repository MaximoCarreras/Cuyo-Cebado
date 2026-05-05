import './OurStory.css';

export default function OurStory() {
  return (
    <section className="story section" id="nuestra-historia">
      <div className="story__container section__container">
        <div className="story__content">
          <h2 className="section__title">Nuestra Historia</h2>
          
          <p className="story__text">
            <b>Cuyo Cebado</b> nació de una charla entre dos amigos, uno de Mendoza y otro de San Luis, 
            con una idea clara: encontrar el mate que nos represente. Lo que empezó como un proyecto para 
            generar nuestro propio camino, se convirtió en una búsqueda por la calidad artesanal.
          </p>

          <p className="story__text">
            No somos una gran corporación, somos un emprendimiento que está naciendo. Por eso, nos tomamos 
            el tiempo de <b>seleccionar personalmente cada pieza</b>. Estamos en la etapa de buscar y 
            elegir a los mejores artesanos de nuestra región, asegurándonos de que cada mate que llegue 
            a tus manos sea el mismo que elegiríamos para nosotros.
          </p>

          <p className="story__text">
            Nuestra misión es simple: unir la tradición de Cuyo con el ritual diario de compartir un mate. 
            Creemos en la transparencia y en el valor del esfuerzo compartido. Gracias por ser parte de 
            este comienzo.
          </p>
        </div>
      </div>
    </section>
  );
}
