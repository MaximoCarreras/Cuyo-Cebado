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
    const [searchTerm, setSearchTerm] = useState('');

    const initialFormState = { name: '', price: '', stock: '', category: 'mates', material: '', type: '', specs: '', badge: '', description: '', image_url: '', video_url: '' };
    const [newProduct, setNewProduct] = useState(initialFormState);
    const [newCategory, setNewCategory] = useState({ label: '', icon: '🧉', image_url: '' });

    useEffect(() => { fetchData(); }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        if (activeTab === 'inventory') {
            const { data } = await supabase.from('products').select('*').order('name');
            setProducts(data || []);
            const { data: catData } = await supabase.from('categories').select('*').order('label');
            setCategoriesList(catData || []);
        } else if (activeTab === 'orders') {
            const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            setOrders(data || []);
        } else if (activeTab === 'categories') {
            const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
            setCategoriesList(data || []);
        }
        setLoading(false);
    };

    const handleUpdateStock = async (id, field, value) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        await supabase.from('products').update({ [field]: value }).eq('id', id);
        if (field !== 'is_featured') toast.success("Sincronizado");
    };

    const handleToggleFeatured = async (product) => {
        const newValue = !product.is_featured;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: newValue } : p));
        await supabase.from('products').update({ is_featured: newValue }).eq('id', product.id);
        toast.success(newValue ? "⭐ Destacado" : "Quitado");
    };

    const uploadImage = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
            setNewProduct({ ...newProduct, image_url: data.publicUrl });
            toast.success("Imagen cargada");
        } catch (e) { toast.error("Error"); } finally { setUploading(false); }
    };

    const uploadCategoryImage = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            const fileName = `cat_${Math.random()}`;
            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
            setNewCategory({ ...newCategory, image_url: data.publicUrl });
            toast.success("Icono cargado");
        } catch (e) { toast.error("Error"); } finally { setUploading(false); }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const slug = newProduct.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const data = { ...newProduct, slug, price: Number(newProduct.price), stock: Number(newProduct.stock) };
        if (isEditing) await supabase.from('products').update(data).eq('id', editingId);
        else await supabase.from('products').insert([data]);
        toast.success("¡Guardado!");
        closeModal();
        fetchData();
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const id = newCategory.label.toLowerCase().trim().replace(/ /g, '-');
        await supabase.from('categories').insert([{ id, label: newCategory.label, icon: newCategory.icon, image_url: newCategory.image_url }]);
        toast.success("¡Categoría creada!");
        setNewCategory({ label: '', icon: '🧉', image_url: '' });
        fetchData();
    };

    const closeModal = () => { setIsModalOpen(false); setIsEditing(false); setEditingId(null); setNewProduct(initialFormState); };
    const switchTab = (tabName) => { closeModal(); setSelectedOrder(null); setActiveTab(tabName); };

    if (loading) return <div className="admin-loading-screen">Abriendo la estancia...</div>;

    return (
        <div className="admin-page">
            <Toaster position="top-right" />
            <header className="admin-sidebar-header">
                <h1>Gestión Cuyo Cebado</h1>
                <div className="tab-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => switchTab('inventory')}>Stock</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => switchTab('orders')}>Ventas</button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => switchTab('categories')}>Categorías</button>
                </div>
            </header>

            <main className="admin-content">
                {activeTab === 'inventory' && (
                    <section>
                        <div className="stats-grid">
                            <div className="stat-box"><span className="label">VARIEDAD</span><span className="number">{products.length}</span></div>
                            <div className="stat-box warning"><span className="label">STOCK BAJO</span><span className="number">{products.filter(p => p.stock < 5).length}</span></div>
                        </div>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead><tr><th>PRODUCTO</th><th>PRECIO</th><th>STOCK</th><th>DESTACAR</th><th>ACCIONES</th></tr></thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td className="product-info"><img src={p.image_url || '/assets/placeholder.png'} className="mini-thumb" />{p.name}</td>
                                            <td><input type="number" className="price-edit-input" defaultValue={p.price} onBlur={(e) => handleUpdateStock(p.id, 'price', Number(e.target.value))} /></td>
                                            <td className="stock-controls-cell"><div className="stock-controls-wrapper"><button className="btn-stock-qty" onClick={() => handleUpdateStock(p.id, 'stock', p.stock - 1)}>-</button><span>{p.stock}</span><button className="btn-stock-qty" onClick={() => handleUpdateStock(p.id, 'stock', p.stock + 1)}>+</button></div></td>
                                            <td style={{ textAlign: 'center' }}><button className={`btn-action-star ${p.is_featured ? 'active' : ''}`} onClick={() => handleToggleFeatured(p)}><span className="material-symbols-outlined">star</span></button></td>
                                            <td style={{ textAlign: 'center' }}><button onClick={() => { setIsEditing(true); setEditingId(p.id); setNewProduct(p); setIsModalOpen(true); }} className="btn-edit-action"><span className="material-symbols-outlined">edit</span></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="footer-action-panel"><button className="btn-add-premium" onClick={() => setIsModalOpen(true)}>+ NUEVO PRODUCTO</button></div>
                    </section>
                )}

                {activeTab === 'orders' && (
                    <section>
                        <div className="stats-grid">
                            <div className="stat-box"><span className="label">RECAUDADO</span><span className="number">${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</span></div>
                            <div className="stat-box"><span className="label">PEDIDOS</span><span className="number">{orders.length}</span></div>
                        </div>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead><tr><th>FECHA</th><th>CLIENTE</th><th>TOTAL</th><th>ESTADO</th><th>VER</th></tr></thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                            <td>{o.customer_name || o.customer_email}</td>
                                            <td><strong>${o.total.toLocaleString()}</strong></td>
                                            <td><span className={`status-badge-premium ${o.status}`}>{o.status === 'pending' ? 'PENDIENTE' : 'ENVIADO'}</span></td>
                                            <td style={{ textAlign: 'center' }}><button className="btn-view-modern" onClick={() => setSelectedOrder(o)}><span className="material-symbols-outlined">visibility</span></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'categories' && (
                    <section>
                        <div className="table-container" style={{ marginBottom: '30px' }}>
                            <table className="custom-table">
                                <thead><tr><th>VISUAL</th><th>NOMBRE</th><th>ID</th></tr></thead>
                                <tbody>{categoriesList.map(c => (<tr key={c.id}><td>{c.image_url ? <img src={c.image_url} style={{ width: '40px', borderRadius: '8px' }} /> : c.icon}</td><td>{c.label}</td><td>{c.id}</td></tr>))}</tbody>
                            </table>
                        </div>
                        <div className="category-creator-box">
                            <h2>Nueva Categoría</h2>
                            <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px' }}>
                                <div className="image-upload-box-premium" style={{ height: '100px' }}><input type="file" onChange={uploadCategoryImage} className="file-input-hidden" />{newCategory.image_url ? <img src={newCategory.image_url} className="image-preview" /> : "Foto"}</div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}><input className="premium-modal-input" placeholder="Nombre" value={newCategory.label} onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} /><input className="premium-modal-input" style={{ width: '80px', textAlign: 'center' }} value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} /><button type="submit" className="btn-add-premium">Crear</button></div>
                            </form>
                        </div>
                    </section>
                )}
            </main>

            {/* MODAL DE PEDIDO DETALLADO */}
            {selectedOrder && (
                <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: '550px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0 }}>Pedido #{selectedOrder.id.slice(0, 5).toUpperCase()}</h2>
                            <span className={`status-badge-premium ${selectedOrder.status}`}>{selectedOrder.status.toUpperCase()}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#a5813a', marginBottom: '5px' }}>CLIENTE</p>
                                <p style={{ margin: 0, fontWeight: '700' }}>{selectedOrder.customer_name}</p>
                                <p style={{ margin: 0, color: '#a5813a', fontWeight: '700' }}>📞 {selectedOrder.customer_phone}</p>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#a5813a', marginBottom: '5px' }}>ENTREGA</p>
                                <p style={{ margin: 0, fontWeight: '700' }}>{selectedOrder.shipping_method === 'pickup' ? '🏠 RETIRO LOCAL' : '🚚 ENVÍO DOMICILIO'}</p>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginTop: '10px' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#a5813a', marginBottom: '5px' }}>DIRECCIÓN / PUNTO</p>
                            <p style={{ margin: 0 }}>{selectedOrder.shipping_address}</p>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#a5813a', marginBottom: '10px' }}>PRODUCTOS</p>
                            {selectedOrder.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                    <span>{item.quantity}x {item.name}</span>
                                    <strong>${(item.price * item.quantity).toLocaleString()}</strong>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '25px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '800' }}>📦 CÓDIGO DE SEGUIMIENTO</label>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <input
                                    className="premium-modal-input"
                                    placeholder="Ej: Andreani 9384..."
                                    defaultValue={selectedOrder.tracking_number}
                                    onBlur={async (e) => {
                                        await supabase.from('orders').update({ tracking_number: e.target.value }).eq('id', selectedOrder.id);
                                        toast.success("Código guardado");
                                    }}
                                />
                                <button
                                    className="btn-add-premium"
                                    onClick={async () => {
                                        await supabase.from('orders').update({ status: 'shipped' }).eq('id', selectedOrder.id);
                                        setSelectedOrder({ ...selectedOrder, status: 'shipped' });
                                        toast.success("¡Pedido Despachado!");
                                        fetchData();
                                    }}
                                >
                                    DESPACHAR
                                </button>
                            </div>
                        </div>

                        <button className="btn-close-modal" style={{ marginTop: '30px', width: '100%' }} onClick={() => setSelectedOrder(null)}>Cerrar Ficha</button>
                    </div>
                </div>
            )}

            {/* MODAL NUEVO PRODUCTO (Se mantiene igual que lo tenías) */}
            {isModalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
                        <h2>{isEditing ? 'Editar Ficha' : 'Nueva Ficha'}</h2>
                        <form onSubmit={handleSaveProduct} className="modal-form-grid">
                            <div className="form-column">
                                <div className="image-upload-box-premium"><input type="file" onChange={uploadImage} className="file-input-hidden" />{newProduct.image_url ? <img src={newProduct.image_url} className="image-preview" /> : "Subir Foto"}</div>
                                <input className="premium-modal-input" placeholder="Video URL" value={newProduct.video_url} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} />
                                <textarea className="premium-modal-input" placeholder="Descripción" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            </div>
                            <div className="form-column">
                                <input className="premium-modal-input" placeholder="Nombre" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                <div className="form-split-modern"><input type="number" className="premium-modal-input" placeholder="Precio" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} /><input type="number" className="premium-modal-input" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} /></div>
                                <select className="premium-modal-input selector-premium" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>{categoriesList.map(c => (<option key={c.id} value={c.id}>{c.label}</option>))}</select>
                                <input className="premium-modal-input" placeholder="Material" value={newProduct.material} onChange={e => setNewProduct({ ...newProduct, material: e.target.value })} />
                                <div className="modal-btns-group"><button type="button" onClick={closeModal} className="cancel-btn-modern">Cerrar</button><button type="submit" className="save-btn-modern">Guardar</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}