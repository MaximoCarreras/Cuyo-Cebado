import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './CartPage.css';

import mpLogo from '../../assets/mp-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [dbCategories, setDbCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado simplificado: Solo datos de contacto esenciales
    const [orderData, setOrderData] = useState({
        name: '', email: '', phone: '', notes: ''
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

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const fixedAddress = 'RETIRO EN LOCAL: CÓDIGO VINARIO (Av. Colón 701)';

            // 1. Guardamos la orden fija como Retiro en Supabase
            const { error: dbError } = await supabase.from('orders').insert([{
                customer_email: orderData.email,
                customer_name: orderData.name,
                customer_phone: orderData.phone,
                shipping_method: 'pickup',
                shipping_address: fixedAddress,
                total: cartTotal,
                items: cart,
                status: 'pending'
            }]);

            if (dbError) throw dbError;

            // 2. Solicitamos el link a Mercado Pago enviando costo de envío en 0
            const response = await fetch(`${baseUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    name: orderData.name,
                    email: orderData.email,
                    shippingCost: 0
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falla al inicializar la pasarela.');
            }

            toast.success("Redirigiendo a Mercado Pago...");

            setTimeout(() => {
                try {
                    if (typeof clearCart === 'function') {
                        clearCart();
                    }
                } catch (err) {
                    console.warn(err);
                }
                window.location.href = data.init_point;
            }, 1500);

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error al procesar el pago.");
            setLoading(false);
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <section className="cart-page-empty-container">
                <div className="cart-empty-content">
                    <span className="material-symbols-outlined empty-icon">shopping_basket</span>
                    <h2 className="empty-title">Tu carrito está vacío</h2>
                    <p className="empty-subtitle">Parece que todavía no elegiste tu próximo compañero de rutas.</p>
                    <Link to="/productos" className="btn-gold-empty">EXPLORAR PRODUCTOS</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="cart-page-modern">
            <Toaster position="top-center" />
            <div className="cart-container-pro">

                {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
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
                                        <button type="button" className="remove-link" onClick={() => { if (window.confirm("¿Quitar?")) removeFromCart(item.id) }}>Eliminar</button>
                                    </div>
                                </div>
                                <div className="item-price">{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA: FORMULARIO EXCLUSIVO RETIRO */}
                <aside className="cart-checkout-sidebar">
                    <form className="checkout-form-premium" onSubmit={handleCheckout}>
                        <h3>Datos para el Retiro</h3>

                        <div className="form-inputs-group">
                            <input type="text" placeholder="Nombre completo" required value={orderData.name} onChange={e => setOrderData({ ...orderData, name: e.target.value })} />
                            <input type="email" placeholder="Correo electrónico" required value={orderData.email} onChange={e => setOrderData({ ...orderData, email: e.target.value })} />
                            <input type="tel" placeholder="WhatsApp de contacto" required value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />

                            {/* TARJETA VISUAL DE CÓDIGO VINARIO */}
                            <div className="pickup-info-card animate-fade" style={{ marginTop: '5px', marginBottom: '15px' }}>
                                <div className="pickup-header">
                                    <span className="material-symbols-outlined">store</span>
                                    <div>
                                        <h4>Código Vinario</h4>
                                        <p>Punto de Retiro Oficial</p>
                                    </div>
                                </div>
                                <div className="pickup-details">
                                    <p>📍 Av. Colón 701, Mendoza Capital</p>
                                    <p>⏰ Lun a Sáb: 10:00 a 22:00</p>
                                </div>
                            </div>

                            <textarea className="notes-box" placeholder="Notas o pedido de grabado (Opcional)" value={orderData.notes} onChange={e => setOrderData({ ...orderData, notes: e.target.value })} />
                        </div>

                        {/* RESUMEN DEL TICKET */}
                        <div className="total-summary-card">
                            <div className="t-row main-total">
                                <span>TOTAL</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '12px', textAlign: 'center', fontWeight: '600' }}>
                                🛍️ Pagás online de forma segura y retiras por el local cuando quieras.
                            </p>
                        </div>

                        {/* BOTÓN CELESTE MERCADO PAGO */}
                        <button type="submit" className="btn-mercadopago-pro" disabled={loading}>
                            {loading ? 'Procesando...' : (
                                <>
                                    <img src={mpLogo} alt="MP" style={{ height: '28px', width: 'auto' }} />
                                    PAGAR CON MERCADO PAGO
                                </>
                            )}
                        </button>
                    </form>
                </aside>
            </div>
        </section>
    );
}