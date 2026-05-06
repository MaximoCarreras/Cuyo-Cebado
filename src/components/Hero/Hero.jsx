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
          color1="#0f0a07"   /* Marrón súper oscuro, casi negro (da profundidad) */
          color2="#2c2016"   /* El marrón original de tu marca */
          color3="#3d2a1b"   /* Un tono madera un poco más cálido para el movimiento */
          timeSpeed={0.15}   /* Movimiento lento y elegante */
          colorBalance={0}
          warpStrength={1.5}
          warpFrequency={3}
          warpSpeed={1}
          warpAmplitude={40}
          blendAngle={0}
          blendSoftness={0.6} /* Suavizamos la mezcla para que parezca luz sobre madera */
          rotationAmount={100}
          noiseScale={1.5}
          grainAmount={0.06} /* Grano un pelín más suave para no ensuciar la lectura */
          grainScale={1.5}
          grainAnimated={true}
          contrast={1.1}     /* Contraste ajustado para tonos oscuros */
          gamma={1}
          saturation={0.6}   /* Bajamos la saturación para que quede sobrio, no rojizo */
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