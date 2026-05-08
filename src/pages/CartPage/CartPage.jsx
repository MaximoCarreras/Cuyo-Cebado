import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css'; // <--- ACÁ ESTABA EL ERROR, YA ESTÁ ARREGLADO

// Importamos el logo de Mercado Pago
import mpLogo from '../../assets/mp-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
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
                <div className="cart-empty">
                    <span className="material-symbols-outlined cart-empty__icon">shopping_basket</span>
                    <h2 className="cart-empty__title">Tu carrito está vacío</h2>
                    <p className="cart-empty__text">Parece que todavía no elegiste tu próximo compañero de rutas.</p>
                    <Link to="/productos" className="btn-gold-link">Explorar Productos</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <div className="cart-container">

                <div className="cart-header">
                    <h2>Tu Pedido Cuyo</h2>
                    <div className="gold-line"></div>
                </div>

                <div className="cart-page__grid">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item__image">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} />
                                    ) : (
                                        <div className="item-img-placeholder">🧉</div>
                                    )}
                                </div>

                                <div className="cart-item__info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item__material">{item.material || "Artesanal"}</p>
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
                                <div className="cart-item__subtotal">
                                    {formatCurrency(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="cart-summary">
                        <div className="summary-card">
                            <h3>Resumen de Compra</h3>

                            <span className="fields-title">Datos del Matero</span>
                            <div className="customer-form-group">
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={customer.name}
                                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    className="cart-input-dark"
                                />
                                <input
                                    type="email"
                                    placeholder="Tu mejor Email"
                                    value={customer.email}
                                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                    className="cart-input-dark"
                                />
                            </div>

                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Envío</span>
                                    <span className="text-free">¡Sin costo!</span>
                                </div>
                            </div>

                            <hr className="summary-divider" />

                            <div className="summary-row total">
                                <span>TOTAL</span>
                                <span className="total-amount">{formatCurrency(cartTotal)}</span>
                            </div>

                            <button
                                className="btn-mercadopago"
                                onClick={handleCheckoutMP}
                                disabled={isProcessing}
                            >
                                <img src={mpLogo} alt="MP" className="mp-icon-local" />
                                <span>{isProcessing ? "Procesando..." : "Finalizar Compra"}</span>
                            </button>

                            <p className="secure-payment">
                                <span className="material-symbols-outlined">shield</span>
                                Pago 100% seguro con Mercado Pago
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}