import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

// Importamos el logo local que bajaste
import mpLogo from '../../assets/mp-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    // Datos del cliente para la orden en Supabase
    const [customer, setCustomer] = useState({ name: '', email: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleCheckoutMP = async () => {
        if (!customer.name || !customer.email) {
            alert("Por favor, completá tu nombre y email para preparar el pedido.");
            return;
        }

        setIsProcessing(true);
        try {
            // Llamada a tu servidor local en el puerto 3001
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
                // Redirección al sitio seguro de Mercado Pago
                window.location.href = data.init_point;
            } else {
                alert("Error al generar el pago. Revisá el stock en el servidor.");
            }
        } catch (error) {
            console.error("Error en checkout:", error);
            alert("Error de conexión. ¿Tenés el servidor de Node prendido?");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="cart-empty section__container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '60px', color: '#ccc' }}>shopping_basket</span>
                <h2>Tu carrito está vacío</h2>
                <Link to="/" className="btn btn--gold">Ir a ver productos</Link>
            </div>
        );
    }

    return (
        <div className="cart-page section__container">
            <h1 className="cart-page__title">Tu Carrito</h1>

            <div className="cart-page__grid">
                {/* Lista de Productos */}
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
                                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                </div>
                            </div>
                            <div className="cart-item__subtotal">{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                    ))}
                </div>

                {/* Resumen de Compra */}
                <aside className="cart-summary">
                    <div className="summary-card">
                        <h3>Resumen del pedido</h3>

                        <div className="checkout-fields">
                            <h4 className="fields-title">Tus datos</h4>
                            <div className="customer-form-group">
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={customer.name}
                                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    className="cart-input-dark"
                                />
                            </div>
                            <div className="customer-form-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={customer.email}
                                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                    className="cart-input-dark"
                                />
                            </div>
                        </div>

                        <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
                        <div className="summary-row"><span>Envío</span><span className="text-free">Gratis</span></div>

                        <hr className="summary-divider" />

                        <div className="summary-row total">
                            <span>Total</span>
                            <span className="total-amount">{formatCurrency(cartTotal)}</span>
                        </div>

                        <button className="btn-mercadopago" onClick={handleCheckoutMP} disabled={isProcessing}>
                            <img src={mpLogo} alt="" className="mp-icon-local" />
                            <span>{isProcessing ? "PROCESANDO..." : "PAGAR CON MERCADO PAGO"}</span>
                        </button>
                    </div>
                    <Link to="/" className="continue-shopping">← Seguir comprando</Link>
                </aside>
            </div>
        </div>
    );
}