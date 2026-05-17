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

    // Estados para Mercado Envíos
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
            toast.error("Calculá el costo de Mercado Envíos antes de pagar.");
            setLoading(false);
            return;
        }

        const shipmentLabel = shippingType === 'standard'
            ? 'Mercado Envíos Estándar'
            : 'Mercado Envíos Express';

        const shippingAddress = orderData.method === 'pickup'
            ? 'RETIRO EN LOCAL: CÓDIGO VINARIO (Av. Colón 701)'
            : `${orderData.address}, ${orderData.city} (CP: ${orderData.zip}) - [${shipmentLabel}]`;

        const finalTotal = cartTotal + shippingCost;

        const { error } = await supabase.from('orders').insert([{
            customer_email: orderData.email || 'No proveído',
            customer_name: orderData.name,
            customer_phone: orderData.phone,
            shipping_method: orderData.method === 'pickup' ? 'pickup' : `mercado_envios_${shippingType}`,
            shipping_address: shippingAddress,
            total: finalTotal,
            items: cart,
            status: 'pending'
        }]);

        if (error) {
            toast.error("Error al procesar el pedido.");
            setLoading(false);
        } else {
            toast.success("Redirigiendo a Mercado Pago...");
            setTimeout(() => {
                clearCart();
                navigate('/');
            }, 2000);
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
                            <input type="tel" placeholder="WhatsApp de contacto" required value={orderData.phone} onChange={e => setOrderData({ ...orderData, phone: e.target.value })} />

                            {orderData.method === 'shipment' ? (
                                <div className="address-fields animate-fade">

                                    {/* BANNER LOGÍSTICA EN AMARILLO MERCADO LIBRE */}
                                    <div className="mercado-envios-header-badge" style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        backgroundColor: '#fff159',
                                        padding: '12px 16px', borderRadius: '14px', marginBottom: '15px',
                                        border: '1.5px solid #ebd432',
                                        boxShadow: '0 4px 12px rgba(255, 241, 89, 0.25)'
                                    }}>
                                        <img src={meLogo} alt="Mercado Envíos" style={{ height: '24px', width: 'auto' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#1a1614', letterSpacing: '0.5px' }}>
                                            LOGÍSTICA OFICIAL INTEGRADA
                                        </span>
                                    </div>

                                    <div className="grid-cp" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                        <input type="text" placeholder="Código Postal (CP)" required style={{ marginBottom: '0', flex: '1' }} value={orderData.zip} onChange={e => setOrderData({ ...orderData, zip: e.target.value })} />
                                        <button
                                            type="button"
                                            style={{
                                                height: '52px', padding: '0 24px', backgroundColor: '#fff159', color: '#1a1614',
                                                border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '0.75rem',
                                                cursor: 'pointer', transition: '0.2s ease', boxShadow: '0 2px 6px rgba(255, 241, 89, 0.3)'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ebd432'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff159'}
                                            onClick={handleCalculateShipping}
                                        >
                                            CALCULAR
                                        </button>
                                    </div>

                                    {calculated && (
                                        <div className="mercado-envios-options" style={{
                                            background: '#f8fafc', padding: '15px', borderRadius: '14px',
                                            border: '1.5px solid #e2e8f0', marginBottom: '15px', display: 'flex',
                                            flexDirection: 'column', gap: '12px'
                                        }}>
                                            <label style={{
                                                display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                                                fontSize: '0.85rem', fontWeight: '700', padding: '10px', borderRadius: '10px',
                                                border: shippingType === 'standard' ? '1.5px solid #fff159' : '1.5px solid transparent',
                                                background: shippingType === 'standard' ? '#ffffea' : 'transparent'
                                            }}>
                                                <input type="radio" name="me_type" checked={shippingType === 'standard'} onChange={() => setShippingType('standard')} style={{ accentColor: '#a5813a', width: '16px', height: '16px' }} />
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ color: '#1a1614' }}>Estándar a domicilio</div>
                                                    <small style={{ color: '#00a650', fontWeight: '700' }}>Llega de 3 a 5 días hábiles</small>
                                                </div>
                                                <span style={{ color: '#1a1614', fontWeight: '800' }}>{formatCurrency(orderData.zip >= 5500 && orderData.zip <= 5613 ? 3500 : 5900)}</span>
                                            </label>

                                            <label style={{
                                                display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                                                fontSize: '0.85rem', fontWeight: '700', padding: '10px', borderRadius: '10px',
                                                border: shippingType === 'express' ? '1.5px solid #fff159' : '1.5px solid transparent',
                                                background: shippingType === 'express' ? '#ffffea' : 'transparent'
                                            }}>
                                                <input type="radio" name="me_type" checked={shippingType === 'express'} onChange={() => setShippingType('express')} style={{ accentColor: '#a5813a', width: '16px', height: '16px' }} />
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ color: '#1a1614' }}>Express prioritario</div>
                                                    <small style={{ color: '#00a650', fontWeight: '700' }}>Llega de 1 a 2 días hábiles</small>
                                                </div>
                                                <span style={{ color: '#1a1614', fontWeight: '800' }}>{orderData.zip >= 5500 && orderData.zip <= 5613 ? formatCurrency(5200) : formatCurrency(8400)}</span>
                                            </label>
                                        </div>
                                    )}

                                    <input type="text" placeholder="Dirección (Calle y N°)" required value={orderData.address} onChange={e => setOrderData({ ...orderData, address: e.target.value })} />
                                    <input type="text" placeholder="Ciudad" required value={orderData.city} onChange={e => setOrderData({ ...orderData, city: e.target.value })} />
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
                                        <p>📞 261 238-1448</p>
                                    </div>
                                    <a href="https://share.google/c76gmYsh1bYwmbVUc" target="_blank" rel="noreferrer" className="btn-maps-dorado">
                                        <span className="material-symbols-outlined">location_on</span>
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

                        {/* 🟦 BOTÓN PRINCIPAL EN CELESTE MERCADO PAGO - LOGO CORREGIDO 🟦 */}
                        <button
                            type="submit"
                            className="btn-mercadopago-pro"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '18px', // Aumentamos padding para dar aire
                                backgroundColor: '#009EE3', // Celeste oficial MP
                                color: '#ffffff',          // Texto blanco impecable
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
                                gap: '12px', // Más espacio entre logo y texto
                                marginTop: '20px',
                                boxShadow: '0 4px 15px rgba(0, 158, 227, 0.2)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0086c3'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#009EE3'}
                        >
                            {loading ? 'Procesando...' : (
                                <>
                                    {/* 💥 ARREGLO LOGO: Agrandado a 28px y quitado el filtro de inversión 💥 */}
                                    <img
                                        src={mpLogo}
                                        alt="MP"
                                        className="mp-icon-final"
                                        style={{
                                            height: '28px', // Más grande (antes 22px)
                                            width: 'auto',
                                            filter: 'none', // QUITADO EL FILTRO DE INVERSIÓN: Ahora se ve en colores oficiales
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