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
          color1="#140d07"   /* Base casi negra */
          color2="#3e2715"   /* Marrón nogal vivo */
          color3="#26170d"   /* Sombra de madera */
          timeSpeed={0.18}
          colorBalance={0}
          warpStrength={1.5}
          warpFrequency={3}
          warpSpeed={1.2}
          warpAmplitude={40}
          blendAngle={0}
          blendSoftness={0.4} /* Mezcla más suave para que parezcan vetas */
          rotationAmount={100}
          noiseScale={1.5}
          grainAmount={0.06}
          grainScale={1.5}
          grainAnimated={true}
          contrast={1.2}      /* Contraste equilibrado */
          gamma={1}
          saturation={0.8}
          zoom={1}
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