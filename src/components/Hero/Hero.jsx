import './Hero.css';
import heroBgImage from '../../assets/fondo_hero_principal.png';
import Grainient from '../Backgrounds/Grainient'; // Asegurate de que la ruta coincida con donde creaste el archivo

export default function Hero() {
  return (
    <section className="hero" id="hero">

      {/* 1. Capa de la imagen (Conectada a tu archivo local) */}
      <div
        className="hero__image-bg"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      ></div>

      {/* 2. Capa que dibuja la gran curva marrón oscuro (AHORA CON ANIMACIÓN) */}
      <div className="hero__shape">
        <Grainient
          color1="#1a0f0a"   /* Base oscura cálida */
          color2="#542e14"   /* Marrón cuero intenso */
          color3="#331b0c"   /* Tono intermedio de transición */
          timeSpeed={0.20}
          colorBalance={0}
          warpStrength={2}
          warpFrequency={4}
          warpSpeed={1.5}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.3}
          rotationAmount={150}
          noiseScale={1.2}
          grainAmount={0.05}
          grainScale={1.5}
          grainAnimated={true}
          contrast={1.3}
          gamma={1.1}
          saturation={0.9}
          zoom={1.1}
          className="hero__grainient"
        />
      </div>

      {/* 3. Contenedor del texto (Superpuesto a la curva) */}
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