import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-card-wrapper" style={{ background: '#fff', padding: '20px', borderRadius: '24px' }}>
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
      </div>
    </div>
  );
}