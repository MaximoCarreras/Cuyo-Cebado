import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import './AdminOrders.css';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setTabLoading(true);
        try {
            const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            setOrders(oData || []);
        } catch (err) {
            console.error(err);
            toast.error("Error al cargar las ventas");
        }
        setTabLoading(false);
    };

    const handleUpdateTrackingStatus = async (orderId, newTracking) => {
        const { error } = await supabase.from('orders').update({ tracking_status: newTracking }).eq('id', orderId);
        if (!error) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, tracking_status: newTracking } : o));
            toast.success('Estado logístico actualizado al cliente ✔️');
        } else {
            toast.error('Error al actualizar logística');
        }
    };

    const handleCancelOrder = async (order) => {
        if (!window.confirm(`¿Seguro que querés CANCELAR el pedido de ${order.customer_name}? Se devolverá el stock disponible.`)) return;

        setTabLoading(true);
        try {
            const { error: statusErr } = await supabase.from('orders').update({ status: 'cancelled', tracking_status: 'cancelled' }).eq('id', order.id);
            if (statusErr) throw statusErr;

            if (order.items && order.items.length > 0) {
                let parsedItems = order.items;
                if (typeof parsedItems === 'string') {
                    try { parsedItems = JSON.parse(parsedItems); } catch(e) {}
                }

                for (const item of parsedItems) {
                    const { data: prod } = await supabase.from('products').select('id, stock').eq('name', item.title || item.name).single();

                    if (prod) {
                        const newStock = prod.stock + Number(item.quantity);
                        await supabase.from('products').update({ stock: newStock }).eq('id', prod.id);
                    }
                }
            }

            toast.success("Pedido cancelado. Stock devuelto a la estancia 📦");
            fetchOrders();
        } catch (err) {
            console.error(err);
            toast.error("No se pudo procesar la cancelación.");
        } finally {
            setTabLoading(false);
        }
    };

    return (
        <section className="fade-in">
            {tabLoading ? (
                <div className="tab-internal-loader"><p>Sincronizando ventas...</p></div>
            ) : (
                <div className="table-container">
                    <table className="refined-table" style={{ minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th>FECHA</th>
                                <th>CLIENTE</th>
                                <th>ESTADO PAGO</th>
                                <th>LOGÍSTICA (A CLIENTE)</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.length > 0 ? orders.map(o => (
                                <tr key={o.id} style={{ opacity: o.status === 'cancelled' ? 0.5 : 1 }}>
                                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <strong>{o.customer_name || 'Sin especificar'}</strong><br/>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>${o.total?.toLocaleString() || '0'}</span>
                                    </td>
                                    <td>
                                        {o.status === 'approved' || o.status === 'paid' ? (
                                            <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>✅ Pagado</span>
                                        ) : o.status === 'cancelled' ? (
                                            <span style={{ background: '#fee2e2', color: '#991b1b', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>❌ Cancelado</span>
                                        ) : (
                                            <span style={{ background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>⏳ Pendiente</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button 
                                                title="En Preparación"
                                                onClick={() => handleUpdateTrackingStatus(o.id, 'en_preparacion')}
                                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid #4f46e5', background: o.tracking_status === 'en_preparacion' ? '#4f46e5' : 'transparent', color: o.tracking_status === 'en_preparacion' ? '#fff' : '#4f46e5', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                🛠️ Prep
                                            </button>
                                            <button 
                                                title="En Distribución"
                                                onClick={() => handleUpdateTrackingStatus(o.id, 'en_distribucion')}
                                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid #d97706', background: o.tracking_status === 'en_distribucion' ? '#d97706' : 'transparent', color: o.tracking_status === 'en_distribucion' ? '#fff' : '#d97706', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                🚚 Dist
                                            </button>
                                            <button 
                                                title="Listo para Retirar"
                                                onClick={() => handleUpdateTrackingStatus(o.id, 'listo_para_retirar')}
                                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid #16a34a', background: o.tracking_status === 'listo_para_retirar' ? '#16a34a' : 'transparent', color: o.tracking_status === 'listo_para_retirar' ? '#fff' : '#16a34a', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                🏠 Listo
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="actions-flex-row">
                                            <button className="btn-edit-modern" onClick={() => setSelectedOrder(o)}>DETALLES</button>
                                            {o.status !== 'cancelled' && (
                                                <button className="btn-delete-icon-only" title="Cancelar Orden" onClick={() => handleCancelOrder(o)}>
                                                    <span className="material-symbols-outlined">block</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No hay ventas registradas aún.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <div className="refined-modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="refined-modal-card order-modal" onClick={e => e.stopPropagation()}>
                        <header className="modal-refined-header">
                            <h2>Ficha de Venta #{selectedOrder.id?.slice(0, 5).toUpperCase()}</h2>
                            <button className="btn-close-modern-circle" onClick={() => setSelectedOrder(null)}><span className="material-symbols-outlined">close</span></button>
                        </header>
                        <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                            <div className="client-box" style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontFamily: 'Noto Serif, serif', marginBottom: '15px', color: '#a5813a' }}>Datos de Entrega</h3>
                                <p style={{ margin: '8px 0' }}><strong>Cliente:</strong> {selectedOrder.customer_name}</p>
                                <p style={{ margin: '8px 0' }}><strong>WhatsApp:</strong> {selectedOrder.customer_phone}</p>
                                <p style={{ margin: '8px 0' }}><strong>Email:</strong> {selectedOrder.customer_email || 'No especificado'}</p>
                                <p style={{ margin: '8px 0' }}><strong>Fecha Compra:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                
                                {selectedOrder.puntos_ganados > 0 && <p style={{ margin: '8px 0', color: '#16a34a', fontWeight: 'bold' }}><strong>Puntos Ganados:</strong> +{selectedOrder.puntos_ganados}</p>}
                                {selectedOrder.puntos_descontados > 0 && <p style={{ margin: '8px 0', color: '#d97706', fontWeight: 'bold' }}><strong>Puntos Canjeados:</strong> -{selectedOrder.puntos_descontados}</p>}
                                
                                <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '15px 0' }} />
                                <p style={{ margin: '8px 0' }}><strong>Método de Despacho:</strong></p>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    backgroundColor: selectedOrder.shipping_method?.includes('mercado_envios') ? '#fff159' : '#e2e8f0',
                                    color: '#1a1614',
                                    fontWeight: '800',
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    textTransform: 'uppercase',
                                    marginBottom: '10px'
                                }}>
                                    {selectedOrder.shipping_method?.includes('mercado_envios') ? '🚚 MERCADO ENVÍOS ACTIVO' : '🏠 RETIRO EN LOCAL'}
                                </span>
                                <p style={{ margin: '8px 0', lineHeight: '1.4' }}><strong>Dirección Postal:</strong> <br />{selectedOrder.shipping_address || 'Retira en local (Código Vinario)'}</p>
                            </div>

                            <div className="items-box" style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'Noto Serif, serif', marginBottom: '15px', color: '#a5813a' }}>Resumen del Mate</h3>
                                    {(typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items || '[]') : selectedOrder.items)?.map((it, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
                                            <span style={{ fontWeight: '600' }}>{it.quantity}x {it.title || it.name}</span>
                                            <span style={{ fontWeight: '700' }}>${((it.unit_price || it.price) * it.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#1a1614', color: '#a5813a', padding: '15px', borderRadius: '12px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#fff' }}>TOTAL PROCESADO</span>
                                    <span style={{ fontWeight: '800', fontSize: '1.4rem' }}>${selectedOrder.total?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}