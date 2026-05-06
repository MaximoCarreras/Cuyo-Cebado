import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [customer, setCustomer] = useState({ name: '', email: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    // Detectamos si estamos en local o en Vercel para saber a qué servidor llamar
    const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : 'https://tu-servidor-desplegado.com'; // Aquí irá tu URL de Render/Railways luego

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency', currency: 'ARS', minimumFractionDigits: 0,
        }).format(value);
    };

    const handleCheckoutMP = async () => {
        if (!customer.name || !customer.email) {
            alert("Por favor, completá tu nombre y email.");
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch(`${API_URL}/api/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart, name: customer.name, email: customer.email }),
            });

            if (!response.ok) throw new Error("Error en el servidor");

            const data = await response.json();
            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch (error) {
            console.error(error);
            alert("Hubo un problema de conexión. ¿Tenés el servidor de Node prendido en el puerto 3001?");
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

                <aside className="cart-summary">
                    <div className="summary-card">
                        <h3>Resumen del pedido</h3>
                        <div className="checkout-fields" style={{ marginBottom: '20px' }}>
                            <input
                                type="text" placeholder="Nombre completo" value={customer.name}
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                className="cart-input"
                            />
                            <input
                                type="email" placeholder="Email" value={customer.email}
                                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                className="cart-input"
                            />
                        </div>
                        <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
                        <div className="summary-row"><span>Envío</span><span className="text-free">Gratis</span></div>
                        <hr style={{ borderColor: '#444', margin: '15px 0' }} />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '1.4rem' }}>{formatCurrency(cartTotal)}</span>
                        </div>

                        <button className="btn-mercadopago" onClick={handleCheckoutMP} disabled={isProcessing}>
                            {/* LOGO MP EN SVG (Más confiable) */}
                            <svg width="25" height="25" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36 24C36 30.6274 30.6274 36 24 36C17.3726 36 12 30.6274 12 24C12 17.3726 17.3726 12 24 12C30.6274 12 36 17.3726 36 24Z" fill="white" />
                                <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="white" strokeWidth="4" />
                            </svg>
                            {isProcessing ? "Procesando..." : "Pagar con Mercado Pago"}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}