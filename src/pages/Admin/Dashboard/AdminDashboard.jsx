import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

// Importamos los nuevos módulos
import AdminInventory from './Inventory/AdminInventory';
import AdminOrders from './Orders/AdminOrders';
import AdminCategories from './Categories/AdminCategories';
import AdminSettings from './Settings/AdminSettings';
import AdminFAQ from './FAQ/AdminFAQ';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [isAdmin, setIsAdmin] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => { checkAdmin(); }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setInitialLoading(false); return; }
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') setIsAdmin(true);
        setInitialLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/'; 
    };

    if (initialLoading) return <div className="admin-loader">Abriendo la estancia...</div>;
    if (!isAdmin) return <div className="no-access-screen"><h1>Acceso Restringido</h1><button onClick={() => window.location.href = '/'}>Volver</button></div>;

    return (
        <div className="admin-refined-page">
            <Toaster position="top-right" />
            <header className="admin-refined-header">
                <div className="header-info">
                    <h1>Gestión Cuyo Cebado</h1>
                </div>
                <button onClick={handleLogout} className="btn-logout" style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>SALIR</button>
                <div className="tab-refined-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Stock</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Ventas</button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>Categorías</button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Web</button>
                    <button className={activeTab === 'faq' ? 'active' : ''} onClick={() => setActiveTab('faq')}>FAQ</button>
                </div>
            </header>

            <main className="admin-refined-content">
                {activeTab === 'inventory' && <AdminInventory />}
                {activeTab === 'orders' && <AdminOrders />}
                {activeTab === 'categories' && <AdminCategories />}
                {activeTab === 'settings' && <AdminSettings />}
                {activeTab === 'faq' && <AdminFAQ />}
            </main>
        </div>
    );
}