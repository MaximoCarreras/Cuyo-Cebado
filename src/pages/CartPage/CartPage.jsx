import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    // Estados para cumplir con los requisitos de tu backend (routes/checkout.js)
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
        // Validación previa antes de llamar al servidor
        if (!customer.name || !customer.email) {
            alert("Por favor, ingresá tu nombre y email para procesar el envío.");
            return;
        }

        setIsProcessing(true);

        try {
            // Llamamos a tu API en el puerto 3001 como definiste en index.js
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
                // Redirección directa al Checkout Pro de Mercado Pago
                window.location.href = data.init_point;
            } else {
                alert("Error: " + (data.error || "No se pudo generar el pago. Verificá el stock."));
            }
        } catch (error) {
            console.error("Error en el flujo de pago:", error);
            alert("Hubo un problema de conexión con el servidor de Cuyo Cebado.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="cart-empty section__container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '60px', color: '#ccc' }}>shopping_basket</span>
                <h2>Tu carrito está vacío</h2>
                <p>Parece que todavía no has sumado ningún mate.</p>
                <Link to="/" className="btn btn--gold">Ir a ver productos</Link>
            </div>
        );
    }

    return (
        <div className="cart-page section__container">
            <h1 className="cart-page__title">Tu Carrito</h1>

            <div className="cart-page__grid">
                {/* COLUMNA IZQUIERDA: Ítems del carrito */}
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

                {/* COLUMNA DERECHA: Resumen y Formulario de Pago */}
                <aside className="cart-summary">
                    <div className="summary-card">
                        <h3>Resumen del pedido</h3>

                        {/* Datos del cliente requeridos por el backend */}
                        <div className="checkout-fields" style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>DATOS DE ENVÍO</p>
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                value={customer.name}
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a2a', color: 'white' }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={customer.email}
                                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2a2a2a', color: 'white' }}
                            />
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Envío</span>
                            <span className="text-free">Gratis</span>
                        </div>

                        <hr style={{ borderColor: '#444', margin: '15px 0' }} />

                        <div className="summary-row total">
                            <span>Total</span>
                            <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '1.4rem' }}>
                                {formatCurrency(cartTotal)}
                            </span>
                        </div>

                        <button
                            className="btn-mercadopago"
                            onClick={handleCheckoutMP}
                            disabled={isProcessing}
                            style={{ opacity: isProcessing ? 0.7 : 1 }}
                        >
                            <img
                                src="https://logotipous.com/wp-content/uploads/2019/02/mercado-pago-logo.png"
                                alt="MP"
                                className="mp-logo-icon"
                            />
                            {isProcessing ? "Procesando..." : "Pagar con Mercado Pago"}
                        </button>
                    </div>

                    <Link to="/" className="continue-shopping">
                        ← Seguir comprando
                    </Link>
                </aside>
            </div>
        </div>
    );
}