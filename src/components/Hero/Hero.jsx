import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      
      {/* CAPAS DE FONDO PARA EL EFECTO CURVO */}
      <div className="hero__bg">
        {/* Aquí va la imagen de fondo (Mendoza + Mate) */}
        <div className="hero__image"></div>
        {/* Esta es la capa que genera el color marrón y la curva suave */}
        <div className="hero__curve"></div>
      </div>

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
            <a 
              href="https://wa.me/5492625597956?text=Hola!%20Vengo%20desde%20la%20web" 
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
