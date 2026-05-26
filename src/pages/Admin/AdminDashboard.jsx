import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
    // Solo dejamos los estados base para que cargue
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

    if (initialLoading) return <div>Cargando...</div>;
    if (!isAdmin) return <div>Acceso denegado</div>;

    return (
        <div className="admin-container">
            <Toaster />
            <h1>Panel de Administración</h1>
            <p>El panel está limpio. Ahora puedes ir pegando tu código viejo aquí debajo, asegurándote de no traer los imports de carpetas borradas.</p>
        </div>
    );
}