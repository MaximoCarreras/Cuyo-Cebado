import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // FUNCIÓN DE PAGO: Aquí es donde ocurre la magia con Mercado Pago
    const handleCheckout = async () => {
        console.log("Iniciando pago para:", cart);
        // En el siguiente paso, conectaremos esto con tu backend de Node.js
        // para generar el link real. Por ahora, simula la acción.
        alert("Redirigiendo a la plataforma segura de Mercado Pago...");
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="cart-empty section__container">
                <span className="material-symbols-outlined empty-icon">shopping_basket</span>
                <h2>Tu carrito está vacío</h2>
                <Link to="/" className="btn btn--gold">Ir a ver productos</Link>
            </div>
        );
    }

    return (
        <div className="cart-page section__container">
            <h1 className="cart-page__title">Tu Carrito</h1>

            <div className="cart-page__grid">
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item__image">
                                <img src={item.image_url} alt={item.name} />
                            </div>

                            <div className="cart-item__info">
                                <h3>{item.name}</h3>
                                <p className="cart-item__unit-price">{formatCurrency(item.price)} c/u</p>

                                <div className="cart-item__controls">
                                    <div className="quantity-selector">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="cart-item__subtotal">
                                {formatCurrency(item.price * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="cart-summary">
                    <div className="summary-card">
                        <h3>Resumen del pedido</h3>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>

                        {/* BOTÓN DE MERCADO PAGO */}
                        <button className="btn-mp" onClick={handleCheckout}>
                            <img
                                src="https://logotipous.com/wp-content/uploads/2019/02/mercado-pago-logo.png"
                                alt="Mercado Pago"
                                className="mp-logo-btn"
                            />
                            Pagar con Mercado Pago
                        </button>

                        <p className="cart-notice">
                            <span className="material-symbols-outlined">shield_check</span>
                            Pago procesado por Mercado Pago
                        </p>
                    </div>

                    <Link to="/" className="continue-shopping">
                        ← Seguir comprando
                    </Link>
                </aside>
            </div>
        </div>
    );
}