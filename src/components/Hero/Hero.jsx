import './Hero.css';
// IMPORTANTE: Asegurate de que el nombre del archivo coincida exactamente con el tuyo
import heroMateImg from '../../assets/hero_mate_grande.png'; 

export default function Hero() {
  return (
    <section className="hero" id="hero">
      
      {/* 
        AQUÍ ESTÁ LA SOLUCIÓN:
        Inyectamos la imagen directamente mediante la propiedad 'style'
      */}
      <div 
        className="hero__image-bg"
        style={{ backgroundImage: `url(${heroMateImg})` }}
      ></div>

      {/* Capa que dibuja la curva marrón oscuro */}
      <div className="hero__shape"></div>

      {/* Contenedor del texto */}
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
