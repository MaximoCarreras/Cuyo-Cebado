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
    const [selectedOrder, setSelectedOrder] = useState(null);
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
        const { error } = await supabase.from('products').update({ [field]: value }).eq('id', id);
        if (!error) toast.success("Sincronizado");
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

                        <div className="search-bar-admin">
                            <input placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                                        <tr key={product.id}>
                                            <td className="product-info">
                                                <img src={product.image_url} alt="" className="mini-thumb" />
                                                <span>{product.name}</span>
                                            </td>
                                            <td><input type="number" className="price-edit" defaultValue={product.price} onBlur={(e) => handleUpdate(product.id, 'price', Number(e.target.value))} /></td>
                                            <td className="stock-controls">
                                                <button onClick={() => handleUpdate(product.id, 'stock', product.stock - 1)}>-</button>
                                                <span className="qty">{product.stock}</span>
                                                <button onClick={() => handleUpdate(product.id, 'stock', product.stock + 1)}>+</button>
                                            </td>
                                            <td><button className="delete-trash" onClick={() => {/* handle delete */ }}><span className="material-symbols-outlined">delete</span></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="footer-action">
                            <button className="main-add-btn" onClick={() => setIsModalOpen(true)}>+ NUEVO PRODUCTO</button>
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
                                        <th>PEDIDO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td>{order.customer_email}</td>
                                            <td><strong>${order.total}</strong></td>
                                            <td><button className="btn-view" onClick={() => setSelectedOrder(order)}><span className="material-symbols-outlined">visibility</span></button></td>
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
                                    <span>${item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn-close" onClick={() => setSelectedOrder(null)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}