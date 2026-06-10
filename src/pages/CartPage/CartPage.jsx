import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './CartPage.css';

import mpLogo from '../../assets/mp-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [checkoutType, setCheckoutType] = useState('guest'); 
    
    // Al ser las únicas opciones por ahora, las dejamos fijas y no hace falta que el usuario las seleccione
    const shippingMethod = 'pickup'; 
    const paymentMethod = 'mercadopago'; 
    
    const [orderData, setOrderData] = useState({
        name: '', email: '', phone: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUserProfile(profile);
                    setCheckoutType('logged');
                    setOrderData({ 
                        name: profile.full_name || '', 
                        email: session.user.email || '', 
                        phone: profile.phone || '' 
                    });
                }
            }
        };
        fetchInitialData();
    }, []);

    const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    const shippingCost = 0; 
    const finalTotal = cartTotal + shippingCost;

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        } else {
            if (window.confirm("¿Quitar producto del carrito?")) removeFromCart(item.id);
        }
    };

    const handleIncrease = (item) => {
        if (item.quantity < item.stock) {
            updateQuantity(item.id, item.quantity + 1);
        }
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const finalAddress = 'RETIRO EN LOCAL: Código Vinario (Av. Colón 701)';

            const { data: newOrder, error: dbError } = await supabase.from('orders').insert([{
                customer_email: orderData.email,
                customer_name: orderData.name,
                customer_phone: orderData.phone,
                shipping_method: shippingMethod,
                shipping_address: finalAddress,
                total: finalTotal,
                items: cart,
                status: 'pending',
                user_id: userProfile?.id || null 
            }]).select().single();

            if (dbError) throw dbError;

            const response = await fetch(`${baseUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    name: orderData.name,
                    email: orderData.email,
                    shippingCost: shippingCost,
                    orderId: newOrder.id 
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Falla en Mercado Pago.');

            localStorage.removeItem('cart');
            if (typeof clearCart === 'function') clearCart();
            window.location.href = data.init_point;

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error al procesar el pago.");
            setLoading(false);
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <section className="cart-empty-container">
                <div className="cart-empty-content">
                    <span className="material-symbols-outlined empty-icon">shopping_basket</span>
                    <h2 className="empty-title">Tu carrito está vacío</h2>
                    <Link to="/productos" className="btn-gold-mafia">EXPLORAR PRODUCTOS</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="cart-flow-section">
            <Toaster position="top-center" />
            
            <div className="cart-flow-container">
                
                {/* ===============================
                    VISTA 1: CARRITO 
                    =============================== */}
                {step === 1 && (
                    <>
                        <div className="cart-header-top">
                            <h2 className="flow-title">Tu carrito</h2>
                            <button onClick={() => clearCart()} className="btn-clear-cart">Vaciar carrito</button>
                        </div>

                        <div className="flow-grid">
                            <div className="flow-left-side">
                                {cart.map((item) => (
                                    <div key={item.id} className="clean-item-card">
                                        <div className="clean-item-img">
                                            <img src={item.image_url || '/assets/placeholder.png'} alt={item.name} />
                                        </div>
                                        <div className="clean-item-details">
                                            <h3>{item.name}</h3>
                                            <p className="clean-item-meta">{item.material || 'Premium'}</p>
                                            <span className="clean-item-price-mobile">{formatCurrency(item.price)}</span>
                                        </div>
                                        
                                        <div className="clean-qty-controls">
                                            <button type="button" onClick={() => handleDecrease(item)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button type="button" onClick={() => handleIncrease(item)} disabled={item.quantity >= item.stock}>+</button>
                                        </div>

                                        <div className="clean-item-total">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                        <button className="clean-item-remove" onClick={() => { if (window.confirm("¿Quitar?")) removeFromCart(item.id) }}>✕</button>
                                    </div>
                                ))}
                            </div>

                            <div className="flow-right-side">
                                <div className="summary-box">
                                    <h3 className="summary-title">Resumen</h3>
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(cartTotal)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Envío</span>
                                        <span>Retiro en local</span>
                                    </div>
                                    <div className="summary-row summary-total">
                                        <span>Total</span>
                                        <span>{formatCurrency(finalTotal)}</span>
                                    </div>

                                    <button className="btn-go-pay" onClick={() => setStep(2)}>
                                        Ir a pagar
                                    </button>
                                    <Link to="/productos" className="btn-back-link">
                                        ← Seguir comprando
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ===============================
                    VISTA 2: DATOS Y PAGO
                    =============================== */}
                {step === 2 && (
                    <>
                        <div className="checkout-header-top">
                            <h2 className="flow-title">Finalizar compra</h2>
                            
                            {/* NUEVO STEPPER PREMIUM */}
                            <div className="checkout-stepper">
                                <div className="step-box completed" onClick={() => setStep(1)}>
                                    <div className="step-circle"><span className="material-symbols-outlined">check</span></div>
                                    <span className="step-text">Carrito</span>
                                </div>
                                <div className="step-line"></div>
                                <div className="step-box active">
                                    <div className="step-circle">2</div>
                                    <span className="step-text">Datos y Pago</span>
                                </div>
                            </div>
                        </div>

                        <div className="flow-grid">
                            <div className="flow-left-side">
                                
                                {!userProfile && (
                                    <div className="checkout-tabs">
                                        <button className={`tab-btn ${checkoutType === 'guest' ? 'active' : ''}`} onClick={() => setCheckoutType('guest')}>Comprar sin cuenta</button>
                                        <Link to="/login" className="tab-btn">Ingresar con mi cuenta</Link>
                                    </div>
                                )}

                                <form id="checkout-form" className="checkout-full-form" onSubmit={handleCheckoutSubmit}>
                                    
                                    <div className="form-section">
                                        <h3 className="form-section-title">Tus datos de contacto</h3>
                                        <div className="input-group">
                                            <label>Nombre completo *</label>
                                            <input type="text" required value={orderData.name} onChange={e => setOrderData({ ...orderData, name: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label>Teléfono (WhatsApp) *</label>
                                            <input type="tel" required value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label>Email *</label>
                                            <input type="email" required value={orderData.email} onChange={e => setOrderData({ ...orderData, email: e.target.value })} />
                                        </div>
                                    </div>

                                    {/* INFO FIJA DE ENTREGA CON MAPA */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Entrega</h3>
                                        <div className="fixed-info-card">
                                            <div className="fixed-info-header">
                                                <span className="material-symbols-outlined icon-gold">store</span>
                                                <div>
                                                    <h4>Retiro en Código Vinario</h4>
                                                    <p>Sin costo adicional</p>
                                                </div>
                                            </div>
                                            <div className="fixed-info-body">
                                                <p>📍 Av. Colón 701, Mendoza Capital</p>
                                                <p>⏰ Lun a Sáb de 10:00 a 22:00 hs</p>
                                            </div>
                                            {/* MAPA DE GOOGLE */}
                                            <div className="map-container">
                                                <iframe 
                                                    src="https://maps.google.com/maps?q=Av.%20Col%C3%B3n%20701,%20Mendoza&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                                    width="100%" 
                                                    height="200" 
                                                    style={{ border: 0, borderRadius: '8px', marginTop: '15px' }} 
                                                    allowFullScreen="" 
                                                    loading="lazy" 
                                                    referrerPolicy="no-referrer-when-downgrade">
                                                </iframe>
                                            </div>
                                        </div>
                                    </div>

                                    {/* INFO FIJA DE PAGO */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Método de pago</h3>
                                        <div className="fixed-info-card">
                                            <div className="fixed-info-header">
                                                <span className="material-symbols-outlined icon-gold">credit_card</span>
                                                <div>
                                                    <h4>Mercado Pago</h4>
                                                    <p>Tarjetas de crédito, débito o dinero en cuenta</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </div>

                            {/* RESUMEN LATERAL */}
                            <div className="flow-right-side">
                                <div className="summary-box sticky-summary">
                                    <h3 className="summary-title">Resumen del pedido</h3>
                                    
                                    <div className="mini-cart-list">
                                        {cart.map(item => (
                                            <div key={item.id} className="mini-cart-item">
                                                <img src={item.image_url || '/assets/placeholder.png'} alt={item.name} />
                                                <div className="mini-item-info">
                                                    <p className="mini-name">{item.name}</p>
                                                    <p className="mini-qty">x{item.quantity}</p>
                                                </div>
                                                <span className="mini-price">{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(cartTotal)}</span>
                                    </div>
                                    <div className="summary-row summary-total">
                                        <span>Total</span>
                                        <span>{formatCurrency(finalTotal)}</span>
                                    </div>
                                    
                                    <p className="mp-secure-text">🔒 Pago procesado de forma segura por Mercado Pago</p>

                                    <button type="submit" form="checkout-form" className="btn-confirm-pay" disabled={loading}>
                                        {loading ? 'Procesando...' : 'Ir a pagar con Mercado Pago'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </section>
    );
}