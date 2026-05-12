import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { categories } from '../../data/products'; // Necesario para los emojis
import './CartPage.css';
import mpLogo from '../../assets/mp-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [customer, setCustomer] = useState({ name: '', email: '' });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Función para obtener el emoji según la categoría
    const getCategoryIcon = (categorySlug) => {
        const cat = categories.find(c => c.id === categorySlug);
        return cat ? cat.icon : '🧉';
    };

    if (!cart || cart.length === 0) {
        return (
            <section className="cart-page">
                <div className="cart-empty-mafia">
                    <span className="material-symbols-outlined cart-empty__icon">shopping_basket</span>
                    <h2 className="cart-empty__title">Tu carrito está vacío</h2>
                    <p className="cart-empty__text">Parece que todavía no elegiste tu próximo compañero de rutas.</p>
                    <Link to="/productos" className="btn-gold-link-mafia">Explorar Productos</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <div className="cart-container">
                <div className="cart-header-mafia">
                    <h2>Tu Pedido Cuyo</h2>
                    <div className="gold-divider-mafia"></div>
                </div>

                <div className="cart-page__grid">
                    <div className="cart-items-mafia">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item-mafia">
                                <div className="cart-item__img-box">
                                    {/* Placeholder estético con Emoji */}
                                    <span className="cart-item-emoji">{getCategoryIcon(item.category)}</span>
                                </div>

                                <div className="cart-item__details">
                                    <div className="cart-item__header">
                                        <p className="cart-item__material-tag">{item.material || "Artesanal"}</p>
                                        <h3>{item.name}</h3>
                                    </div>

                                    <div className="cart-item__actions-mafia">
                                        <div className="qty-control-mafia">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                                            <span className="qty-val">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="btn-remove-mafia" onClick={() => removeFromCart(item.id)}>
                                            <span className="material-symbols-outlined">delete</span> Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item__pricing">
                                    <p className="unit-price-label">{formatCurrency(item.price)} c/u</p>
                                    <p className="item-subtotal-mafia">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="cart-sidebar-mafia">
                        <div className="summary-card-mafia">
                            <h3>Resumen de Compra</h3>

                            <div className="checkout-fields">
                                <span className="fields-title-mafia">Datos del Matero</span>
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={customer.name}
                                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    className="input-mafia-dark"
                                />
                                <input
                                    type="email"
                                    placeholder="Tu mejor Email"
                                    value={customer.email}
                                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                    className="input-mafia-dark"
                                />
                            </div>

                            <div className="summary-rows">
                                <div className="s-row"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
                                <div className="s-row"><span>Envío</span><span className="free-shipping">¡Sin costo!</span></div>
                                <hr className="s-divider" />
                                <div className="s-row total-row">
                                    <span>TOTAL</span>
                                    <span className="total-gold-mafia">{formatCurrency(cartTotal)}</span>
                                </div>
                            </div>

                            <button className="btn-mp-mafia-disabled" disabled>
                                <img src={mpLogo} alt="MP" className="mp-icon-mini" />
                                <span>Lanzamiento próximamente</span>
                            </button>

                            <p className="secure-badge-mafia">
                                <span className="material-symbols-outlined">verified_user</span>
                                Pago seguro con Mercado Pago
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}