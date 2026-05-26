import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import '../AdminDashboard.css';

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
        // Traemos datos básicos
        const { data: orders } = await supabase.from('orders').select('total, status, created_at');
        const { data: users } = await supabase.from('profiles').select('id', { count: 'exact' });

        if (orders) {
            const total = orders.reduce((sum, o) => sum + (o.total || 0), 0);
            const pending = orders.filter(o => o.status === 'pending').length;
            setStats({
                totalSales: total,
                pendingOrders: pending,
                totalUsers: users?.length || 0,
                recentOrders: orders.slice(0, 5)
            });
        }
        setLoading(false);
    };

    return (
        <section className="fade-in">
            <h2 style={{ fontFamily: 'Noto Serif, serif', color: '#a5813a', marginBottom: '30px' }}>📊 Centro de Comando</h2>

            {loading ? (
                <p>Calculando métricas...</p>
            ) : (
                <>
                    <div className="stats-refined-grid">
                        <div className="stat-card">
                            <span className="material-symbols-outlined icon-stat">payments</span>
                            <div className="stat-data">
                                <span className="stat-label">Facturación Total</span>
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
                                <span className="stat-label">Usuarios Reg.</span>
                                <span className="stat-value">{stats.totalUsers}</span>
                            </div>
                        </div>
                    </div>

                    <div className="category-refined-add" style={{ marginTop: '30px' }}>
                        <h3>Últimas Ventas</h3>
                        <table className="refined-table">
                            <thead>
                                <tr><th>FECHA</th><th>TOTAL</th><th>ESTADO</th></tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((o, i) => (
                                    <tr key={i}>
                                        <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                        <td>${o.total?.toLocaleString()}</td>
                                        <td>{o.status}</td>
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