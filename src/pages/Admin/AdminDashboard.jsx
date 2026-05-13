import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '', price: '', stock: '', category: 'mates', description: '', image_url: '/assets/placeholder.png'
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
        await supabase.from('products').update({ [field]: value }).eq('id', id);
        toast.success("¡Sincronizado!");
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro? Se borrará de la tienda.")) {
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
            toast.success("¡Producto cargado!");
            setIsModalOpen(false);
            setNewProduct({ name: '', price: '', stock: '', category: 'mates', description: '', image_url: '/assets/placeholder.png' });
            fetchData();
        }
    };

    if (loading) return <div className="admin-loading-screen">Preparando el despacho...</div>;

    return (
        <div className="admin-page">
            <Toaster position="top-right" />

            <div className="admin-sidebar-header">
                <h1>Panel de Gestión</h1>
                <div className="tab-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>
                        <span className="material-symbols-outlined">inventory_2</span> Inventario
                    </button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                        <span className="material-symbols-outlined">shopping_bag</span> Ventas
                    </button>
                </div>
            </div>

            <main className="admin-content">
                {activeTab === 'inventory' ? (
                    <section className="inventory-section">
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="label">VARIEDAD TOTAL</span>
                                <span className="number">{products.length}</span>
                            </div>
                            <div className="stat-box warning">
                                <span className="label">STOCK CRÍTICO</span>
                                <span className="number">{products.filter(p => p.stock < 5).length}</span>
                            </div>
                        </div>

                        <div className="search-bar-admin">
                            <input
                                placeholder="Buscar por nombre de producto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>PRODUCTO</th>
                                        <th>PRECIO</th>
                                        <th>STOCK</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                                        <tr key={product.id} className={product.stock < 5 ? 'low-stock-row' : ''}>
                                            <td className="product-info">
                                                <img src={product.image_url} alt="" className="mini-thumb" />
                                                <span>{product.name}</span>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="price-edit"
                                                    defaultValue={product.price}
                                                    onBlur={(e) => handleUpdate(product.id, 'price', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="stock-controls">
                                                <button onClick={() => handleUpdate(product.id, 'stock', product.stock - 1)}>-</button>
                                                <span className="qty">{product.stock}</span>
                                                <button onClick={() => handleUpdate(product.id, 'stock', product.stock + 1)}>+</button>
                                            </td>
                                            <td>
                                                <button className="delete-trash" onClick={() => handleDelete(product.id)}>
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="footer-action">
                            <button className="main-add-btn" onClick={() => setIsModalOpen(true)}>
                                + AGREGAR NUEVO PRODUCTO
                            </button>
                        </div>
                    </section>
                ) : (
                    <section className="orders-section">
                        <div className="table-container">
                            <table className="custom-table">
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
                                            <td><strong>${order.total}</strong></td>
                                            <td><span className={`badge ${order.status}`}>{order.status}</span></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="empty-msg">No se registraron ventas todavía.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-card">
                        <h2>Cargar Mercadería</h2>
                        <form onSubmit={handleAddProduct} className="modal-form">
                            <input placeholder="Nombre del Producto" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            <div className="form-split">
                                <input type="number" placeholder="Precio ($)" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                <input type="number" placeholder="Stock" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                            </div>
                            <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                <option value="mates">Mates</option>
                                <option value="yerbas">Yerbas</option>
                                <option value="bombillas">Bombillas</option>
                            </select>
                            <textarea placeholder="Descripción corta..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            <div className="modal-btns">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="save-btn">Guardar en Tienda</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}