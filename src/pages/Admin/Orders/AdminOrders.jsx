import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient'; // 3 niveles arriba para llegar a lib
import toast from 'react-hot-toast';
import './AdminOrders.css'; 

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setTabLoading(true);
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        setOrders(data || []);
        setTabLoading(false);
    };

    const sendWhatsAppNotification = (order, statusName) => {
        const phone = order.customer_phone?.replace(/\D/g, ''); 
        const message = encodeURIComponent(`Hola ${order.customer_name}, te informamos que tu pedido de Cuyo Cebado ha cambiado a estado: ${statusName}. ¡Gracias por confiar en nosotros!`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (!error) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Pedido marcado como ${newStatus}`);
        }
    };

    const handleUpdateTrackingStatus = async (order, newTracking, statusName) => {
        const { error } = await supabase.from('orders').update({ tracking_status: newTracking }).eq('id', order.id);
        if (!error) {
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, tracking_status: newTracking } : o));
            toast.success('Estado logístico actualizado y notificando...');
            sendWhatsAppNotification(order, statusName);
        } else {
            toast.error('Error al actualizar logística');
        }
    };

    return (
        <section className="fade-in">
            <h2>Gestión de Ventas</h2>
            {tabLoading ? <p>Cargando ventas...</p> : (
                <div className="table-container">
                    <table className="refined-table" style={{ minWidth: '900px' }}>
                        <thead><tr><th>FECHA</th><th>CLIENTE</th><th>ESTADO</th><th>ACCIONES LOGÍSTICA</th></tr></thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td><strong>{o.customer_name}</strong></td>
                                    <td>
                                        <select value={o.status || 'pending'} onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}>
                                            <option value="pending">Pendiente</option>
                                            <option value="paid">✅ Pagado</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleUpdateTrackingStatus(o, 'en_preparacion', 'En Preparación')}>🛠️ Prep</button>
                                        <button onClick={() => handleUpdateTrackingStatus(o, 'en_distribucion', 'En Distribución')}>🚚 Dist</button>
                                        <button onClick={() => handleUpdateTrackingStatus(o, 'listo_para_retirar', 'Listo para Retirar')}>🏠 Listo</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}