import { useEffect, useState } from 'react';
import './Hero.css';
// import Grainient from '../Backgrounds/Grainient'; // Lo apagamos un segundo

export default function Hero() {
  const [viewHeight, setViewHeight] = useState('100svh');

  useEffect(() => {
    const lockHeight = () => {
      if (window.innerWidth <= 900) {
        setViewHeight(`${window.innerHeight}px`);
      } else {
        setViewHeight('100vh');
      }
    };
    lockHeight();
  }, []);

  return (
    <section
      className="hero"
      id="hero"
      style={{ height: viewHeight, minHeight: viewHeight }}
    >
      {/* 🔥 VIDEO DIRECTO (Sin etiqueta source) */}
      <video
        className="hero__video-bg"
        autoPlay
        loop
        muted
        playsInline
        src="/images/video_principal.mp4"
      ></video>

      {/* FONDO DE MADERA APAGADO PARA PROBAR */}
      {/* <div className="hero__shape">
        <Grainient ... />
      </div> 
      */}

      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="text-white">Mates con</span> <br />
            <b>Identidad</b>
          </h1>

          <p className="hero__subtitle">
            Curaduría premium de mates imperiales tallados a mano en Mendoza.
            Una pieza de arte en cada cebada.
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