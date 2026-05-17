import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './CartPage.css';

// Importación de los Logos Oficiales
import mpLogo from '../../assets/mp-logo.png';
import meLogo from '../../assets/me-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [dbCategories, setDbCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado simplificado: Solo datos esenciales de contacto
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

    // 🚀 CONTROLADOR DE CHECKOUT TOTALMENTE AUTOMÁTICO 🚀
    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Conecta al backend (Render en producción / localhost en desarrollo)
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

            // Enviamos el carrito junto con el nombre y el email requeridos
            const response = await fetch(`${baseUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    name: orderData.name,
                    email: orderData.email
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falla al inicializar la pasarela.');
            }

            toast.success("Redirigiendo a Mercado Pago...");

            // 🛡️ Redirección blindada ante minificación
            setTimeout(() => {
                try {
                    if (typeof clearCart === 'function') {
                        clearCart();
                    }
                } catch (contextError) {
                    console.warn("Aviso: No se pudo vaciar el carrito automáticamente, redirigiendo igual.", contextError);
                }

                // Salto directo a la pasarela externa de Mercado Pago
                window.location.href = data.init_point;
            }, 1500);

        } catch (err) {
            console.error("Error en el flujo de checkout:", err);
            toast.error(err.message || "No se pudo conectar con el servidor de pagos.");
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

                {/* COLUMNA DERECHA: FORMULARIO PREMIUM DE CLIENTE */}
                <aside className="cart-checkout-sidebar">
                    <form className="checkout-form-premium" onSubmit={handleCheckout}>
                        <h3>Datos del Comprador</h3>

                        <div className="form-inputs-group">
                            <input type="text" placeholder="Nombre completo" required value={orderData.name} onChange={e => setOrderData({ ...orderData, name: e.target.value })} />

                            <input type="email" placeholder="Correo electrónico" required value={orderData.email} onChange={e => setOrderData({ ...orderData, email: e.target.value })} />

                            <input type="tel" placeholder="WhatsApp de contacto" required value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />

                            {/* BANNER INFORMATIVO DE LOGÍSTICA INTEGRADA AUTOMÁTICA */}
                            <div className="mercado-envios-header-badge" style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                backgroundColor: '#fff159',
                                padding: '12px 16px', borderRadius: '14px', marginBottom: '15px',
                                border: '1.5px solid #ebd432',
                                boxShadow: '0 4px 12px rgba(255, 241, 89, 0.25)',
                                marginTop: '10px'
                            }}>
                                <img src={meLogo} alt="Mercado Envíos" style={{ height: '24px', width: 'auto' }} />
                                <span style={{ fontSize: '0.74rem', fontWeight: '900', color: '#1a1614', letterSpacing: '0.5px' }}>
                                    ENVÍO CALCULADO EN EL PRÓXIMO PASO
                                </span>
                            </div>

                            <textarea
                                className="notes-box"
                                placeholder="Notas o pedido de grabado (Opcional)"
                                value={orderData.notes}
                                onChange={e => setOrderData({ ...orderData, notes: e.target.value })}
                            />
                        </div>

                        {/* RESUMEN DE COMPRA */}
                        <div className="total-summary-card">
                            <div className="t-row main-total">
                                <span>PRODUCTOS</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                            <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '10px', textAlign: 'center', fontWeight: '700', lineHeight: '1.4' }}>
                                📌 Vas a poder elegir recibir a domicilio por correo o retirar gratis por el local directamente en la pantalla de pago.
                            </p>
                        </div>

                        {/* BOTÓN CELESTE OFICIAL DE MERCADO PAGO */}
                        <button
                            type="submit"
                            className="btn-mercadopago-pro"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '18px',
                                backgroundColor: '#009EE3',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '14px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: '0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                marginTop: '20px',
                                boxShadow: '0 4px 15px rgba(0, 158, 227, 0.2)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0086c3'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#009EE3'}
                        >
                            {loading ? 'Procesando...' : (
                                <>
                                    <img
                                        src={mpLogo}
                                        alt="MP"
                                        className="mp-icon-final"
                                        style={{
                                            height: '28px',
                                            width: 'auto',
                                            filter: 'none',
                                            display: 'block'
                                        }}
                                    />
                                    PAGAR CON MERCADO PAGO
                                </>
                            )}
                        </button>

                        <div className="secure-footer-real">
                            <span className="material-symbols-outlined">verified_user</span>
                            Logística y Pago protegidos oficialmente
                        </div>
                    </form>
                </aside>
            </div>
        </section>
    );
}