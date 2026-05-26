import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import '../AdminDashboard.css';

export default function AdminWebSettings() {
    const [siteSettings, setSiteSettings] = useState({ banner_text: '', banner_active: true });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
        if (data) setSiteSettings(data);
        setLoading(false);
    };

    const handleUpdateSettings = async () => {
        setLoading(true);
        const { error } = await supabase.from('site_settings').update(siteSettings).eq('id', 'global');
        if (!error) toast.success("Configuración de web actualizada");
        else toast.error("Error al guardar");
        setLoading(false);
    };

    return (
        <section className="fade-in">
            <h2>🎨 Diseño Vitrina</h2>
            
            <div className="category-refined-add" style={{ maxWidth: '600px' }}>
                <div className="card-header-pro">
                    <span className="material-symbols-outlined">campaign</span>
                    <h3>Configuración Barra Dorada</h3>
                </div>
                <div className="settings-grid-pro">
                    <input 
                        className="refined-input" 
                        placeholder="Ej: ENVÍOS A TODO EL PAÍS, CALIDAD PREMIUM" 
                        value={siteSettings.banner_text || ''} 
                        onChange={e => setSiteSettings({ ...siteSettings, banner_text: e.target.value })} 
                    />
                    <div className="banner-status-control">
                        <label>Mostrar barra en la web:</label>
                        <input 
                            type="checkbox" 
                            className="premium-checkbox" 
                            checked={siteSettings.banner_active} 
                            onChange={e => setSiteSettings({ ...siteSettings, banner_active: e.target.checked })} 
                        />
                    </div>
                    <button className="btn-save-gold-full" onClick={handleUpdateSettings}>
                        {loading ? 'GUARDANDO...' : 'GUARDAR AJUSTES'}
                    </button>
                </div>
            </div>

            <div className="category-refined-add" style={{ marginTop: '30px' }}>
                <h3>Carrusel Principal</h3>
                <p style={{ color: '#64748b' }}>Próximamente: Gestión de imágenes del banner principal.</p>
            </div>
        </section>
    );
}