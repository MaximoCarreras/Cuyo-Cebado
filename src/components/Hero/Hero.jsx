import { useEffect, useState } from 'react';
import './Hero.css';
import heroBgImage from '../../assets/fondo_hero_principal.png';
import Grainient from '../Backgrounds/Grainient';

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
      {/* 1. Capa de imagen con la máscara de degradado aplicada en CSS */}
      <div
        className="hero__image-bg"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      ></div>

      {/* 2. Capa del fondo de madera animada (React Bits) */}
      <div className="hero__shape">
        <Grainient
          color1="#140d07"
          color2="#3e2715"
          color3="#26170d"
          timeSpeed={0.18}
          warpStrength={1.5}
          warpFrequency={3}
          warpSpeed={1.2}
          rotationAmount={100}
          noiseScale={1.5}
          grainAmount={0.06}
          grainAnimated={true}
          zoom={1}
          className="hero__grainient"
        />
      </div>

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