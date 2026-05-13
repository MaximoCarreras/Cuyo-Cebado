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
        name: '', price: '', stock: '', category: 'mates',
        material: '', type: '', specs: '', badge: '',
        description: '', image_url: '', video_url: ''
    };

    const [newProduct, setNewProduct] = useState(initialFormState);

    // AHORA LA CATEGORÍA TAMBIÉN TIENE IMAGE_URL
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

    // --- SUBIDA DE IMAGEN PARA CATEGORÍAS ---
    const uploadCategoryImage = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileExt = file.name.split('.').pop();
            const fileName = `cat_${Math.random()}.${fileExt}`; // Le ponemos 'cat_' para distinguirlas

            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);

            setNewCategory({ ...newCategory, image_url: data.publicUrl });
            toast.success("Foto de categoría cargada");
        } catch (error) {
            toast.error("Error al subir imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const id = newCategory.label.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const { error } = await supabase.from('categories').insert([{
            id,
            label: newCategory.label,
            icon: newCategory.icon,
            image_url: newCategory.image_url // Guardamos la URL
        }]);

        if (!error) {
            toast.success("¡Nueva categoría creada!");
            setNewCategory({ label: '', icon: '🧉', image_url: '' });
            fetchData();
        } else {
            toast.error("Error al crear categoría. ¿Quizás ya existe?");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("¿Borrar esta categoría? Asegurate de no tener productos usándola.")) {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) toast.error("Error al borrar");
            else {
                toast.success("Categoría eliminada");
                fetchData();
            }
        }
    };

    // --- FUNCIONES DE PRODUCTOS ---
    const handleEditClick = (product) => {
        setIsEditing(true);
        setEditingId(product.id);
        setNewProduct({ ...product });
        setIsModalOpen(true);
    };

    const handleUpdateStock = async (id, field, value) => {
        if (field === 'stock' && value < 0) {
            toast.error("El stock no puede ser negativo");
            return;
        }
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        await supabase.from('products').update({ [field]: value }).eq('id', id);
        if (field !== 'is_featured') toast.success("Sincronizado");
    };

    const handleToggleFeatured = async (product) => {
        const newValue = !product.is_featured;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: newValue } : p));
        await supabase.from('products').update({ is_featured: newValue }).eq('id', product.id);
        toast.success(newValue ? "⭐ Destacado en Inicio" : "Quitado de Inicio");
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Borrar producto definitivamente?")) {
            await supabase.from('products').delete().eq('id', id);
            toast.success("Eliminado");
            fetchData();
        }
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
        } catch (error) {
            toast.error("Error al subir imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const slug = newProduct.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const productData = {
            ...newProduct,
            slug,
            price: Number(newProduct.price),
            stock: Number(newProduct.stock)
        };

        if (isEditing) {
            const { error } = await supabase.from('products').update(productData).eq('id', editingId);
            if (!error) {
                toast.success("¡Actualizado!");
                closeModal();
                fetchData();
            }
        } else {
            const { error } = await supabase.from('products').insert([productData]);
            if (!error) {
                toast.success("¡Cargado a tienda!");
                closeModal();
                fetchData();
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setNewProduct(initialFormState);
    };

    const switchTab = (tabName) => {
        closeModal();
        setSelectedOrder(null);
        setActiveTab(tabName);
    };

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

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
                            <div className="stat-box">
                                <span className="label">VARIEDAD TOTAL</span>
                                <span className="number">{products.length}</span>
                            </div>
                            <div className="stat-box warning">
                                <span className="label">STOCK BAJO</span>
                                <span className="number">{products.filter(p => p.stock < 5).length}</span>
                            </div>
                        </div>

                        <div className="search-container-modern">
                            <span className="material-symbols-outlined search-icon">search</span>
                            <input className="modern-input-search" placeholder="Buscar mate, yerba, bombilla..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>PRODUCTO</th>
                                        <th>PRECIO ($)</th>
                                        <th>STOCK</th>
                                        <th style={{ textAlign: 'center' }}>DESTACAR</th>
                                        <th style={{ textAlign: 'center' }}>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                                        <tr key={product.id}>
                                            <td className="product-info">
                                                <img src={product.image_url || '/assets/placeholder.png'} alt="" className="mini-thumb" />
                                                <span className="product-name">{product.name}</span>
                                            </td>
                                            <td>
                                                <input type="number" className="price-edit-input" defaultValue={product.price} onBlur={(e) => handleUpdateStock(product.id, 'price', Number(e.target.value))} />
                                            </td>
                                            <td className="stock-controls-cell">
                                                <div className="stock-controls-wrapper">
                                                    <button className="btn-stock-qty" onClick={() => handleUpdateStock(product.id, 'stock', product.stock - 1)}>-</button>
                                                    <span className="stock-number-display">{product.stock}</span>
                                                    <button className="btn-stock-qty" onClick={() => handleUpdateStock(product.id, 'stock', product.stock + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className={`btn-action-star ${product.is_featured ? 'active' : ''}`} onClick={() => handleToggleFeatured(product)}>
                                                    <span className="material-symbols-outlined">star</span>
                                                </button>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div className="admin-actions-group">
                                                    <button className="btn-edit-action" onClick={() => handleEditClick(product)}>
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button className="btn-delete-action" onClick={() => handleDelete(product.id)}>
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
                                <span className="material-symbols-outlined">add</span>
                                NUEVO PRODUCTO
                            </button>
                        </div>
                    </section>
                )}

                {activeTab === 'orders' && (
                    <section>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="label">TOTAL RECAUDADO</span>
                                <span className="number">${totalRevenue.toLocaleString()}</span>
                            </div>
                            <div className="stat-box">
                                <span className="label">PEDIDOS</span>
                                <span className="number">{orders.length}</span>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>FECHA</th>
                                        <th>CLIENTE</th>
                                        <th>TOTAL</th>
                                        <th>ESTADO</th>
                                        <th style={{ textAlign: 'center' }}>VER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td>{order.customer_email}</td>
                                            <td><strong>${order.total.toLocaleString()}</strong></td>
                                            <td>
                                                <select className={`status-select-modern ${order.status}`} defaultValue={order.status}>
                                                    <option value="pending">Pendiente</option>
                                                    <option value="shipped">Despachado</option>
                                                </select>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className="btn-view-modern" onClick={() => setSelectedOrder(order)}><span className="material-symbols-outlined">visibility</span></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* --- PESTAÑA CATEGORÍAS --- */}
                {activeTab === 'categories' && (
                    <section>
                        <div className="table-container" style={{ marginBottom: '40px' }}>
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>VISUAL</th>
                                        <th>NOMBRE DE CATEGORÍA</th>
                                        <th>ID SISTEMA</th>
                                        <th style={{ textAlign: 'center' }}>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoriesList.map(cat => (
                                        <tr key={cat.id}>
                                            <td style={{ textAlign: 'center' }}>
                                                {/* MOSTRAMOS LA FOTO SI HAY, SINO EL EMOJI */}
                                                {cat.image_url ? (
                                                    <img src={cat.image_url} alt={cat.label} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                                ) : (
                                                    <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                                                )}
                                            </td>
                                            <td style={{ fontWeight: 'bold' }}>{cat.label}</td>
                                            <td style={{ color: '#94a3b8' }}>{cat.id}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className="btn-delete-action" style={{ margin: '0 auto' }} onClick={() => handleDeleteCategory(cat.id)}>
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* FORMULARIO CREAR CATEGORÍA (AHORA CON FOTO) */}
                        <div className="category-creator-box" style={{ background: '#fff', padding: '30px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ fontFamily: "'Noto Serif', serif", marginTop: 0, marginBottom: '25px' }}>Crear Nueva Categoría</h2>

                            <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '30px', alignItems: 'center' }}>

                                {/* CAJITA SUBIR FOTO */}
                                <div className="image-upload-box-premium" style={{ height: '150px', margin: 0 }}>
                                    {newCategory.image_url ? (
                                        <img src={newCategory.image_url} alt="Preview" className="image-preview" />
                                    ) : (
                                        <div className="upload-placeholder-premium">
                                            <span className="material-symbols-outlined">add_photo_alternate</span>
                                            <span style={{ fontSize: '0.8rem' }}>Foto (Opcional)</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={uploadCategoryImage} disabled={uploading} className="file-input-hidden" />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#64748b' }}>Nombre (Ej: Termos)</label>
                                        <input className="premium-modal-input" required value={newCategory.label} onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                                        <div style={{ width: '150px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#64748b' }}>Emoji (Si no hay foto)</label>
                                            <input className="premium-modal-input" required style={{ fontSize: '1.5rem', textAlign: 'center' }} value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-add-premium" style={{ flex: 1, justifyContent: 'center' }} disabled={uploading}>
                                            Crear Categoría
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                )}
            </main>

            {/* MODALES DETALLE DE VENTA Y CREAR PRODUCTO (Igual que antes) */}
            {selectedOrder && (
                <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <h3>Pedido de {selectedOrder.customer_email}</h3>
                        <div className="items-list">
                            {selectedOrder.items.map((item, i) => (
                                <div key={i} className="item-row-detail">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn-close-modal" onClick={() => setSelectedOrder(null)}>Cerrar</button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
                        <h2>{isEditing ? 'Editar Ficha' : 'Nueva Ficha de Producto'}</h2>
                        <form onSubmit={handleSaveProduct} className="modal-form-grid">
                            <div className="form-column Multimedia-col">
                                <div className="image-upload-box-premium">
                                    {newProduct.image_url ? (
                                        <img src={newProduct.image_url} alt="Preview" className="image-preview" />
                                    ) : (
                                        <div className="upload-placeholder-premium">
                                            <span className="material-symbols-outlined">add_a_photo</span>
                                            <span>Subir Foto Principal</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="file-input-hidden" />
                                </div>
                                <input className="premium-modal-input" placeholder="Link de Video / Reel" value={newProduct.video_url} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} />
                                <textarea className="premium-modal-input desc-box" placeholder="Descripción detallada..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            </div>

                            <div className="form-column Datos-col">
                                <input className="premium-modal-input" placeholder="Nombre completo" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                <div className="form-split-modern">
                                    <input className="premium-modal-input" type="number" placeholder="Precio ($)" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                    <input className="premium-modal-input" type="number" placeholder="Stock" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                </div>
                                <div className="form-split-modern">
                                    <select className="premium-modal-input selector-premium" required value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                        <option value="" disabled>Elegir categoría...</option>
                                        {categoriesList.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                    <input className="premium-modal-input" placeholder="Etiqueta (Ej: Premium)" value={newProduct.badge} onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })} />
                                </div>
                                <div className="form-split-modern">
                                    <input className="premium-modal-input" placeholder="Material" value={newProduct.material} onChange={e => setNewProduct({ ...newProduct, material: e.target.value })} />
                                    <input className="premium-modal-input" placeholder="Tipo" value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })} />
                                </div>
                                <input className="premium-modal-input" placeholder="Especificaciones Técnicas" value={newProduct.specs} onChange={e => setNewProduct({ ...newProduct, specs: e.target.value })} />
                                <div className="modal-btns-group">
                                    <button type="button" className="cancel-btn-modern" onClick={closeModal}>Cancelar</button>
                                    <button type="submit" className="save-btn-modern" disabled={uploading}>
                                        {isEditing ? 'Guardar Cambios' : 'Lanzar a Tienda'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}