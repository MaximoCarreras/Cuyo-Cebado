import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [siteSettings, setSiteSettings] = useState({ banner_text: '', banner_active: true });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const initialFormState = {
        name: '', price: '', stock: 0, category: 'mates',
        material: '', type: '', specs: '', badge: '',
        description: '', image_url: '', video_url: '', extra_images: [],
        is_featured: false
    };
    const [newProduct, setNewProduct] = useState(initialFormState);
    const [newCategory, setNewCategory] = useState({ label: '', icon: '🧉', image_url: '' });

    useEffect(() => { checkAdmin(); }, []);
    useEffect(() => { if (isAdmin) fetchData(); }, [activeTab, isAdmin]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') setIsAdmin(true);
        setLoading(false);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'inventory') {
                const { data: pData } = await supabase.from('products').select('*').order('name');
                setProducts(pData || []);
                const { data: catData } = await supabase.from('categories').select('*').order('label');
                setCategoriesList(catData || []);
            } else if (activeTab === 'orders') {
                const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                setOrders(oData || []);
            } else if (activeTab === 'categories') {
                const { data: cData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
                setCategoriesList(cData || []);
            } else if (activeTab === 'settings') {
                const { data: sData } = await supabase.from('site_settings').select('*').single();
                if (sData) setSiteSettings(sData);
            } else if (activeTab === 'faq') {
                const { data: fData } = await supabase.from('faqs').select('*').order('order_index');
                setFaqs(fData || []);
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const uploadImage = async (event, type) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
            if (type === 'main') setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
            else if (type === 'category') setNewCategory(prev => ({ ...prev, image_url: data.publicUrl }));
            else setNewProduct(prev => ({ ...prev, extra_images: [...(prev.extra_images || []), data.publicUrl] }));
            toast.success("Imagen lista");
        } catch (e) { toast.error("Error al subir"); } finally { setUploading(false); }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const slug = newProduct.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const data = { ...newProduct, slug, price: Number(newProduct.price), stock: Number(newProduct.stock) };
        if (isEditing) await supabase.from('products').update(data).eq('id', editingId);
        else await supabase.from('products').insert([data]);
        toast.success("Guardado");
        closeModal();
        fetchData();
    };

    const handleUpdateSettings = async () => {
        await supabase.from('site_settings').update(siteSettings).eq('id', 'global');
        toast.success("Ajustes actualizados");
    };

    const removeMainImage = (e) => { e.preventDefault(); e.stopPropagation(); setNewProduct(prev => ({ ...prev, image_url: '' })); };
    const removeExtraImage = (e, index) => { e.preventDefault(); e.stopPropagation(); const filtered = newProduct.extra_images.filter((_, i) => i !== index); setNewProduct(prev => ({ ...prev, extra_images: filtered })); };
    const closeModal = () => { setIsModalOpen(false); setIsEditing(false); setEditingId(null); setNewProduct(initialFormState); };
    const handleTabChange = (tab) => { closeModal(); setSelectedOrder(null); setActiveTab(tab); };
    const handleUpdateField = async (id, field, value) => {
        const val = (field === 'stock' || field === 'price') ? Number(value) : value;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
        await supabase.from('products').update({ [field]: val }).eq('id', id);
    };
    const handleToggleFeatured = async (product) => {
        const newValue = !product.is_featured;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: newValue } : p));
        await supabase.from('products').update({ is_featured: newValue }).eq('id', product.id);
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="admin-loader">Abriendo la estancia...</div>;
    if (!isAdmin) return <div className="no-access-screen"><h1>Acceso Restringido</h1><p>Solo el administrador puede entrar.</p><button onClick={() => window.location.href = '/'}>Volver al Inicio</button></div>;

    return (
        <div className="admin-refined-page">
            <Toaster position="top-right" />
            <header className="admin-refined-header">
                <div className="header-info"><h1>Gestión Cuyo Cebado</h1><p>Boutique Digital Admin</p></div>
                <div className="tab-refined-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => handleTabChange('inventory')}>Stock</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}>Ventas</button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => handleTabChange('categories')}>Categorías</button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => handleTabChange('settings')}>Web</button>
                    <button className={activeTab === 'faq' ? 'active' : ''} onClick={() => handleTabChange('faq')}>FAQ</button>
                </div>
            </header>

            <main className="admin-refined-content">
                {activeTab === 'inventory' && (
                    <section className="fade-in">
                        <div className="stats-refined-grid">
                            <div className="stat-card">
                                <span className="material-symbols-outlined icon-stat">inventory_2</span>
                                <div className="stat-data"><span className="stat-label">Variedad</span><span className="stat-value">{products.length}</span></div>
                            </div>
                            <div className="stat-card critical">
                                <span className="material-symbols-outlined icon-stat">priority_high</span>
                                <div className="stat-data"><span className="stat-label">Crítico</span><span className="stat-value">{products.filter(p => p.stock < 5).length}</span></div>
                            </div>
                        </div>
                        <div className="search-bar-container">
                            <span className="material-symbols-outlined">search</span>
                            <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="table-container">
                            <table className="refined-table">
                                <thead><tr><th>PRODUCTO</th><th>PRECIO</th><th>STOCK</th><th>DESTACADO</th><th>ACCIONES</th></tr></thead>
                                <tbody>
                                    {filteredProducts.map(p => (
                                        <tr key={p.id}>
                                            <td className="cell-product"><img src={p.image_url || '/assets/placeholder.png'} className="mini-thumb" />{p.name}</td>
                                            <td>${p.price.toLocaleString()}</td>
                                            <td>
                                                <div className="refined-stock-pill">
                                                    <button className="stock-btn minus" onClick={() => handleUpdateField(p.id, 'stock', p.stock - 1)}>−</button>
                                                    <span className="stock-qty">{p.stock}</span>
                                                    <button className="stock-btn plus" onClick={() => handleUpdateField(p.id, 'stock', p.stock + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td><button className={`star-refined-btn ${p.is_featured ? 'active' : ''}`} onClick={() => handleToggleFeatured(p)}><span className="material-symbols-outlined">{p.is_featured ? 'star_rate' : 'star'}</span></button></td>
                                            <td><div className="actions-flex-row">
                                                <button onClick={() => { setIsEditing(true); setEditingId(p.id); setNewProduct(p); setIsModalOpen(true); }} className="btn-edit-modern">EDITAR</button>
                                                <button onClick={() => { if (window.confirm("¿Borrar?")) supabase.from('products').delete().eq('id', p.id).then(fetchData); }} className="btn-delete-icon-only"><span className="material-symbols-outlined">delete</span></button>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className="btn-add-main" onClick={() => setIsModalOpen(true)}><span className="material-symbols-outlined">add</span> NUEVO PRODUCTO</button>
                    </section>
                )}

                {activeTab === 'settings' && (
                    <section className="fade-in">
                        <div className="category-refined-add">
                            <div className="card-header-pro"><span className="material-symbols-outlined">settings</span><h3>Configuración Banner Superior</h3></div>
                            <div className="settings-grid-pro">
                                <input className="refined-input" placeholder="Texto del banner de ofertas..." value={siteSettings.banner_text} onChange={e => setSiteSettings({ ...siteSettings, banner_text: e.target.value })} />
                                <div className="toggle-box">
                                    <label>Banner Activo:</label>
                                    <input type="checkbox" checked={siteSettings.banner_active} onChange={e => setSiteSettings({ ...siteSettings, banner_active: e.target.checked })} />
                                </div>
                                <button className="btn-save-gold-full" onClick={handleUpdateSettings}>GUARDAR AJUSTES</button>
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ, CATEGORIES & MODAL SECTORS REMAIN SIMILAR BUT WRAPPED IN NEW REFINED STYLES */}
                {activeTab === 'categories' && (
                    <section className="fade-in">
                        <div className="table-container">
                            <table className="refined-table">
                                <thead><tr><th>ICONO</th><th>NOMBRE</th><th>ACCIONES</th></tr></thead>
                                <tbody>
                                    {categoriesList.map(c => (
                                        <tr key={c.id}>
                                            <td className="cell-icon">{c.image_url ? <img src={c.image_url} className="cat-mini-thumb" /> : c.icon}</td>
                                            <td className="cell-name"><strong>{c.label}</strong></td>
                                            <td><button className="btn-delete-pro" onClick={async () => { if (window.confirm("¿Borrar?")) { await supabase.from('categories').delete().eq('id', c.id); fetchData(); } }}>ELIMINAR</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="category-refined-add">
                            <div className="card-header-pro"><span className="material-symbols-outlined">category</span><h3>Nueva Categoría</h3></div>
                            <div className="cat-inputs">
                                <div className="cat-img-box">
                                    <input type="file" id="cat-img" className="hidden-input" onChange={(e) => uploadImage(e, 'category')} />
                                    <label htmlFor="cat-img">{newCategory.image_url ? <img src={newCategory.image_url} className="image-preview" /> : <span className="material-symbols-outlined">add_a_photo</span>}</label>
                                </div>
                                <div className="input-with-label"><label>Nombre</label><input className="refined-input" value={newCategory.label} onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} required /></div>
                                <div className="input-with-label" style={{ width: '100px' }}><label>Icono</label><input className="refined-input" style={{ textAlign: 'center' }} value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} /></div>
                                <button className="btn-save-gold-full" style={{ marginTop: '22px', height: '54px' }} onClick={async () => {
                                    const id = newCategory.label.toLowerCase().trim().replace(/ /g, '-');
                                    await supabase.from('categories').insert([{ id, label: newCategory.label, icon: newCategory.icon, image_url: newCategory.image_url }]);
                                    setNewCategory({ label: '', icon: '🧉', image_url: '' });
                                    fetchData();
                                    toast.success("Categoría creada");
                                }}>CREAR CATEGORÍA</button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {isModalOpen && (
                <div className="refined-modal-backdrop" onClick={closeModal}>
                    <div className="refined-modal-card" onClick={e => e.stopPropagation()}>
                        <header className="modal-refined-header">
                            <h2>{isEditing ? 'Editar Ficha' : 'Nueva Ficha'}</h2>
                            <button type="button" onClick={closeModal} className="btn-close-modern-circle"><span className="material-symbols-outlined">close</span></button>
                        </header>
                        <form className="modal-refined-form" onSubmit={handleSaveProduct}>
                            <div className="form-refined-grid">
                                <div className="form-side">
                                    <label className="admin-label">Foto de Portada</label>
                                    <div className="upload-refined-main">
                                        <input type="file" id="main-img" className="hidden-input" onChange={(e) => uploadImage(e, 'main')} />
                                        {newProduct.image_url ? (
                                            <div className="preview-container-main">
                                                <img src={newProduct.image_url} className="image-preview" />
                                                <button type="button" className="btn-remove-photo-pro" onClick={removeMainImage}><span className="material-symbols-outlined">delete</span></button>
                                            </div>
                                        ) : (
                                            <label htmlFor="main-img" className="placeholder-main-label"><span className="material-symbols-outlined">image</span><p>Subir portada</p></label>
                                        )}
                                    </div>
                                    <label className="admin-label">Galería de Detalles</label>
                                    <div className="extra-images-grid-admin">
                                        {newProduct.extra_images?.map((img, i) => (
                                            <div key={i} className="mini-thumb-container-pro">
                                                <img src={img} className="mini-gallery-thumb" />
                                                <button type="button" className="btn-remove-extra-pro" onClick={(e) => removeExtraImage(e, i)}>×</button>
                                            </div>
                                        ))}
                                        <div className="upload-extra-pro">
                                            <input type="file" id="extra-img" className="hidden-input" onChange={(e) => uploadImage(e, 'extra')} />
                                            <label htmlFor="extra-img"><span className="material-symbols-outlined">add_photo_alternate</span><p>Vistas</p></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-side inputs-side">
                                    <input className="refined-input" placeholder="Nombre" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                    <div className="form-split-modern">
                                        <input type="number" className="refined-input" placeholder="Precio ($)" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                        <input type="number" className="refined-input" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                    </div>
                                    <div className="form-split-modern">
                                        <input className="refined-input" placeholder="Material (Ej: Alpaca/Cuero)" value={newProduct.material} onChange={e => setNewProduct({ ...newProduct, material: e.target.value })} />
                                        <input className="refined-input" placeholder="Tipo (Ej: Imperial)" value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })} />
                                    </div>
                                    <div className="form-split-modern">
                                        <select className="refined-input selector-premium" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                            {categoriesList.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                        <input className="refined-input" placeholder="Badge (Ej: Premium)" value={newProduct.badge} onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })} />
                                    </div>
                                    <textarea className="refined-input desc-box" placeholder="Descripción principal..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                    <textarea className="refined-input desc-box" style={{ height: '80px' }} placeholder="Especificaciones (Specs)..." value={newProduct.specs} onChange={e => setNewProduct({ ...newProduct, specs: e.target.value })} />
                                    <input className="refined-input" placeholder="URL Video (Reel)" value={newProduct.video_url} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} />
                                    <div className="modal-actions-footer">
                                        <button type="button" onClick={closeModal} className="btn-modal-action discard">DESCARTAR</button>
                                        <button type="submit" className="btn-modal-action save" disabled={uploading}>GUARDAR CAMBIOS</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}