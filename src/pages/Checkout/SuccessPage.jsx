import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CheckoutStatus.css';

export default function SuccessPage() {
    const { clearCart } = useCart();

    // Cuando llega acá, vaciamos el carrito automáticamente
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="status-page">
            <div className="status-card success">
                <span className="material-symbols-outlined status-icon">check_circle</span>
                <h1>¡Pedido Confirmado!</h1>
                <p>Tu pago fue procesado con éxito. Ya estamos preparando tu pedido para que llegue pronto a tu casa.</p>
                <div className="order-details">
                    <p>Te enviamos un mail con el detalle de la compra.</p>
                </div>
                <Link to="/" className="btn-status">Volver al Inicio</Link>
            </div>
        </div>
    );
}