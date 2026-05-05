import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      
      {/* 1. Capa de la imagen (Fondo del lado derecho) */}
      <div className="hero__image-bg"></div>

      {/* 2. Capa que dibuja la gran curva marrón oscuro */}
      <div className="hero__shape"></div>

      {/* 3. Contenedor del texto (Se superpone a la curva) */}
      <div className="hero__container section__container">
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="text-white">Mates con</span> <br />
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
