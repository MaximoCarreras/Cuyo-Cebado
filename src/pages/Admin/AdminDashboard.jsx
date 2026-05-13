import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' o 'orders'
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('todas');

    const [newProduct, setNewProduct] = useState({
        name: '', price: '', stock: '', category: 'mates', description: '', image_url: '/assets/placeholder.png'
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

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
        await supabase.from('products').update({ [field]: value }).eq('id', id);
        toast.success("Actualizado");
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Borrar producto?")) {
            await supabase.from('products').delete().eq('id', id);
            toast.success("Eliminado");
            fetchData();
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const slug = newProduct.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const { error } = await supabase.from('products').insert([{ ...newProduct, slug, price: Number(newProduct.price), stock: Number(newProduct.stock) }]);
        if (!error) {
            toast.success("¡Mate cargado!");
            setIsModalOpen(false);
            setNewProduct({ name: '', price: '', stock: '', category: 'mates', description: '', image_url: '/assets/placeholder.png' });
            fetchData();
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory === 'todas' || p.category === filterCategory)
    );

    if (loading) return <div className="admin-loading">Conectando con la estancia...</div>;

    return (
        <div className="admin-container">
            <Toaster position="top-right" />

            <header className="admin-header">
                <h1>Panel de Gestión</h1>
                <div className="admin-tabs">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Inventario</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Ventas</button>
                </div>
            </header>

            {activeTab === 'inventory' ? (
                <>
                    <div className="admin-stats">
                        <div className="stat-card">
                            <span className="stat-label">VARIEDAD TOTAL</span>
                            <span className="stat-value">{products.length}</span>
                        </div>
                        <div className="stat-card alert">
                            <span className="stat-label">STOCK BAJO</span>
                            <span className="stat-value">{products.filter(p => p.stock < 5).length}</span>
                        </div>
                    </div>

                    <div className="admin-controls">
                        <div className="search-box">
                            <span className="material-symbols-outlined">search</span>
                            <input placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>IMG</th>
                                    <th>PRODUCTO</th>
                                    <th>PRECIO</th>
                                    <th>STOCK</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className={product.stock < 5 ? 'row-low-stock' : ''}>
                                        <td><img src={product.image_url} alt="" className="admin-thumb" /></td>
                                        <td className="td-name">{product.name}</td>
                                        <td>
                                            <input type="number" className="admin-input-price" defaultValue={product.price} onBlur={(e) => handleUpdate(product.id, 'price', Number(e.target.value))} />
                                        </td>
                                        <td className="td-stock-actions">
                                            <button className="btn-qty" onClick={() => handleUpdate(product.id, 'stock', product.stock - 1)}>-</button>
                                            <span className="stock-number">{product.stock}</span>
                                            <button className="btn-qty" onClick={() => handleUpdate(product.id, 'stock', product.stock + 1)}>+</button>
                                        </td>
                                        <td>
                                            <button className="btn-delete" onClick={() => handleDelete(product.id)}><span className="material-symbols-outlined">delete</span></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-footer-actions">
                        <button className="btn-add-product-large" onClick={() => setIsModalOpen(true)}>
                            <span className="material-symbols-outlined">add_circle</span>
                            AGREGAR NUEVO PRODUCTO
                        </button>
                    </div>
                </>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>FECHA</th>
                                <th>CLIENTE</th>
                                <th>TOTAL</th>
                                <th>ESTADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map(order => (
                                <tr key={order.id}>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>{order.customer_email}</td>
                                    <td>${order.total}</td>
                                    <td><span className={`status-pill ${order.status}`}>{order.status}</span></td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Todavía no hay ventas registradas.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL - (Queda igual que el anterior) */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>Cargar Producto</h2>
                        <form onSubmit={handleAddProduct}>
                            <input className="modal-input" placeholder="Nombre" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            <div className="form-row">
                                <input className="modal-input" type="number" placeholder="Precio" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                <input className="modal-input" type="number" placeholder="Stock" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                            </div>
                            <select className="modal-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                <option value="mates">Mates</option>
                                <option value="yerbas">Yerbas</option>
                                <option value="bombillas">Bombillas</option>
                                <option value="accesorios">Accesorios</option>
                            </select>
                            <textarea className="modal-input" placeholder="Descripción..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-save">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}