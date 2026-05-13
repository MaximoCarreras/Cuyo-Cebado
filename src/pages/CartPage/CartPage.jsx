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
            toast.error("Error al procesar pedido.");
        } else {
            const businessPhone = "5492612307516";
            const orderId = data[0].id.slice(0, 5).toUpperCase();

            let message = `*¡Hola Cuyo Cebado!* 👋%0A`;
            message += `Soy *${orderData.name}* y realicé el pedido *#${orderId}* en la web.%0A%0A`;
            message += `*Detalle:*%0A`;
            cart.forEach(item => {
                message += `- ${item.quantity}x ${item.name} (${formatCurrency(item.price * item.quantity)})%0A`;
            });
            if (orderData.notes) message += `%0A*Notas:* ${orderData.notes}%0A`;
            message += `%0A*Total:* ${formatCurrency(cartTotal)}%0A`;
            message += `*Entrega:* ${orderData.method === 'pickup' ? 'Retiro en local' : 'Envío a domicilio'}%0A%0A`;
            message += `_Espero el link de Mercado Pago o datos de transferencia para abonar._`;

            window.open(`https://wa.me/${businessPhone}?text=${message}`, '_blank');
            clearCart();
            navigate('/');
        }
        setLoading(false);
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

                {/* IZQUIERDA: LISTA DE PRODUCTOS */}
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
                                        <button type="button" className="remove-link" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                    </div>
                                </div>
                                <div className="item-price">{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DERECHA: FINALIZAR COMPRA */}
                <aside className="cart-checkout-sidebar">
                    <form className="checkout-form-premium" onSubmit={handleCheckout}>
                        <h3>Finalizar Compra</h3>

                        <div className="shipping-selector">
                            <button type="button" className={orderData.method === 'shipment' ? 'active' : ''} onClick={() => setOrderData({ ...orderData, method: 'shipment' })}>🚚 Envío</button>
                            <button type="button" className={orderData.method === 'pickup' ? 'active' : ''} onClick={() => setOrderData({ ...orderData, method: 'pickup' })}>🏠 Retiro</button>
                        </div>

                        <div className="form-inputs-group">
                            <input type="text" placeholder="Nombre completo" required value={orderData.name} onChange={e => setOrderData({ ...orderData, name: e.target.value })} />
                            <input type="tel" placeholder="WhatsApp (Ej: 261...)" required value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />

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
                                        <p>📞 0261 238-1448</p>
                                    </div>
                                    <a href="https://maps.app.goo.gl/PDJvJejLZzuwN4Cu9\ntelefono" target="_blank" rel="noreferrer" className="btn-maps">
                                        <span className="material-symbols-outlined">map</span> Ver en Google Maps
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
                            <div className="payment-icons-row">
                                <span>Aceptamos:</span>
                                <div className="icons-flex">
                                    <img src="https://img.icons8.com/color/48/mercadopago.png" alt="MP" />
                                    <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
                                    <img src="https://img.icons8.com/color/48/mastercard.png" alt="Master" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-confirm-order" disabled={loading}>
                            {loading ? 'PROCESANDO...' : 'PAGAR POR WHATSAPP 🧉'}
                        </button>
                    </form>
                </aside>
            </div>
        </section>
    );
}