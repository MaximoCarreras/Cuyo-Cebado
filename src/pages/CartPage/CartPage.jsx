import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './CartPage.css';

import mpLogo from '../../assets/mp-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    
    // Control de Vistas (1 = Carrito, 2 = Checkout)
    const [step, setStep] = useState(1);
    
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [checkoutType, setCheckoutType] = useState('guest'); // 'guest' o 'logged'
    const [shippingMethod, setShippingMethod] = useState('pickup'); // 'pickup' o 'delivery'
    const [paymentMethod, setPaymentMethod] = useState('mercadopago'); // 'mercadopago' o 'cash'
    
    const [orderData, setOrderData] = useState({
        name: '', email: '', phone: '', address: '' 
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUserProfile(profile);
                    setCheckoutType('logged');
                    setOrderData(prev => ({ 
                        ...prev, 
                        name: profile.full_name || '', 
                        email: session.user.email || '', 
                        phone: profile.phone || '' 
                    }));
                }
            }
        };
        fetchInitialData();
    }, []);

    const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    const shippingCost = 0; // Por ahora a coordinar
    const finalTotal = cartTotal + shippingCost;

    // 🔥 CORRECCIÓN DEL BOTÓN MENOS
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
            const finalAddress = shippingMethod === 'pickup' ? 'RETIRO EN LOCAL' : orderData.address;

            // 1. Guardar orden en BD (Soporta invitados pasando user_id null)
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

            // 2. Proceso de Pago
            if (paymentMethod === 'mercadopago') {
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
            } else {
                // Pago en efectivo
                localStorage.removeItem('cart');
                if (typeof clearCart === 'function') clearCart();
                toast.success("¡Pedido confirmado! Te contactaremos a la brevedad.");
                setTimeout(() => window.location.href = '/', 2000);
            }

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error al procesar el pago.");
            setLoading(false);
        }
    };

    // VISTA CARRITO VACÍO
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
                
                {/* VISTA 1: CARRITO */}
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
                                        
                                        {/* CONTROLES DE CANTIDAD (VERDE EN FOTO, AQUÍ DORADO ELEGANTE) */}
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
                                        <span>A coordinar</span>
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

                {/* VISTA 2: CHECKOUT (DATOS Y PAGO) */}
                {step === 2 && (
                    <>
                        <div className="checkout-header-top">
                            <h2 className="flow-title">Finalizar compra</h2>
                            <div className="stepper">
                                <span className="step-item active" onClick={() => setStep(1)}>✓ Carrito</span>
                                <span className="step-line"></span>
                                <span className="step-item current">2 Datos y Pago</span>
                            </div>
                        </div>

                        <div className="flow-grid">
                            <div className="flow-left-side">
                                
                                {/* TABS INVITADO / CON CUENTA */}
                                {!userProfile && (
                                    <div className="checkout-tabs">
                                        <button className={`tab-btn ${checkoutType === 'guest' ? 'active' : ''}`} onClick={() => setCheckoutType('guest')}>Comprar sin cuenta</button>
                                        <Link to="/login" className="tab-btn">Ingresar con mi cuenta</Link>
                                    </div>
                                )}

                                <form id="checkout-form" className="checkout-full-form" onSubmit={handleCheckoutSubmit}>
                                    
                                    {/* SECCIÓN DATOS */}
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

                                    {/* SECCIÓN ENTREGA */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Entrega</h3>
                                        <div className="selector-grid">
                                            <label className={`selector-card ${shippingMethod === 'pickup' ? 'selected' : ''}`}>
                                                <input type="radio" name="shipping" checked={shippingMethod === 'pickup'} onChange={() => setShippingMethod('pickup')} />
                                                <span className="material-symbols-outlined">store</span>
                                                <strong>Retiro en sucursal</strong>
                                                <small>Sin costo adicional</small>
                                            </label>
                                            <label className={`selector-card ${shippingMethod === 'delivery' ? 'selected' : ''}`}>
                                                <input type="radio" name="shipping" checked={shippingMethod === 'delivery'} onChange={() => setShippingMethod('delivery')} />
                                                <span className="material-symbols-outlined">local_shipping</span>
                                                <strong>Envío a domicilio</strong>
                                                <small>A coordinar por WhatsApp</small>
                                            </label>
                                        </div>

                                        {shippingMethod === 'delivery' && (
                                            <div className="input-group mt-15 animate-fade">
                                                <label>Dirección completa de entrega *</label>
                                                <input type="text" required value={orderData.address} onChange={e => setOrderData({ ...orderData, address: e.target.value })} placeholder="Calle, Número, Piso, Código Postal" />
                                            </div>
                                        )}
                                    </div>

                                    {/* SECCIÓN PAGO */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Método de pago</h3>
                                        <div className="selector-grid">
                                            <label className={`selector-card ${paymentMethod === 'mercadopago' ? 'selected' : ''}`}>
                                                <input type="radio" name="payment" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} />
                                                <span className="material-symbols-outlined">credit_card</span>
                                                <strong>Mercado Pago</strong>
                                                <small>Tarjetas / Dinero en cuenta</small>
                                            </label>
                                            <label className={`selector-card ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                                                <input type="radio" name="payment" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                                                <span className="material-symbols-outlined">payments</span>
                                                <strong>Efectivo / Transferencia</strong>
                                                <small>Pagás al retirar</small>
                                            </label>
                                        </div>
                                    </div>

                                </form>
                            </div>

                            {/* COLUMNA DERECHA: RESUMEN CHECKOUT */}
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
                                    
                                    {paymentMethod === 'mercadopago' && (
                                        <p className="mp-secure-text">🔒 Pago procesado de forma segura por Mercado Pago</p>
                                    )}

                                    <button type="submit" form="checkout-form" className="btn-confirm-pay" disabled={loading}>
                                        {loading ? 'Procesando...' : (paymentMethod === 'mercadopago' ? 'Ir a pagar con Mercado Pago' : 'Confirmar pedido')}
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