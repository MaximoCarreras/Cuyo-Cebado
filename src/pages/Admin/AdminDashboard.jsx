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

    const initialFormState = {
        name: '', price: '', stock: 0, category: 'mates',
        material: '', type: '', specs: '', badge: '',
        description: '', image_url: '', video_url: '',
        extra_images: []
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
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleUpdateField = async (id, field, value) => {
        const updatedValue = field === 'stock' || field === 'price' ? Number(value) : value;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: updatedValue } : p));
        await supabase.from('products').update({ [field]: updatedValue }).eq('id', id);
        toast.success("Actualizado");
    };

    const uploadImage = async (event, isExtra = false) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);

            if (isExtra) {
                setNewProduct(prev => ({
                    ...prev,
                    extra_images: [...(prev.extra_images || []), data.publicUrl]
                }));
            } else {
                setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
            }
            toast.success("Imagen cargada");
        } catch (e) { toast.error("Error al subir"); } finally { setUploading(false); }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const slug = newProduct.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const data = {
            ...newProduct,
            slug,
            price: Number(newProduct.price),
            stock: Number(newProduct.stock),
            extra_images: newProduct.extra_images || []
        };

        if (isEditing) {
            await supabase.from('products').update(data).eq('id', editingId);
        } else {
            await supabase.from('products').insert([data]);
        }

        toast.success("¡Producto guardado!");
        closeModal();
        fetchData();
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("¿Borrar permanentemente?")) {
            await supabase.from('products').delete().eq('id', id);
            fetchData();
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setNewProduct(initialFormState);
    };

    if (loading) return <div className="admin-loading-screen">Cargando datos de Cuyo...</div>;

    return (
        <div className="admin-page">
            <Toaster position="top-right" />
            <header className="admin-sidebar-header">
                <h1>Gestión Cuyo Cebado</h1>
                <div className="tab-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Stock</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Ventas</button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>Categorías</button>
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
                                <thead><tr><th>PRODUCTO</th><th>PRECIO</th><th>STOCK</th><th>ACCIONES</th></tr></thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td className="product-info"><img src={p.image_url || '/assets/placeholder.png'} className="mini-thumb" />{p.name}</td>
                                            <td>${p.price}</td>
                                            <td className="stock-controls-cell">
                                                <div className="stock-controls-wrapper">
                                                    <button className="btn-stock-qty" onClick={() => handleUpdateField(p.id, 'stock', p.stock - 1)}>-</button>
                                                    <span>{p.stock}</span>
                                                    <button className="btn-stock-qty" onClick={() => handleUpdateField(p.id, 'stock', p.stock + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => { setIsEditing(true); setEditingId(p.id); setNewProduct(p); setIsModalOpen(true); }} className="btn-edit-action">Editar</button>
                                                    <button onClick={() => handleDeleteProduct(p.id)} className="btn-delete-action">Borrar</button>
                                                </div>
                                            </td>
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
                        <div className="table-container">
                            <table className="custom-table">
                                <thead><tr><th>FECHA</th><th>CLIENTE</th><th>TOTAL</th><th>ESTADO</th><th>VER</th></tr></thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                            <td>{o.customer_name || o.customer_email}</td>
                                            <td><strong>${o.total.toLocaleString()}</strong></td>
                                            <td><span className={`status-badge-premium ${o.status}`}>{o.status.toUpperCase()}</span></td>
                                            <td style={{ textAlign: 'center' }}><button className="btn-view-modern" onClick={() => setSelectedOrder(o)}>Ver</button></td>
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
                                <thead><tr><th>VISUAL</th><th>NOMBRE</th><th>ACCIONES</th></tr></thead>
                                <tbody>
                                    {categoriesList.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.image_url ? <img src={c.image_url} style={{ width: '40px', borderRadius: '8px' }} /> : c.icon}</td>
                                            <td>{c.label}</td>
                                            <td><button className="btn-delete-action" onClick={async () => { if (window.confirm("¿Borrar?")) await supabase.from('categories').delete().eq('id', c.id); fetchData(); }}>Borrar</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="category-creator-box">
                            <h2 style={{ color: '#1a1614' }}>Nueva Categoría</h2>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const id = newCategory.label.toLowerCase().trim().replace(/ /g, '-');
                                await supabase.from('categories').insert([{ id, label: newCategory.label, icon: newCategory.icon, image_url: newCategory.image_url }]);
                                toast.success("Creada");
                                setNewCategory({ label: '', icon: '🧉', image_url: '' });
                                fetchData();
                            }} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px' }}>
                                <div className="image-upload-box-premium" style={{ height: '100px', position: 'relative' }}>
                                    <input type="file" onChange={async (e) => {
                                        const file = e.target.files[0];
                                        const name = `cat_${Math.random()}`;
                                        await supabase.storage.from('productos').upload(name, file);
                                        const { data } = supabase.storage.from('productos').getPublicUrl(name);
                                        setNewCategory({ ...newCategory, image_url: data.publicUrl });
                                    }} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                                    {newCategory.image_url ? <img src={newCategory.image_url} className="image-preview" /> : "Foto"}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                    <input className="premium-modal-input" placeholder="Nombre" value={newCategory.label} onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} />
                                    <input className="premium-modal-input" style={{ width: '80px' }} value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} />
                                    <button type="submit" className="btn-add-premium">Crear</button>
                                </div>
                            </form>
                        </div>
                    </section>
                )}
            </main>

            {/* MODAL PEDIDO */}
            {selectedOrder && (
                <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: '500px' }}>
                        <h2>Pedido #{selectedOrder.id.slice(0, 5)}</h2>
                        <p><strong>Cliente:</strong> {selectedOrder.customer_name} ({selectedOrder.customer_phone})</p>
                        <p><strong>Dirección:</strong> {selectedOrder.shipping_address}</p>
                        <hr />
                        {selectedOrder.items.map((it, i) => <div key={i}>{it.quantity}x {it.name}</div>)}
                        <button className="btn-confirm-order" style={{ marginTop: '20px' }} onClick={() => setSelectedOrder(null)}>Cerrar</button>
                    </div>
                </div>
            )}

            {/* MODAL PRODUCTO - ARREGLADO PARA QUE NO SE BLOQUEE */}
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
                        <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                        <form onSubmit={handleSaveProduct} className="modal-form-grid">
                            <div className="form-column">
                                <label>Foto Principal</label>
                                <div className="image-upload-box-premium" style={{ position: 'relative', height: '150px', marginBottom: '20px' }}>
                                    <input type="file" onChange={(e) => uploadImage(e)} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 5 }} />
                                    {newProduct.image_url ? <img src={newProduct.image_url} className="image-preview" /> : "Hacé clic para subir"}
                                </div>

                                <label>Galería (Extra)</label>
                                <div className="extra-images-grid-admin">
                                    {newProduct.extra_images?.map((img, i) => <img key={i} src={img} className="mini-gallery-thumb" />)}
                                    <div className="add-extra-box" style={{ position: 'relative' }}>
                                        <input type="file" onChange={(e) => uploadImage(e, true)} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-column">
                                <input className="premium-modal-input" placeholder="Nombre" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                <div className="form-split-modern">
                                    <input type="number" className="premium-modal-input" placeholder="Precio" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                    <input type="number" className="premium-modal-input" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                </div>
                                <select className="premium-modal-input selector-premium" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    {categoriesList.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                                <textarea className="premium-modal-input" placeholder="Descripción" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                <div className="modal-btns-group">
                                    <button type="button" onClick={closeModal} className="cancel-btn-modern">Cerrar</button>
                                    <button type="submit" className="save-btn-modern" disabled={uploading}>Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}