import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './AdminLayout.css';

export default function AdminLayout() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { 
            setInitialLoading(false); 
            return; 
        }
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') setIsAdmin(true);
        setInitialLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/'); 
    };

    if (initialLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Abriendo la estancia...</div>;
    
    if (!isAdmin) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h1>Acceso Restringido</h1>
                <p>Solo personal autorizado.</p>
                <button onClick={() => navigate('/')}>Volver al Inicio</button>
            </div>
        );
    }

    return (
        <div className="admin-layout-container">
            <Toaster position="top-right" />
            
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Cuyo Cebado</h2>
                    <p>Boutique Digital Admin</p>
                </div>

                {/* ACÁ ESTABA EL ERROR: AGREGUÉ TODOS LOS BOTONES DEL ERP */}
                <nav className="sidebar-nav">
                    <NavLink to="/admin" end className="nav-item">📊 Dashboard</NavLink>
                    <NavLink to="/admin/ventas" className="nav-item">🚚 Logística y Ventas</NavLink>
                    <NavLink to="/admin/stock" className="nav-item">📦 Catálogo e Inventario</NavLink>
                    <NavLink to="/admin/categorias" className="nav-item">🏷️ Categorías</NavLink>
                    <NavLink to="/admin/compras" className="nav-item">🏭 Compras Mayoristas</NavLink>
                    <NavLink to="/admin/vitrina" className="nav-item">🎨 Diseño Vitrina</NavLink>
                    <NavLink to="/admin/faq" className="nav-item">💬 FAQ y Guías</NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout-pro">
                        <span className="material-symbols-outlined">logout</span> SALIR
                    </button>
                </div>
            </aside>

            <main className="admin-main-content">
                <Outlet /> 
            </main>
        </div>
    );
}