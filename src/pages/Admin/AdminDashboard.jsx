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
        description: '', image_url: '', video_url: '',
        extra_images: [] // <-- Nueva columna
    };
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
                setNewProduct({ ...newProduct, image_url: data.publicUrl });
            }
            toast.success("Cargada");
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

        if (isEditing) await supabase.from('products').update(data).eq('id', editingId);
        else await supabase.from('products').insert([data]);

        toast.success("¡Producto guardado!");
        closeModal();
        fetchData();
    };

    const closeModal = () => { setIsModalOpen(false); setIsEditing(false); setEditingId(null); setNewProduct(initialFormState); };

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
                                            <td>{p.stock}</td>
                                            <td>
                                                <button onClick={() => { setIsEditing(true); setEditingId(p.id); setNewProduct(p); setIsModalOpen(true); }} className="btn-edit-action">Editar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="footer-action-panel"><button className="btn-add-premium" onClick={() => setIsModalOpen(true)}>+ NUEVO PRODUCTO</button></div>
                    </section>
                )}

                {/* --- SECCIÓN ÓRDENES Y CATEGORÍAS (Se mantienen iguales) --- */}
            </main>

            {isModalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
                        <h2>{isEditing ? 'Editar Ficha' : 'Nueva Ficha'}</h2>
                        <form onSubmit={handleSaveProduct} className="modal-form-grid">
                            <div className="form-column">
                                <label className="label-admin">Foto Principal</label>
                                <div className="image-upload-box-premium">
                                    <input type="file" onChange={(e) => uploadImage(e)} className="file-input-hidden" />
                                    {newProduct.image_url ? <img src={newProduct.image_url} className="image-preview" /> : "Subir Foto"}
                                </div>

                                <label className="label-admin">Galería de Detalles (Extra)</label>
                                <div className="extra-images-grid-admin">
                                    {newProduct.extra_images?.map((img, i) => (
                                        <img key={i} src={img} className="mini-gallery-thumb" />
                                    ))}
                                    <div className="add-extra-box">
                                        <input type="file" onChange={(e) => uploadImage(e, true)} className="file-input-hidden" />
                                        <span>+</span>
                                    </div>
                                </div>

                                <input className="premium-modal-input" placeholder="Video URL" value={newProduct.video_url} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} />
                            </div>
                            <div className="form-column">
                                <input className="premium-modal-input" placeholder="Nombre" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                <div className="form-split-modern">
                                    <input type="number" className="premium-modal-input" placeholder="Precio" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                    <input type="number" className="premium-modal-input" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                </div>
                                <select className="premium-modal-input selector-premium" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    {categoriesList.map(c => (<option key={c.id} value={c.id}>{c.label}</option>))}
                                </select>
                                <textarea className="premium-modal-input" placeholder="Descripción" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                <div className="modal-btns-group"><button type="button" onClick={closeModal} className="cancel-btn-modern">Cerrar</button><button type="submit" className="save-btn-modern">Guardar</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}