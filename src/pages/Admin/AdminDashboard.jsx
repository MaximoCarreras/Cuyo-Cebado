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
        toast.success(newValue ? "⭐ En portada" : "Quitado");
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) { toast.success("Borrado"); fetchData(); }
        }
    };

    const uploadImage = async (event, type) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;

            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);

            if (type === 'main') {
                setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
                toast.success("Portada lista");
            } else if (type === 'category') {
                setNewCategory(prev => ({ ...prev, image_url: data.publicUrl }));
                toast.success("Imagen de categoría lista");
            } else {
                setNewProduct(prev => ({ ...prev, extra_images: [...(prev.extra_images || []), data.publicUrl] }));
                toast.success("Agregada a galería");
            }
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

    if (loading) return <div className="admin-loader">Cargando la estancia...</div>;

    return (
        <div className="admin-refined-page">
            <Toaster position="top-right" />
            <header className="admin-refined-header">
                <div className="header-info">
                    <h1>Gestión Cuyo Cebado</h1>
                    <p>Panel de Administración Premium</p>
                </div>
                <div className="tab-refined-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => handleTabChange('inventory')}>Stock</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}>Ventas</button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => handleTabChange('categories')}>Categorías</button>
                </div>
            </header>

            <main className="admin-refined-content">
                {activeTab === 'inventory' && (
                    <section className="fade-in">
                        <div className="stats-refined-grid">
                            <div className="stat-card">
                                <span className="material-symbols-outlined">inventory_2</span>
                                <div className="stat-data">
                                    <span className="stat-label">Variedad Total</span>
                                    <span className="stat-value">{products.length}</span>
                                </div>
                            </div>
                            <div className="stat-card warning">
                                <span className="material-symbols-outlined">warning</span>
                                <div className="stat-data">
                                    <span className="stat-label">Stock Crítico</span>
                                    <span className="stat-value">{products.filter(p => p.stock < 5).length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="table-refined-wrapper">
                            <table className="refined-table">
                                <thead>
                                    <tr>
                                        <th>PRODUCTO</th>
                                        <th>PRECIO</th>
                                        <th>STOCK</th>
                                        <th>ESTADO</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td className="cell-product">
                                                <img src={p.image_url || '/assets/placeholder.png'} alt="" />
                                                <span>{p.name}</span>
                                            </td>
                                            <td className="cell-price">${p.price.toLocaleString()}</td>
                                            <td className="cell-stock">
                                                <div className="refined-stock-pill">
                                                    <button onClick={() => handleUpdateField(p.id, 'stock', p.stock - 1)}>−</button>
                                                    <span>{p.stock}</span>
                                                    <button onClick={() => handleUpdateField(p.id, 'stock', p.stock + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td className="cell-star">
                                                <button className={`star-btn ${p.is_featured ? 'active' : ''}`} onClick={() => handleToggleFeatured(p)}>
                                                    <span className="material-symbols-outlined">{p.is_featured ? 'stars' : 'star'}</span>
                                                </button>
                                            </td>
                                            <td className="cell-actions">
                                                <div className="action-btns">
                                                    <button className="btn-edit" onClick={() => { setIsEditing(true); setEditingId(p.id); setNewProduct(p); setIsModalOpen(true); }}>EDITAR</button>
                                                    <button className="btn-delete" onClick={() => handleDeleteProduct(p.id)}><span className="material-symbols-outlined">delete</span></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className="btn-add-main" onClick={() => setIsModalOpen(true)}>
                            <span className="material-symbols-outlined">add</span> NUEVO PRODUCTO
                        </button>
                    </section>
                )}

                {activeTab === 'orders' && (
                    <section className="fade-in">
                        <div className="table-refined-wrapper">
                            <table className="refined-table">
                                <thead>
                                    <tr><th>FECHA</th><th>CLIENTE</th><th>TOTAL</th><th>ESTADO</th><th>ACCIONES</th></tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                            <td>{o.customer_name}</td>
                                            <td className="cell-price">${o.total.toLocaleString()}</td>
                                            <td><span className={`status-tag ${o.status}`}>{o.status.toUpperCase()}</span></td>
                                            <td><button className="btn-edit" onClick={() => setSelectedOrder(o)}>VER DETALLES</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'categories' && (
                    <section className="fade-in">
                        <div className="table-refined-wrapper">
                            <table className="refined-table">
                                <thead><tr><th>ICONO</th><th>NOMBRE</th><th>ACCIONES</th></tr></thead>
                                <tbody>
                                    {categoriesList.map(c => (
                                        <tr key={c.id}>
                                            <td className="cell-icon">{c.image_url ? <img src={c.image_url} alt="" /> : c.icon}</td>
                                            <td className="cell-name">{c.label}</td>
                                            <td><button className="btn-delete" onClick={async () => { if (window.confirm("¿Borrar?")) { await supabase.from('categories').delete().eq('id', c.id); fetchData(); } }}>ELIMINAR</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="category-refined-add">
                            <h3>Nueva Categoría</h3>
                            <div className="cat-inputs">
                                <div className="cat-img-box">
                                    <input type="file" id="cat-img" className="hidden-input" onChange={(e) => uploadImage(e, 'category')} />
                                    <label htmlFor="cat-img">
                                        {newCategory.image_url ? <img src={newCategory.image_url} alt="" /> : <span className="material-symbols-outlined">add_a_photo</span>}
                                    </label>
                                </div>
                                <input type="text" placeholder="Nombre" value={newCategory.label} onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} />
                                <input type="text" placeholder="Icono" value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} />
                                <button className="btn-save" onClick={async () => {
                                    const id = newCategory.label.toLowerCase().trim().replace(/ /g, '-');
                                    await supabase.from('categories').insert([{ id, label: newCategory.label, icon: newCategory.icon, image_url: newCategory.image_url }]);
                                    setNewCategory({ label: '', icon: '🧉', image_url: '' });
                                    fetchData();
                                    toast.success("Creada");
                                }}>CREAR</button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* MODAL REFINADO */}
            {isModalOpen && (
                <div className="refined-modal-backdrop" onClick={closeModal}>
                    <div className="refined-modal-card" onClick={e => e.stopPropagation()}>
                        <header className="modal-refined-header">
                            <h2>{isEditing ? 'Editar Ficha' : 'Nueva Ficha'}</h2>
                            <button className="btn-close" onClick={closeModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </header>
                        <form className="modal-refined-form" onSubmit={handleSaveProduct}>
                            <div className="form-refined-grid">
                                <div className="form-side">
                                    <label>Foto de Portada</label>
                                    <div className="upload-refined-main">
                                        <input type="file" id="main-img" className="hidden-input" onChange={(e) => uploadImage(e, 'main')} />
                                        <label htmlFor="main-img">
                                            {newProduct.image_url ? <img src={newProduct.image_url} alt="" /> : <div className="placeholder"><span className="material-symbols-outlined">cloud_upload</span><p>Subir portada</p></div>}
                                        </label>
                                    </div>
                                    <label>Galería (Otras vistas)</label>
                                    <div className="extra-refined-grid">
                                        {newProduct.extra_images?.map((img, i) => <img key={i} src={img} alt="" className="mini-thumb" />)}
                                        <div className="upload-extra">
                                            <input type="file" id="extra-img" className="hidden-input" onChange={(e) => uploadImage(e, 'extra')} />
                                            <label htmlFor="extra-img">+</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-side inputs-side">
                                    <input className="refined-input" placeholder="Nombre del mate" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                    <div className="input-row">
                                        <input type="number" className="refined-input" placeholder="Precio ($)" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                        <input type="number" className="refined-input" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                    </div>
                                    <select className="refined-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                        {categoriesList.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                    <textarea className="refined-input" placeholder="Descripción detallada..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                    <input className="refined-input" placeholder="Link Video (Reel/YouTube)" value={newProduct.video_url} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-refined-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal}>DESCARTAR</button>
                                <button type="submit" className="btn-save" disabled={uploading}>
                                    {uploading ? 'CARGANDO...' : 'GUARDAR CAMBIOS'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}