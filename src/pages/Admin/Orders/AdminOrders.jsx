import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setTabLoading(true);
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        setOrders(data || []);
        setTabLoading(false);
    };

    const sendWhatsApp = (order, status) => {
        const phone = order.customer_phone?.replace(/\D/g, '');
        const msg = encodeURIComponent(`Hola ${order.customer_name}, tu pedido de Cuyo Cebado ha cambiado a estado: ${status}. ¡Gracias!`);
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    };

    const updateStatus = async (order, newTracking, statusName) => {
        const { error } = await supabase.from('orders').update({ tracking_status: newTracking }).eq('id', order.id);
        if (!error) {
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, tracking_status: newTracking } : o));
            toast.success('Logística actualizada');
            sendWhatsApp(order, statusName);
        }
    };

    return (
        <div className="fade-in">
            <h2>Gestión de Ventas</h2>
            {tabLoading ? <p>Cargando...</p> : (
                <table className="refined-table">
                    <thead><tr><th>Cliente</th><th>Estado</th><th>Logística</th></tr></thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>{o.customer_name}</td>
                                <td>{o.status}</td>
                                <td>
                                    <button onClick={() => updateStatus(o, 'en_preparacion', 'En Preparación')}>🛠️ Prep</button>
                                    <button onClick={() => updateStatus(o, 'en_distribucion', 'En Distribución')}>🚚 Dist</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}