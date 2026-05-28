import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import './AdminWebSettings.css';

export default function AdminWebSettings() {
    // --- ESTADOS: BARRA DORADA ---
    const [siteSettings, setSiteSettings] = useState({ banner_text: '', banner_active: true });
    const [loadingSettings, setLoadingSettings] = useState(true);

    // --- ESTADOS: CARRUSEL ---
    const [carouselPosts, setCarouselPosts] = useState([]);
    const [postUrl, setPostUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploadingCarousel, setUploadingCarousel] = useState(false);

    useEffect(() => {
        fetchSettings();
        fetchCarouselPosts();
    }, []);

    // Traer config de la barra
    const fetchSettings = async () => {
        const { data } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
        if (data) setSiteSettings(data);
        setLoadingSettings(false);
    };

    // Guardar config de la barra
    const handleUpdateSettings = async () => {
        setLoadingSettings(true);
        const { error } = await supabase.from('site_settings').update(siteSettings).eq('id', 'global');
        if (!error) toast.success("Configuración de web actualizada");
        else toast.error("Error al guardar la barra");
        setLoadingSettings(false);
    };

    // Traer fotos del carrusel
    const fetchCarouselPosts = async () => {
        const { data } = await supabase
            .from('instagram_posts') // Usamos tu tabla actual
            .select('*')
            .order('created_at', { ascending: false });
        setCarouselPosts(data || []);
    };

    // Manejar selección de foto
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
    };

    // Subir foto al carrusel
    const handleUploadCarousel = async (e) => {
        e.preventDefault();
        if (!imageFile || !postUrl) {
            toast.error('Falta la imagen o el enlace.');
            return;
        }

        setUploadingCarousel(true);
        try {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `carrusel/img_${Date.now()}.${fileExt}`;
            
            // Subir al bucket
            const { error: uploadError } = await supabase.storage.from('productos').upload(fileName, imageFile);
            if (uploadError) throw uploadError;

            // Obtener URL
            const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(fileName);

            // Guardar en base de datos
            const { error: insertError } = await supabase.from('instagram_posts').insert([
                { image_url: publicUrl, post_url: postUrl }
            ]);
            if (insertError) throw insertError;

            toast.success('¡Imagen añadida a la vitrina! 🚀');
            setPostUrl('');
            setImageFile(null);
            document.getElementById('carousel-file-input').value = '';
            fetchCarouselPosts();
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setUploadingCarousel(false);
        }
    };

    // Eliminar foto del carrusel
    const handleDeleteCarouselImage = async (id) => {
        if (!window.confirm('¿Seguro que querés quitar esta imagen del inicio?')) return;
        try {
            await supabase.from('instagram_posts').delete().eq('id', id);
            toast.success('Imagen eliminada de la web.');
            fetchCarouselPosts();
        } catch (error) {
            toast.error('No se pudo eliminar.');
        }
    };

    return (
        <section className="fade-in">
            <h2>🎨 Diseño Vitrina</h2>
            
            {/* SECCIÓN 1: BARRA DORADA */}
            <div className="category-refined-add" style={{ maxWidth: '700px', marginBottom: '30px' }}>
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
                        {loadingSettings ? 'GUARDANDO...' : 'GUARDAR AJUSTES'}
                    </button>
                </div>
            </div>

            {/* SECCIÓN 2: CARRUSEL PRINCIPAL */}
            <div className="category-refined-add">
                <div className="card-header-pro">
                    <span className="material-symbols-outlined">view_carousel</span>
                    <h3>Gestor del Carrusel (Inicio)</h3>
                </div>
                <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Las fotos subidas acá aparecerán automáticamente en la página principal de los clientes. Podés vincularlas a un Reel de Instagram o a un producto.
                </p>

                {/* Formulario de Carga */}
                <form onSubmit={handleUploadCarousel} className="form-row-carousel">
                    <div className="input-with-label" style={{ flex: 1 }}>
                        <label className="admin-label">Enlace / Link destino</label>
                        <input 
                            type="url" 
                            className="refined-input" 
                            placeholder="https://www.instagram.com/..." 
                            value={postUrl}
                            onChange={(e) => setPostUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-with-label">
                        <label className="admin-label">Foto o Portada</label>
                        <input 
                            type="file" 
                            id="carousel-file-input"
                            className="refined-input file-input-pro"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-save-gold-full" style={{ width: 'auto', padding: '14px 25px' }} disabled={uploadingCarousel}>
                        {uploadingCarousel ? 'SUBIENDO...' : 'AÑADIR FOTO'}
                    </button>
                </form>

                {/* Galería Actual */}
                <h4 style={{ marginTop: '40px', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                    Fotos Visibles en la Web ({carouselPosts.length})
                </h4>
                
                {carouselPosts.length === 0 ? (
                    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No hay imágenes cargadas en el carrusel.</p>
                ) : (
                    <div className="carousel-grid-pro">
                        {carouselPosts.map((post) => (
                            <div key={post.id} className="carousel-card-pro">
                                <div className="carousel-img-wrapper">
                                    <img src={post.image_url} alt="Carrusel" />
                                </div>
                                <div className="carousel-actions">
                                    <a href={post.post_url} target="_blank" rel="noreferrer" className="link-preview-pro">
                                        Probar Enlace ↗
                                    </a>
                                    <button 
                                        type="button"
                                        onClick={() => handleDeleteCarouselImage(post.id)}
                                        className="btn-delete-pro"
                                        style={{ width: '100%' }}
                                    >
                                        QUITAR
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}