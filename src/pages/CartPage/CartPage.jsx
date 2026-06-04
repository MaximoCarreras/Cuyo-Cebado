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
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [applyPoints, setApplyPoints] = useState(false);

    // NUEVO: Estados para el envío. Forzamos 'pickup' por defecto temporalmente.
    const [shippingMethod, setShippingMethod] = useState('pickup'); // 'pickup' o 'delivery'
    const [zipCode, setZipCode] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [loadingShipping, setLoadingShipping] = useState(false);

    const [orderData, setOrderData] = useState({
        name: '', email: '', phone: '', notes: '', address: '' // Agregado address
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUserProfile(profile);
                    setOrderData(prev => ({ ...prev, name: profile.full_name || '', email: session.user.email || '', phone: profile.phone || '' }));
                }
            }
        };
        fetchInitialData();
    }, []);

    const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    // NUEVO: Cálculos de totales
    const shippingCost = selectedShipping ? selectedShipping.valor : 0;
    const discountAmount = applyPoints && userProfile?.puntos ? userProfile.puntos * 3 : 0;
    const finalTotal = cartTotal + shippingCost - discountAmount;
    const earnedPoints = Math.floor(cartTotal / 100);

    // NUEVO: Función para llamar al backend de Envíopack (Intacta para el futuro)
    const handleQuoteShipping = async () => {
        if (!zipCode) return toast.error("Ingresá un código postal");
        setLoadingShipping(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await fetch(`${baseUrl}/api/shipping/cotizar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigoPostalDestino: zipCode })
            });
            
            if (!res.ok) throw new Error("Error al cotizar");
            const data = await res.json();
            
            // Asumimos que Envíopack/Andreani devuelve un array de opciones
            setShippingOptions(data);
            setSelectedShipping(null); 
        } catch (error) {
            console.error(error);
            toast.error("No se pudo cotizar el envío. Revisá el código postal.");
        } finally {
            setLoadingShipping(false);
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        
        if (shippingMethod === 'delivery' && !selectedShipping) {
            return toast.error("Por favor, cotizá y elegí una opción de envío.");
        }

        setLoading(true);

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const fixedAddress = 'RETIRO EN LOCAL: CÓDIGO VINARIO (Av. Colón 701)';
            const finalAddress = shippingMethod === 'pickup' ? fixedAddress : `${orderData.address}, CP: ${zipCode}`;
            const finalShippingMethod = shippingMethod === 'pickup' ? 'pickup' : (selectedShipping?.transporte || 'delivery');

            const { data: newOrder, error: dbError } = await supabase.from('orders').insert([{
                customer_email: orderData.email,
                customer_name: orderData.name,
                customer_phone: orderData.phone,
                shipping_method: finalShippingMethod,
                shipping_address: finalAddress,
                total: finalTotal,
                items: cart,
                status: 'pending',
                user_id: userProfile?.id || null,
                puntos_ganados: earnedPoints,
                puntos_descontados: applyPoints ? userProfile?.puntos : 0
            }]).select().single();

            if (dbError) throw dbError;

            const response = await fetch(`${baseUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    name: orderData.name,
                    email: orderData.email,
                    shippingCost: shippingCost, // Mandamos el costo de envío
                    discount: discountAmount,
                    orderId: newOrder.id 
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Falla al inicializar la pasarela.');

            localStorage.removeItem('cart');
            if (typeof clearCart === 'function') clearCart();
            toast.success("Redirigiendo a Mercado Pago...");

            window.location.href = data.init_point;

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
                                <div className="item-img">
                                    <img src={item.image_url || '/assets/placeholder.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                </div>
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

                <aside className="cart-checkout-sidebar">
                    <form className="checkout-form-premium" onSubmit={handleCheckout}>
                        <h3>Opciones de Entrega</h3>
                        
                        {/* --- INICIO OCULTAMIENTO TEMPORAL DE ENVÍOS --- */}
                        {/* <div className="delivery-toggle">
                            <button type="button" className={`toggle-btn ${shippingMethod === 'pickup' ? 'active' : ''}`} onClick={() => setShippingMethod('pickup')}>
                                <span className="material-symbols-outlined">store</span> Retiro Local
                            </button>
                            <button type="button" className={`toggle-btn ${shippingMethod === 'delivery' ? 'active' : ''}`} onClick={() => setShippingMethod('delivery')}>
                                <span className="material-symbols-outlined">local_shipping</span> Envío
                            </button>
                        </div>
                        */}
                        {/* --- FIN OCULTAMIENTO TEMPORAL --- */}

                        <div className="form-inputs-group">
                            <input type="text" placeholder="Nombre completo" required value={orderData.name} onChange={e => setOrderData({ ...orderData, name: e.target.value })} />
                            <input type="email" placeholder="Correo electrónico" required value={orderData.email} onChange={e => setOrderData({ ...orderData, email: e.target.value })} />
                            <input type="tel" placeholder="WhatsApp de contacto" required value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />

                            {/* CONDICIONAL: SI ELIGE RETIRO EN LOCAL */}
                            {shippingMethod === 'pickup' && (
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
                                    <div className="map-container" style={{ width: '100%', marginTop: '15px', borderRadius: '12px', overflow: 'hidden' }}>
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.627685040333!2d-68.8471271239616!3d-32.8876426736561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e090623f9b883%3A0xc3f92023d6a9926d!2sAv.%20Col%C3%B3n%20701%2C%20M5500%20Mendoza!5e0!3m2!1ses!2sar!4v1717000000000!5m2!1ses!2sar"
                                            width="100%"
                                            height="250"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade">
                                        </iframe>
                                    </div>
                                </div>
                            )}

                            {/* CONDICIONAL: SI ELIGE ENVÍO */}
                            {shippingMethod === 'delivery' && (
                                <div className="delivery-section animate-fade">
                                    <input type="text" placeholder="Dirección completa (Calle, Número, Piso)" required value={orderData.address} onChange={e => setOrderData({ ...orderData, address: e.target.value })} style={{ marginBottom: '15px' }} />
                                    
                                    <div className="quote-row">
                                        <input type="text" placeholder="Código Postal" value={zipCode} onChange={e => setZipCode(e.target.value)} className="zip-input" />
                                        <button type="button" className="btn-quote" onClick={handleQuoteShipping} disabled={loadingShipping}>
                                            {loadingShipping ? 'Calculando...' : 'Cotizar'}
                                        </button>
                                    </div>

                                    {shippingOptions.length > 0 && (
                                        <div className="shipping-options-list">
                                            {shippingOptions.map((opt, index) => (
                                                <label key={index} className={`shipping-option ${selectedShipping === opt ? 'selected' : ''}`}>
                                                    <input type="radio" name="shipping" checked={selectedShipping === opt} onChange={() => setSelectedShipping(opt)} />
                                                    <div className="shipping-info">
                                                        <span className="carrier">{opt.transporte || 'Envío Estándar'}</span>
                                                        <span className="time">{opt.horas_entrega ? `${opt.horas_entrega}hs hábiles` : 'A domicilio'}</span>
                                                    </div>
                                                    <span className="price">{formatCurrency(opt.valor)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <textarea className="notes-box" placeholder="Notas o pedido de grabado (Opcional)" value={orderData.notes} onChange={e => setOrderData({ ...orderData, notes: e.target.value })} />
                        </div>

                        {userProfile && userProfile.puntos > 0 && (
                            <div style={{ background: 'rgba(165, 129, 58, 0.1)', border: '1px solid #a5813a', padding: '15px', borderRadius: '12px', margin: '20px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: '800', color: '#1a1614', fontSize: '0.9rem' }}>✨ TENÉS {userProfile.puntos} PUNTOS</span>
                                    <span style={{ fontWeight: '800', color: '#a5813a' }}>- {formatCurrency(userProfile.puntos * 3)}</span>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                                    <input type="checkbox" checked={applyPoints} onChange={(e) => setApplyPoints(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#a5813a' }} />
                                    Aplicar descuento a esta compra
                                </label>
                            </div>
                        )}

                        <div className="total-summary-card">
                            <div className="t-row sub-info" style={{ textDecoration: applyPoints ? 'line-through' : 'none', opacity: applyPoints ? 0.5 : 1 }}>
                                <span>Subtotal</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                            
                            {shippingMethod === 'delivery' && (
                                <div className="t-row sub-info" style={{ color: '#009ee3', marginTop: '5px' }}>
                                    <span>Envío</span>
                                    <span>{shippingCost > 0 ? formatCurrency(shippingCost) : 'A calcular'}</span>
                                </div>
                            )}

                            <div className="t-row main-total" style={{ color: '#a5813a', marginTop: '15px' }}>
                                <span>TOTAL</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>
                            
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '12px', textAlign: 'center', fontWeight: '600' }}>
                                🛍️ Sumás <strong>{earnedPoints} puntos</strong> con esta compra.
                            </p>
                        </div>

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