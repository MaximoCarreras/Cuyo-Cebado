import { Link } from 'react-router-dom';
import './CheckoutStatus.css';

export default function FailurePage() {
    return (
        <div className="status-page">
            <div className="status-card failure">
                <span className="material-symbols-outlined status-icon">error</span>
                <h1>Ups... algo falló</h1>
                <p>No pudimos procesar el pago. Puede ser un error de la tarjeta o del sistema de Mercado Pago.</p>
                <div className="order-details">
                    <p>No te preocupes, los productos siguen en tu carrito esperando por vos.</p>
                </div>
                <div className="status-actions">
                    <Link to="/carrito" className="btn-status">Reintentar Pago</Link>
                    <Link to="/" className="btn-status secondary">Ir al Inicio</Link>
                </div>
            </div>
        </div>
    );
}