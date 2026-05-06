import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    // Estados para los datos necesarios del cliente
    const [customer, setCustomer] = useState({ name: '', email: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency', currency: 'ARS', minimumFractionDigits: 0,
        }).format(value);
    };

    // Función principal de pago
    const handleCheckoutMP = async () => {
        // Validación sutil antes de intentar pagar
        if (!customer.name || !customer.email) {
            alert("Por favor, completá tu nombre y email para preparar el despacho.");
            return;
        }

        setIsProcessing(true);
        try {
            // Llamada al backend en localhost para LOCALHOST testing
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

            if (!response.ok) {
                throw new Error(data.error || "Error al crear la orden");
            }

            // Si el servidor nos devuelve el link, redirigimos
            if (data.init_point) {
                console.log("Redirigiendo a:", data.init_point);
                window.location.href = data.init_point;
            }

        } catch (error) {
            console.error("Error completo en checkout:", error);
            alert(`Logística: ${error.message}. Revisá la terminal del servidor.`);
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
                {/* COLUMNA IZQUIERDA: Tarjetas blancas de productos */}
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

                {/* COLUMNA DERECHA: Tarjeta oscura premium (Resumen) */}
                <aside className="cart-summary">
                    <div className="summary-card">
                        <h3>Resumen del pedido</h3>

                        {/* DISEÑO PREMIUM DE INPUTS: Integrados con el estilo dorado */}
                        <div className="checkout-fields">
                            <h4>Datos de Despacho</h4>
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

                        <hr style={{ borderColor: '#444', margin: '15px 0' }} />

                        <div className="summary-row total">
                            <span>Total</span>
                            <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '1.4rem' }}>
                                {formatCurrency(cartTotal)}
                            </span>
                        </div>

                        {/* BOTÓN CELESTE CON EL LOGO DE LAS MANOS RESTAURADO */}
                        <button className="btn-mercadopago" onClick={handleCheckoutMP} disabled={isProcessing}>
                            <img
                                src="https://logotipous.com/wp-content/uploads/2019/02/mercado-pago-logo.png"
                                alt="Mercado Pago"
                                className="mp-logo-hands"
                            />
                            {isProcessing ? "Despachando..." : "Pagar con Mercado Pago"}
                        </button>
                    </div>
                    <Link to="/" className="continue-shopping">← Seguir comprando</Link>
                </aside>
            </div>
        </div>
    );
}