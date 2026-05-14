import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

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

    useEffect(() => { fetchData(); }, [activeTab]);

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
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setNewProduct(initialFormState);
    };

    const handleTabChange = (tab) => {
        closeModal();
        setSelectedOrder(null);
        setActiveTab(tab);
    };

    const handleUpdateField = async (id, field, value) => {
        const val = (field === 'stock' || field === 'price') ? Number(value) : value;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
        await supabase.from('products').update({ [field]: val }).eq('id', id);
        toast.success("Actualizado");
    };

    const handleToggleFeatured = async (product) => {
        const newValue = !product.is_featured;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: newValue } : p));
        await supabase.from('products').update({ is_featured: newValue }).eq('id', product.id);
        toast.success(newValue ? "⭐ Destacado" : "Quitado de portada");
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("¿Estás seguro de que querés borrar este producto? Esta acción no se puede deshacer.")) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) {
                toast.success("Producto eliminado");
                fetchData();
            } else {
                toast.error("Error al eliminar");
            }
        }
    };

    const uploadImage = async (event, type) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileName = `${Date.now()}_${file.name}`;

            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);

            if (type === 'main') {
                setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
                toast.success("Imagen de portada cargada");
            } else {
                setNewProduct(prev => ({ ...prev, extra_images: [...(prev.extra_images || []), data.publicUrl] }));
                toast.success("Imagen agregada a la galería");
            }
        } catch (e) {
            toast.error("Error al subir imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const slug = newProduct.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const data = { ...newProduct, slug, price: Number(newProduct.price), stock: Number(newProduct.stock) };

        if (isEditing) await supabase.from('products').update(data).eq('id', editingId);
        else await supabase.from('products').insert([data]);

        toast.success("¡Guardado correctamente!");
        closeModal();
        fetchData();
    };

    if (loading) return <div className="admin-loading-screen">Abriendo la estancia...</div>;

    return (
        <div className="admin-page">
            <Toaster position="top-right" />
            <header className="admin-sidebar-header">
                <h1>Gestión Cuyo Cebado</h1>
                <div className="tab-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => handleTabChange('inventory')}>Stock</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}>Ventas</button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => handleTabChange('categories')}>Categorías</button>
                </div>
            </header>

            <main className="admin-content">
                {activeTab === 'inventory' && (
                    <section className="animate-fade">
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="material-symbols-outlined icon-stat">inventory_2</span>
                                <div>
                                    <span className="label">VARIEDAD TOTAL</span>
                                    <span className="number">{products.length}</span>
                                </div>
                            </div>
                            <div className="stat-box warning">
                                <span className="material-symbols-outlined icon-stat">warning</span>
                                <div>
                                    <span className="label">STOCK CRÍTICO</span>
                                    <span className="number">{products.filter(p => p.stock < 5).length}</span>
                                </div>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>PRODUCTO</th>
                                        <th>PRECIO</th>
                                        <th>STOCK</th>
                                        <th>ESTRELLA</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td className="product-info">
                                                <img src={p.image_url || '/assets/placeholder.png'} className="mini-thumb" alt="" />
                                                {p.name}
                                            </td>
                                            <td><span className="price-tag">${p.price.toLocaleString()}</span></td>
                                            <td className="stock-controls-cell">
                                                <div className="stock-pill">
                                                    <button className="stock-btn minus" onClick={() => handleUpdateField(p.id, 'stock', p.stock - 1)}>−</button>
                                                    <span className="stock-qty">{p.stock}</span>
                                                    <button className="stock-btn plus" onClick={() => handleUpdateField(p.id, 'stock', p.stock + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn-star-featured ${p.is_featured ? 'active' : ''}`}
                                                    onClick={() => handleToggleFeatured(p)}
                                                >
                                                    <span className="material-symbols-outlined">star</span>
                                                </button>
                                            </td>
                                            <td>
                                                <div className="actions-flex">
                                                    <button onClick={() => { setIsEditing(true); setEditingId(p.id); setNewProduct(p); setIsModalOpen(true); }} className="btn-edit-modern">EDITAR</button>
                                                    <button onClick={() => handleDeleteProduct(p.id)} className="btn-delete-icon-only">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="footer-action-panel">
                            <button className="btn-add-premium" onClick={() => setIsModalOpen(true)}>
                                <span className="material-symbols-outlined">add_circle</span> NUEVO PRODUCTO
                            </button>
                        </div>
                    </section>
                )}

                {activeTab === 'orders' && (
                    <section className="animate-fade">
                        <div className="table-container">
                            <table className="custom-table">
                                <thead><tr><th>FECHA</th><th>CLIENTE</th><th>TOTAL</th><th>ESTADO</th><th>VER</th></tr></thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                            <td>{o.customer_name}</td>
                                            <td><strong>${o.total.toLocaleString()}</strong></td>
                                            <td><span className={`status-badge-premium ${o.status}`}>{o.status.toUpperCase()}</span></td>
                                            <td><button className="btn-view-modern" onClick={() => setSelectedOrder(o)}>DETALLES</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'categories' && (
                    <section className="animate-fade">
                        <div className="table-container">
                            <table className="custom-table">
                                <thead><tr><th>VISUAL</th><th>NOMBRE</th><th>ACCIONES</th></tr></thead>
                                <tbody>
                                    {categoriesList.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.image_url ? <img src={c.image_url} className="cat-mini-thumb" alt="" /> : <span className="cat-icon-large">{c.icon}</span>}</td>
                                            <td><strong>{c.label}</strong></td>
                                            <td><button className="btn-delete-modern" onClick={async () => { if (window.confirm("¿Borrar categoría?")) { await supabase.from('categories').delete().eq('id', c.id); fetchData(); } }}>ELIMINAR</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="category-creator-card-modern">
                            <h3>Nueva Categoría</h3>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const id = newCategory.label.toLowerCase().trim().replace(/ /g, '-');
                                await supabase.from('categories').insert([{ id, label: newCategory.label, icon: newCategory.icon, image_url: newCategory.image_url }]);
                                toast.success("Categoría creada");
                                setNewCategory({ label: '', icon: '🧉', image_url: '' });
                                fetchData();
                            }} className="cat-modern-grid">
                                <div className="upload-container-mini">
                                    <input type="file" id="cat-img" className="hidden-input" onChange={async (e) => {
                                        const file = e.target.files[0];
                                        const name = `cat_${Date.now()}`;
                                        await supabase.storage.from('productos').upload(name, file);
                                        const { data } = supabase.storage.from('productos').getPublicUrl(name);
                                        setNewCategory({ ...newCategory, image_url: data.publicUrl });
                                    }} />
                                    <label htmlFor="cat-img" className="upload-box-mini">
                                        {newCategory.image_url ? <img src={newCategory.image_url} className="image-preview" alt="" /> : <span className="material-symbols-outlined">add_a_photo</span>}
                                    </label>
                                </div>
                                <input className="modern-admin-input" placeholder="Nombre" value={newCategory.label} onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} required />
                                <input className="modern-admin-input icon-input" placeholder="Icono" value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} />
                                <button type="submit" className="btn-save-gold-small">CREAR CATEGORÍA</button>
                            </form>
                        </div>
                    </section>
                )}
            </main>

            {/* MODAL PRODUCTO */}
            {(isModalOpen || selectedOrder) && (
                <div className="modal-backdrop" onClick={closeModal}>
                    {isModalOpen && (
                        <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
                            <div className="modal-header-premium">
                                <h2>{isEditing ? 'Editar Ficha' : 'Nueva Ficha'}</h2>
                                <button type="button" onClick={closeModal} className="btn-close-modern-circle">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleSaveProduct} className="modal-form-grid">
                                <div className="form-column">
                                    <label className="admin-label">Foto de Portada</label>
                                    <div className="upload-container-main">
                                        <input type="file" id="main-img" className="hidden-input" onChange={(e) => uploadImage(e, 'main')} />
                                        <label htmlFor="main-img" className="image-upload-box-premium">
                                            {newProduct.image_url ? <img src={newProduct.image_url} className="image-preview" alt="" /> : <div className="upload-placeholder"><span className="material-symbols-outlined">image</span><p>Subir foto principal</p></div>}
                                        </label>
                                    </div>

                                    <label className="admin-label">Galería de Detalles (Extras)</label>
                                    <div className="extra-images-grid-admin">
                                        {newProduct.extra_images?.map((img, i) => <img key={i} src={img} className="mini-gallery-thumb" alt="" />)}
                                        <div className="upload-container-extra">
                                            <input type="file" id="extra-img" className="hidden-input" onChange={(e) => uploadImage(e, 'extra')} />
                                            <label htmlFor="extra-img" className="add-extra-box-modern">
                                                <span className="material-symbols-outlined">add_photo_alternate</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-column">
                                    <input className="modern-admin-input" placeholder="Nombre del producto" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                    <div className="form-split-modern">
                                        <input type="number" className="modern-admin-input" placeholder="Precio ($)" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                        <input type="number" className="modern-admin-input" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                    </div>
                                    <select className="modern-admin-input selector-premium" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                        {categoriesList.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                    <textarea className="modern-admin-input desc-box" placeholder="Descripción detallada..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                    <input className="modern-admin-input" placeholder="URL Video (Instagram/YouTube)" value={newProduct.video_url} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} />

                                    <div className="modal-actions-footer">
                                        <button type="button" onClick={closeModal} className="btn-discard-modern">DESCARTAR</button>
                                        <button type="submit" className="btn-save-gold-full" disabled={uploading}>GUARDAR CAMBIOS</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {selectedOrder && (
                        <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: '500px' }}>
                            <div className="modal-header-premium">
                                <h2>Pedido #{selectedOrder.id.slice(0, 5).toUpperCase()}</h2>
                                <button type="button" onClick={() => setSelectedOrder(null)} className="btn-close-modern-circle"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <div className="order-details-pro">
                                <p><strong>Cliente:</strong> {selectedOrder.customer_name}</p>
                                <p><strong>Dirección:</strong> {selectedOrder.shipping_address}</p>
                                <div className="order-items-summary">
                                    {selectedOrder.items.map((it, i) => <div key={i} className="item-row"><span>{it.quantity}x {it.name}</span><span>${(it.price * it.quantity).toLocaleString()}</span></div>)}
                                </div>
                                <div className="order-total-row"><span>TOTAL</span><span>${selectedOrder.total.toLocaleString()}</span></div>
                            </div>
                            <button type="button" className="btn-save-gold-full" style={{ marginTop: '20px' }} onClick={() => setSelectedOrder(null)}>CERRAR</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}