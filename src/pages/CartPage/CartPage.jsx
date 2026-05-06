import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
    // 1. Usamos 'cart' y 'cartTotal', que es lo que tu Context realmente exporta
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // 2. IMPORTANTE: Usamos cart.length
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
        <div className="cart-page section__container" style={{ paddingTop: '150px' }}>
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
                                <p>{formatCurrency(item.price)} c/u</p>
                                <div className="cart-item__controls">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                </div>
                            </div>
                            <div className="cart-item__subtotal">
                                {formatCurrency(item.price * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="cart-summary">
                    <div className="summary-card" style={{ background: '#1a1a1a', color: 'white', padding: '20px', borderRadius: '12px' }}>
                        <h3>Resumen</h3>
                        <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Total</span>
                            <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{formatCurrency(cartTotal)}</span>
                        </div>
                        <button className="btn btn--gold" style={{ width: '100%', marginTop: '10px' }}>Continuar compra</button>
                    </div>
                </aside>
            </div>
        </div>
    );
}