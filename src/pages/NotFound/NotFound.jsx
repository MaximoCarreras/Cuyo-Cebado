import { Link } from 'react-router-dom';
import SpotlightCard from '../../Animations/SpotlightCard'; // Llamamos al efecto que ya tenés
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      {/* Envolvemos la tarjeta en tu SpotlightCard */}
      <SpotlightCard className="notfound-card-wrapper" spotlightColor="rgba(165, 129, 58, 0.15)">
        <div className="notfound-content">
          <div className="notfound-logo">🧉</div>
          <h1 className="notfound-title">¡Oops! Este mate se lavó.</h1>
          <div className="gold-line"></div>
          <p className="notfound-text">
            La página que buscás parece que no existe o cambió de lugar.
            <br />No te preocupes, hay yerba fresca en el inicio.
          </p>
          <Link to="/" className="btn-notfound">
            <span className="material-symbols-outlined">home</span>
            Volver al Inicio
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
}