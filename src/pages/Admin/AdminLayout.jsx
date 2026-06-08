import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './AdminGlobal.css';
import './AdminLayout.css';

export default function AdminLayout() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    // 🔥 NUEVO ESTADO: Para abrir/cerrar el menú en el celular
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    // Función para cerrar el menú en celular después de hacer clic en un enlace
    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
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
            
            {/* 🔥 BOTÓN EXCLUSIVO PARA CELULARES */}
            <div className="admin-mobile-header">
                <div className="admin-mobile-title">
                    <h2>Cuyo Cebado</h2>
                    <p>Panel de Control</p>
                </div>
                <button 
                    className="admin-mobile-toggle" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="material-symbols-outlined">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                    <span>Menú Admin</span>
                </button>
            </div>
            
            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header desktop-only">
                    <h2>Cuyo Cebado</h2>
                    <p>Boutique Digital Admin</p>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/admin" end className="nav-item" onClick={handleNavClick}>📊 Dashboard</NavLink>
                    <NavLink to="/admin/ventas" className="nav-item" onClick={handleNavClick}>🚚 Logística y Ventas</NavLink>
                    <NavLink to="/admin/stock" className="nav-item" onClick={handleNavClick}>📦 Catálogo e Inventario</NavLink>
                    <NavLink to="/admin/categorias" className="nav-item" onClick={handleNavClick}>🏷️ Categorías</NavLink>
                    <NavLink to="/admin/compras" className="nav-item" onClick={handleNavClick}>🏭 Compras Mayoristas</NavLink>
                    <NavLink to="/admin/vitrina" className="nav-item" onClick={handleNavClick}>🎨 Diseño Vitrina</NavLink>
                    <NavLink to="/admin/faq" className="nav-item" onClick={handleNavClick}>💬 FAQ y Guías</NavLink>
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