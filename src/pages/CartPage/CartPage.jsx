import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './CartPage.css';

import mpLogo from '../../assets/mp-logo.png';
import meLogo from '../../assets/me-logo.png';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [dbCategories, setDbCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [shippingCost, setShippingCost] = useState(0);
    const [shippingType, setShippingType] = useState('standard');
    const [calculated, setCalculated] = useState(false);

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

    const handleCalculateShipping = () => {
        if (!orderData.zip || orderData.zip.trim() === '') {
            toast.error("Por favor, ingresá un Código Postal.");
            return;
        }

        const cp = parseInt(orderData.zip);

        if (cp >= 5500 && cp <= 5613) {
            if (shippingType === 'standard') setShippingCost(3500);
            else setShippingCost(5200);
        } else {
            if (shippingType === 'standard') setShippingCost(5900);
            else setShippingCost(8400);
        }

        setCalculated(true);
        toast.success("Envío calculado correctamente");
    };

    useEffect(() => {
        if (calculated) {
            handleCalculateShipping();
        }
    }, [shippingType]);

    useEffect(() => {
        if (orderData.method === 'pickup') {
            setShippingCost(0);
            setCalculated(false);
        }
    }, [orderData.method]);

    const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);
    const getCategoryIcon = (slug) => dbCategories.find(c => c.id === slug)?.icon || '🧉';

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (orderData.method === 'shipment' && !calculated) {
            toast.error("Calculá el costo de envío antes de pagar.");
            setLoading(false);
            return;
        }

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

            const shipmentLabel = shippingType === 'standard' ? 'Estándar' : 'Express';
            const fullAddress = orderData.method === 'pickup'
                ? 'RETIRO EN LOCAL: CÓDIGO VINARIO (Av. Colón 701)'
                : `${orderData.address}, ${orderData.city} (CP: ${orderData.zip}) - [${shipmentLabel}]`;

            // 1. Guardamos la orden local con la dirección en Supabase
            const { error: dbError } = await supabase.from('orders').insert([{
                customer_email: orderData.email,
                customer_name: orderData.name,
                customer_phone: orderData.phone,
                shipping_method: orderData.method,
                shipping_address: fullAddress,
                total: cartTotal + shippingCost,
                items: cart,
                status: 'pending'
            }]);

            if (dbError) throw dbError;

            // 2. Solicitamos el link de cobro al servidor mandando el costo logístico
            const response = await fetch(`${baseUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    name: orderData.name,
                    email: orderData.email,
                    shippingCost: shippingCost
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

                <aside className="cart-checkout-sidebar">
                    <form className="checkout-form-premium" onSubmit={handleCheckout}>
                        <h3>Finalizar Compra</h3>

                        <div className="shipping-selector">
                            <button type="button" className={orderData.method === 'shipment' ? 'active' : ''} onClick={() => setOrderData({ ...orderData, method: 'shipment' })}>🚚 Envío</button>
                            <button type="button" className={orderData.method === 'pickup' ? 'active' : ''} onClick={() => setOrderData({ ...orderData, method: 'pickup' })}>🏠 Retiro</button>
                        </div>

                        <div className="form-inputs-group">
                            <input type="text" placeholder="Nombre completo" required value={orderData.name} onChange={e => setOrderData({ ...orderData, name: e.target.value })} />
                            <input type="email" placeholder="Correo electrónico" required value={orderData.email} onChange={e => setOrderData({ ...orderData, email: e.target.value })} />
                            <input type="tel" placeholder="WhatsApp de contacto" required value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />

                            {orderData.method === 'shipment' ? (
                                <div className="address-fields animate-fade">
                                    <div className="mercado-envios-header-badge" style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        backgroundColor: '#fff159', padding: '12px 16px', borderRadius: '14px', marginBottom: '15px',
                                        border: '1.5px solid #ebd432', boxShadow: '0 4px 12px rgba(255, 241, 89, 0.25)'
                                    }}>
                                        <img src={meLogo} alt="Logística" style={{ height: '24px', width: 'auto' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#1a1614', letterSpacing: '0.5px' }}>
                                            LOGÍSTICA COTIZADA AL INSTANTE
                                        </span>
                                    </div>

                                    <div className="grid-cp" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                        <input type="text" placeholder="Código Postal (CP)" required={orderData.method === 'shipment'} value={orderData.zip} onChange={e => setOrderData({ ...orderData, zip: e.target.value })} />
                                        <button
                                            type="button"
                                            style={{
                                                height: '52px', padding: '0 24px', backgroundColor: '#fff159', color: '#1a1614',
                                                border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer'
                                            }}
                                            onClick={handleCalculateShipping}
                                        >
                                            CALCULAR
                                        </button>
                                    </div>

                                    {calculated && (
                                        <div className="mercado-envios-options" style={{
                                            background: '#f8fafc', padding: '15px', borderRadius: '14px',
                                            border: '1.5px solid #e2e8f0', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '12px'
                                        }}>
                                            <label style={{
                                                display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', padding: '10px', borderRadius: '10px',
                                                border: shippingType === 'standard' ? '1.5px solid #fff159' : '1.5px solid transparent',
                                                background: shippingType === 'standard' ? '#ffffea' : 'transparent'
                                            }}>
                                                <input type="radio" name="me_type" checked={shippingType === 'standard'} onChange={() => setShippingType('standard')} />
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ color: '#1a1614' }}>Estándar a domicilio</div>
                                                    <small style={{ color: '#00a650', fontWeight: '700' }}>Llega de 3 a 5 días hábiles</small>
                                                </div>
                                                <span>{formatCurrency(orderData.zip >= 5500 && orderData.zip <= 5613 ? 3500 : 5900)}</span>
                                            </label>

                                            <label style={{
                                                display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', padding: '10px', borderRadius: '10px',
                                                border: shippingType === 'express' ? '1.5px solid #fff159' : '1.5px solid transparent',
                                                background: shippingType === 'express' ? '#ffffea' : 'transparent'
                                            }}>
                                                <input type="radio" name="me_type" checked={shippingType === 'express'} onChange={() => setShippingType('express')} />
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ color: '#1a1614' }}>Express prioritario</div>
                                                    <small style={{ color: '#00a650', fontWeight: '700' }}>Llega de 1 a 2 días hábiles</small>
                                                </div>
                                                <span>{formatCurrency(orderData.zip >= 5500 && orderData.zip <= 5613 ? 5200 : 8400)}</span>
                                            </label>
                                        </div>
                                    )}

                                    <input type="text" placeholder="Dirección (Calle y N°)" required={orderData.method === 'shipment'} value={orderData.address} onChange={e => setOrderData({ ...orderData, address: e.target.value })} />
                                    <input type="text" placeholder="Ciudad" required={orderData.method === 'shipment'} value={orderData.city} onChange={e => setOrderData({ ...orderData, city: e.target.value })} />
                                </div>
                            ) : (
                                <div className="pickup-info-card animate-fade">
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
                            )}

                            <textarea className="notes-box" placeholder="Notas o pedido de grabado (Opcional)" value={orderData.notes} onChange={e => setOrderData({ ...orderData, notes: e.target.value })} />
                        </div>

                        <div className="total-summary-card">
                            {orderData.method === 'shipment' && (
                                <div className="t-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '10px', fontWeight: '600', color: '#64748b' }}>
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>
                            )}
                            {orderData.method === 'shipment' && (
                                <div className="t-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '15px', fontWeight: '600', color: '#64748b' }}>
                                    <span>Costo de Envío</span>
                                    <span>{shippingCost > 0 ? formatCurrency(shippingCost) : 'Calcular'}</span>
                                </div>
                            )}
                            <div className="t-row main-total">
                                <span>TOTAL</span>
                                <span>{formatCurrency(cartTotal + shippingCost)}</span>
                            </div>
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