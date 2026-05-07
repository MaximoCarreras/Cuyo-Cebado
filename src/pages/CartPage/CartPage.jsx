import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

// Importamos el logo
import mpLogo from '../../assets/mp-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [customer, setCustomer] = useState({ name: '', email: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency', currency: 'ARS', minimumFractionDigits: 0,
        }).format(value);
    };

    const handleCheckoutMP = async () => {
        if (!customer.name || !customer.email) {
            alert("Por favor, completá tus datos para continuar.");
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch("http://localhost:3001/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    name: customer.name,
                    email: customer.email
                }),
            });

            const data = await response.json();
            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                alert("Error del servidor: " + (data.error || "No se generó el pago"));
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión. ¿Tenés el servidor de Node prendido?");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <section className="cart-page">
                <div className="section__container cart-empty">
                    <span className="material-symbols-outlined cart-empty__icon">shopping_basket</span>
                    <h2 className="cart-empty__title">Tu carrito está vacío</h2>
                    <Link to="/" className="btn btn--gold">Ir a ver productos</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <div className="section__container">

                {/* Título unificado con la línea dorada */}
                <div className="section__title cart__header">
                    <h2>Tu Carrito</h2>
                    <div className="gold-line"></div>
                </div>

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

                                    <div className="cart-item__actions">
                                        <div className="quantity-selector">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span className="qty-number">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                                            <span className="material-symbols-outlined">delete</span>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item__subtotal">{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>

                    <aside className="cart-summary">
                        <div className="summary-card">
                            <h3>Resumen del pedido</h3>
                            <span className="fields-title">Tus datos</span>
                            <div className="customer-form-group">
                                <input
                                    type="text" placeholder="Nombre completo" value={customer.name}
                                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    className="cart-input-dark"
                                />
                            </div>
                            <div className="customer-form-group">
                                <input
                                    type="email" placeholder="Email" value={customer.email}
                                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                    className="cart-input-dark"
                                />
                            </div>

                            <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
                            <div className="summary-row"><span>Envío</span><span className="text-free">Gratis</span></div>
                            <hr style={{ borderColor: 'rgba(253, 250, 247, 0.1)', margin: '20px 0' }} />
                            <div className="summary-row total">
                                <span>Total</span>
                                <span className="total-amount">{formatCurrency(cartTotal)}</span>
                            </div>

                            <button className="btn-mercadopago" onClick={handleCheckoutMP} disabled={isProcessing}>
                                <img src={mpLogo} alt="MP" className="mp-icon-local" />
                                <span>{isProcessing ? "PROCESANDO..." : "PAGAR CON MERCADO PAGO"}</span>
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}