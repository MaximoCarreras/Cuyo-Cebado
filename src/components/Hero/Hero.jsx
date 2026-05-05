// src/components/Hero/Hero.jsx (Código propuesto)
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* NO IMPORTAMOS LA IMAGEN COMO ELEMENTO <img>.
        La vamos a poner como fondo en el CSS para máximo impacto.
      */}
      <div className="hero__overlay"></div> {/* Capa oscura sutil para que el texto se lea bien */}
      
      <div className="hero__container section__container">
        <div className="hero__content">
          <h1 className="hero__title">
            Mates <br />
            con <br />
            <b>Identidad</b>
          </h1>
          
          <p className="hero__subtitle">
            Curaduría premium de mates imperiales tallados a mano en Mendoza. 
            🏔️ Una pieza de arte en cada cebada.
          </p>

          <div className="hero__actions">
            <a href="#productos" className="btn btn--gold">
              Ver Catálogo
            </a>
            {/* El botón de WhatsApp lo mantenemos, pero lo estilizamos como el de "Ver Guía" que borramos antes, con borde dorado */}
            <a 
              href="https://wa.me/5492625597956?text=Hola!%20Vengo%20desde%20la%20web%20y%20quiero%20consultar%20por%20un%20mate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn--outline-gold"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
