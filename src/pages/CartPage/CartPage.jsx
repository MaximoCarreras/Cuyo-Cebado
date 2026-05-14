import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './CartPage.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [dbCategories, setDbCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [orderData, setOrderData] = useState({
        name: '', email: '', phone: '', method: 'shipment', address: '', city: '', zip: '', notes: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*');
            if (data) setDbCategories(data);
        };
        fetchCategories();
    }, []);

    const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);
    const getCategoryIcon = (slug) => dbCategories.find(c => c.id === slug)?.icon || '🧉';

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        const shippingAddress = orderData.method === 'pickup'
            ? 'RETIRO EN LOCAL: CÓDIGO VINARIO (Av. Colón 701)'
            : `${orderData.address}, ${orderData.city} (CP: ${orderData.zip})`;

        const { data, error } = await supabase.from('orders').insert([{
            customer_email: orderData.email || 'No proveído',
            customer_name: orderData.name,
            customer_phone: orderData.phone,
            shipping_method: orderData.method,
            shipping_address: shippingAddress,
            total: cartTotal,
            items: cart,
            status: 'pending'
        }]).select();

        if (error) {
            toast.error("Error al procesar el pedido.");
            setLoading(false);
        } else {
            toast.success("Redirigiendo a Mercado Pago...");
            setTimeout(() => {
                clearCart();
                navigate('/pago-exitoso');
            }, 2000);
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <section className="cart-page-empty">
                <span className="material-symbols-outlined">shopping_basket</span>
                <h2>Tu carrito está vacío</h2>
                <Link to="/productos" className="btn-gold-mafia">Explorar Productos</Link>
            </section>
        );
    }

    return (
        <section className="cart-page-modern">
            <Toaster position="top-center" />
            <div className="cart-container-pro">

                <div className="cart-main-content">
                    <div className="cart-header-actions">
                        <h2>Mi Carrito</h2>
                        <Link to="/productos" className="btn-continue-shopping">
                            <span className="material-symbols-outlined">arrow_back</span> Seguir comprando
                        </Link>
                    </div>
                    <div className="cart-items-list">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item-card">
                                <div className="item-img">{getCategoryIcon(item.category)}</div>
                                <div className="item-info">
                                    <p className="item-cat">{item.material || 'Seleccionado'}</p>
                                    <h3>{item.name}</h3>
                                    <div className="item-controls">
                                        <div className="qty-box">
                                            <button type="button" onClick={() => updateQuantity(item.id, -1)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button type="button" onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.stock}>+</button>
                                        </div>
                                        <button type="button" className="remove-link" onClick={() => { if (window.confirm("¿Quitar del carrito?")) removeFromCart(item.id) }}>Eliminar</button>
                                    </div>
                                </div>
                                <div className="item-price">{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="cart-checkout-sidebar">
                    <form className="checkout-form-premium" onSubmit={handleCheckout}>
                        <h3>Finalizar Compra</h3>

                        <div className="shipping-selector">
                            <button type="button" className={orderData.method === 'shipment' ? 'active' : ''} onClick={() => setOrderData({ ...orderData, method: 'shipment' })}>🚚 Envío</button>
                            <button type="button" className={orderData.method === 'pickup' ? 'active' : ''} onClick={() => setOrderData({ ...orderData, method: 'pickup' })}>🏠 Retiro</button>
                        </div>

                        <div className="form-inputs-group">
                            <input type="text" placeholder="Nombre y Apellido" required value={orderData.name} onChange={e => setOrderData({ ...orderData, name: e.target.value })} />
                            <input type="tel" placeholder="WhatsApp de contacto" required value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />

                            {orderData.method === 'shipment' ? (
                                <div className="address-fields animate-fade">
                                    <input type="text" placeholder="Dirección (Calle y N°)" required value={orderData.address} onChange={e => setOrderData({ ...orderData, address: e.target.value })} />
                                    <div className="grid-cp">
                                        <input type="text" placeholder="Ciudad" required value={orderData.city} onChange={e => setOrderData({ ...orderData, city: e.target.value })} />
                                        <input type="text" placeholder="CP" required value={orderData.zip} onChange={e => setOrderData({ ...orderData, zip: e.target.value })} />
                                    </div>
                                </div>
                            ) : (
                                <div className="pickup-info-card animate-fade">
                                    <div className="pickup-header">
                                        <span className="material-symbols-outlined">storefront</span>
                                        <div>
                                            <h4>Código Vinario</h4>
                                            <p>Punto de Retiro Oficial</p>
                                        </div>
                                    </div>
                                    <div className="pickup-details">
                                        <p>📍 Av. Colón 701, Mendoza Capital</p>
                                        <p>⏰ Lun a Sáb: 10:00 a 22:00</p>
                                        <p>📞 261 238-1448</p>
                                    </div>
                                    <a href="https://maps.app.goo.gl/Fk9vFzLzNfWzL1fE9" target="_blank" rel="noreferrer" className="btn-maps-link">
                                        <span className="material-symbols-outlined">distance</span>
                                        VER EN GOOGLE MAPS
                                    </a>
                                </div>
                            )}

                            <textarea
                                className="notes-box"
                                placeholder="Notas o pedido de grabado (Opcional)"
                                value={orderData.notes}
                                onChange={e => setOrderData({ ...orderData, notes: e.target.value })}
                            />
                        </div>

                        <div className="total-summary-card">
                            <div className="t-row main-total">
                                <span>TOTAL</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                        </div>

                        {/* BOTÓN MERCADO PAGO CON LOGO SVG INCORPORADO */}
                        <button type="submit" className="btn-mercadopago-final" disabled={loading}>
                            {loading ? 'Procesando...' : (
                                <>
                                    <svg className="mp-logo-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M37.3 14.7C34.7 12 30.3 12 27.8 14.7L18.4 24.1L12.5 18.2C9.9 15.3 5.4 15.3 2.9 18.2C0.4 21.1 0.4 25.6 2.9 28.4L13.7 39.2C15 40.5 16.6 41.1 18.4 41.1C20.2 41.1 21.8 40.4 23.1 39.2L37.3 25.3C39.9 22.4 39.9 17.6 37.3 14.7Z" fill="white" />
                                        <path d="M43.7 14.7C41.1 12 36.7 12 34.2 14.7L24.8 24.1L23.1 22.4L32.5 13C33.8 11.7 35.5 11.1 37.3 11.1C39.1 11.1 40.7 11.8 42 13C44.6 15.9 44.6 20.4 42 23.2L27.8 37.1C26.5 38.4 24.9 39 23.1 39C21.3 39 19.7 38.3 18.4 37.1L16.7 35.4L31.2 21.2C33.8 18.3 38.2 18.3 40.8 21.2C43.4 24.1 43.4 28.6 40.8 31.4L43.7 34.3C46.3 31.4 46.3 26.9 43.7 24.1L43.7 14.7Z" fill="white" fillOpacity="0.6" />
                                    </svg>
                                    PAGAR CON MERCADO PAGO
                                </>
                            )}
                        </button>

                        <div className="secure-footer">
                            <span className="material-symbols-outlined">shield_check</span>
                            Pago procesado por Mercado Pago
                        </div>
                    </form>
                </aside>
            </div>
        </section>
    );
}