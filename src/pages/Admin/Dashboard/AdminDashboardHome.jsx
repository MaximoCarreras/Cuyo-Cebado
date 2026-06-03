import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

// Diccionario traductor de estados (de Mercado Pago/Supabase a Español)
const statusTranslator = {
    paid: 'PAGADO',
    approved: 'APROBADO',
    pending: 'PENDIENTE',
    rejected: 'RECHAZADO',
    cancelled: 'CANCELADO',
    shipped: 'ENVIADO',
    delivered: 'ENTREGADO',
    in_process: 'EN PROCESO'
};

export default function AdminDashboardHome() {
    const [stats, setStats] = useState({
        totalSales: 0,
        pendingOrders: 0,
        totalUsers: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        
        // Traemos órdenes y perfil de usuarios
        const { data: orders } = await supabase.from('orders').select('total, status, created_at');
        const { count: usersCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true });

        if (orders) {
            // Facturación total: Sumamos tanto 'approved' (viejo) como 'paid' (nuevo webhook)
            const total = orders
                .filter(o => o.status === 'approved' || o.status === 'paid')
                .reduce((sum, o) => sum + (o.total || 0), 0);
            
            // Pedidos pendientes: Contamos los que siguen como 'pending'
            const pending = orders.filter(o => o.status === 'pending').length;
            
            setStats({
                totalSales: total,
                pendingOrders: pending,
                totalUsers: usersCount || 0,
                recentOrders: orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
            });
        }
        setLoading(false);
    };

    return (
        <section className="fade-in">
            <h2 style={{ fontFamily: 'Noto Serif, serif', color: '#a5813a', marginBottom: '30px' }}>📊 Centro de Comando</h2>

            {loading ? (
                <p>Calculando métricas reales...</p>
            ) : (
                <>
                    <div className="stats-refined-grid">
                        <div className="stat-card">
                            <span className="material-symbols-outlined icon-stat">payments</span>
                            <div className="stat-data">
                                <span className="stat-label">Facturación Real (Cobrado)</span>
                                <span className="stat-value">${stats.totalSales.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="material-symbols-outlined icon-stat">pending_actions</span>
                            <div className="stat-data">
                                <span className="stat-label">Pedidos Pendientes</span>
                                <span className="stat-value">{stats.pendingOrders}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="material-symbols-outlined icon-stat">group</span>
                            <div className="stat-data">
                                <span className="stat-label">Clientes Registrados</span>
                                <span className="stat-value">{stats.totalUsers}</span>
                            </div>
                        </div>
                    </div>

                    <div className="category-refined-add" style={{ marginTop: '30px' }}>
                        <h3>Últimas Operaciones</h3>
                        <table className="refined-table">
                            <thead>
                                <tr><th>FECHA</th><th>TOTAL</th><th>ESTADO</th></tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((o, i) => (
                                    <tr key={i}>
                                        <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                        <td>${o.total?.toLocaleString()}</td>
                                        <td>
                                            {/* Usamos el traductor, si no lo encuentra lo pone en mayúsculas por defecto */}
                                            <span className={`status-badge ${o.status}`}>
                                                {statusTranslator[o.status?.toLowerCase()] || o.status?.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}