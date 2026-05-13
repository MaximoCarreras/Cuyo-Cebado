import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // EL ESTADO AHORA INCLUYE TODOS LOS DETALLES TÉCNICOS Y MEDIA
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', stock: '', category: 'mates',
        material: '', type: '', specs: '', badge: '',
        description: '', image_url: '', video_url: ''
    });

    useEffect(() => { fetchData(); }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        if (activeTab === 'inventory') {
            const { data } = await supabase.from('products').select('*').order('name');
            setProducts(data || []);
        } else {
            const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            setOrders(data || []);
        }
        setLoading(false);
    };

    const handleUpdate = async (id, field, value) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        const { error } = await supabase.from('products').update({ [field]: value }).eq('id', id);
        if (!error && field !== 'is_featured') toast.success("Sincronizado");
    };

    const handleToggleFeatured = async (product) => {
        const newValue = !product.is_featured;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: newValue } : p));
        await supabase.from('products').update({ is_featured: newValue }).eq('id', product.id);
        toast.success(newValue ? "¡Destacado en Inicio!" : "Quitado de Destacados");
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Borrar producto definitivamente?")) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) toast.error("No se pudo borrar");
            else {
                toast.success("Eliminado");
                fetchData();
            }
        }
    };

    const uploadImage = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('productos').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
            setNewProduct({ ...newProduct, image_url: data.publicUrl });
            toast.success("Foto principal subida");
        } catch (error) {
            toast.error("Error al subir imagen. Verificá que el bucket sea público.");
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const slug = newProduct.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const finalImage = newProduct.image_url || '/assets/placeholder.png';

        const { error } = await supabase.from('products').insert([{
            ...newProduct, slug,
            price: Number(newProduct.price),
            stock: Number(newProduct.stock),
            image_url: finalImage
        }]);

        if (!error) {
            toast.success("¡Catálogo actualizado!");
            setIsModalOpen(false);
            setNewProduct({
                name: '', price: '', stock: '', category: 'mates',
                material: '', type: '', specs: '', badge: '',
                description: '', image_url: '', video_url: ''
            });
            fetchData();
        } else {
            toast.error("Error al guardar: " + error.message);
        }
    };

    const handleOrderStatus = async (id, newStatus) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        await supabase.from('orders').update({ status: newStatus }).eq('id', id);
        toast.success("Estado actualizado");
    };

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

    if (loading) return <div className="admin-loading-screen">Abriendo la estancia...</div>;

    return (
        <div className="admin-page">
            <Toaster position="top-right" />

            <div className="admin-sidebar-header">
                <h1>Gestión Cuyo Cebado</h1>
                <div className="tab-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Stock</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Ventas</button>
                </div>
            </div>

            <main className="admin-content">
                {activeTab === 'inventory' ? (
                    <section>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="label">PRODUCTOS</span>
                                <span className="number">{products.length}</span>
                            </div>
                            <div className="stat-box warning">
                                <span className="label">STOCK BAJO</span>
                                <span className="number">{products.filter(p => p.stock < 5).length}</span>
                            </div>
                        </div>

                        <div className="search-container-modern">
                            <span className="material-symbols-outlined">search</span>
                            <input className="modern-input-search" placeholder="Buscar en el inventario..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>PRODUCTO</th>
                                        <th>PRECIO</th>
                                        <th>STOCK</th>
                                        <th style={{ textAlign: 'center' }}>DESTACAR</th>
                                        <th style={{ textAlign: 'center' }}>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                                        <tr key={product.id}>
                                            <td className="product-info">
                                                <img src={product.image_url} alt="" className="mini-thumb" />
                                                <span>{product.name}</span>
                                            </td>
                                            <td>
                                                <input type="number" className="price-edit" defaultValue={product.price} onBlur={(e) => handleUpdate(product.id, 'price', Number(e.target.value))} />
                                            </td>
                                            <td className="stock-controls">
                                                <button className="btn-qty" onClick={() => handleUpdate(product.id, 'stock', product.stock - 1)}>-</button>
                                                <span className="qty">{product.stock}</span>
                                                <button className="btn-qty" onClick={() => handleUpdate(product.id, 'stock', product.stock + 1)}>+</button>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className={`btn-star ${product.is_featured ? 'active' : ''}`} onClick={() => handleToggleFeatured(product)}>
                                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: product.is_featured ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                                                </button>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className="btn-delete-modern" onClick={() => handleDelete(product.id)}>
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="footer-action">
                            <button className="btn-add-modern" onClick={() => setIsModalOpen(true)}>
                                <span className="material-symbols-outlined">add_circle</span> NUEVO PRODUCTO
                            </button>
                        </div>
                    </section>
                ) : (
                    <section>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="label">TOTAL RECAUDADO</span>
                                <span className="number">${totalRevenue.toLocaleString()}</span>
                            </div>
                            <div className="stat-box">
                                <span className="label">PEDIDOS TOTALES</span>
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
                                                <select className={`status-select ${order.status}`} value={order.status} onChange={(e) => handleOrderStatus(order.id, e.target.value)}>
                                                    <option value="pending">Pendiente</option>
                                                    <option value="shipped">Despachado</option>
                                                    <option value="delivered">Entregado</option>
                                                </select>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className="btn-view" onClick={() => setSelectedOrder(order)}>
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {/* MODAL DETALLES DE VENTA */}
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
                        <div className="order-modal-total">
                            <span>TOTAL A COBRAR:</span>
                            <strong>${selectedOrder.total.toLocaleString()}</strong>
                        </div>
                        <button className="btn-close" onClick={() => setSelectedOrder(null)}>Cerrar</button>
                    </div>
                </div>
            )}

            {/* MODAL NUEVO PRODUCTO (SÚPER FORMULARIO) */}
            {isModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
                        <h2>Ficha Técnica del Producto</h2>

                        <form onSubmit={handleAddProduct} className="modal-form-grid">

                            {/* COLUMNA 1: Multimedia */}
                            <div className="form-column">
                                <div className="image-upload-box">
                                    {newProduct.image_url ? (
                                        <img src={newProduct.image_url} alt="Preview" className="image-preview" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <span className="material-symbols-outlined">add_photo_alternate</span>
                                            <span>{uploading ? 'Subiendo...' : 'Subir Foto Principal'}</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="file-input-hidden" />
                                </div>
                                <input className="modern-modal-input" placeholder="Link del Reel/Video (Ej: Instagram, YouTube)" value={newProduct.video_url} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} />
                                <textarea className="modern-modal-input desc-box" placeholder="Descripción para el cliente..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            </div>

                            {/* COLUMNA 2: Datos */}
                            <div className="form-column">
                                <input className="modern-modal-input" placeholder="Nombre completo" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />

                                <div className="form-split">
                                    <input className="modern-modal-input" type="number" placeholder="Precio ($)" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                    <input className="modern-modal-input" type="number" placeholder="Stock" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                </div>

                                <div className="form-split">
                                    <select className="modern-modal-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                        <option value="mates">Mates</option>
                                        <option value="yerbas">Yerbas</option>
                                        <option value="bombillas">Bombillas</option>
                                        <option value="accesorios">Accesorios</option>
                                    </select>
                                    <input className="modern-modal-input" placeholder="Etiqueta (Ej: Nuevo, Premium)" value={newProduct.badge} onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })} />
                                </div>

                                <div className="form-split">
                                    <input className="modern-modal-input" placeholder="Material (Ej: Alpaca)" value={newProduct.material} onChange={e => setNewProduct({ ...newProduct, material: e.target.value })} />
                                    <input className="modern-modal-input" placeholder="Tipo (Ej: Imperial)" value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })} />
                                </div>

                                <input className="modern-modal-input" placeholder="Especificaciones extras (Ej: Costura uruguaya)" value={newProduct.specs} onChange={e => setNewProduct({ ...newProduct, specs: e.target.value })} />

                                <div className="modal-btns">
                                    <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                    <button type="submit" className="save-btn" disabled={uploading}>Guardar en Tienda</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}