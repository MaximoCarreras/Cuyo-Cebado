import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [siteSettings, setSiteSettings] = useState({ banner_text: '', banner_active: true });

    const [initialLoading, setInitialLoading] = useState(true);
    const [tabLoading, setTabLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Modales de Productos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Edición de FAQs
    const [isEditingFAQ, setIsEditingFAQ] = useState(false);
    const [editingFAQId, setEditingFAQId] = useState(null);
    const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

    const initialFormState = {
        name: '', price: '', stock: 0, category: 'mates',
        material: '', type: '', specs: '', badge: '',
        description: '', image_url: '', video_url: '', extra_images: [],
        is_featured: false
    };
    const [newProduct, setNewProduct] = useState(initialFormState);
    const [newCategory, setNewCategory] = useState({ label: '', icon: '🧉', image_url: '' });

    useEffect(() => { checkAdmin(); }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchData(activeTab);
        }
    }, [isAdmin]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setInitialLoading(false); return; }
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') setIsAdmin(true);
        setInitialLoading(false);
    };

    const fetchData = async (targetTab) => {
        setTabLoading(true);
        try {
            if (targetTab === 'inventory') {
                const { data: pData } = await supabase.from('products').select('*').order('name');
                setProducts(pData || []);
                const { data: catData } = await supabase.from('categories').select('*').order('label');
                setCategoriesList(catData || []);
            } else if (targetTab === 'orders') {
                const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                setOrders(oData || []);
            } else if (targetTab === 'categories') {
                const { data: cData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
                setCategoriesList(cData || []);
            } else if (targetTab === 'settings') {
                const { data: sData } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
                if (sData) setSiteSettings(sData);
            } else if (targetTab === 'faq') {
                const { data: fData } = await supabase.from('faqs').select('*').order('created_at', { ascending: true });
                setFaqs(fData || []);
            }
        } catch (err) { console.error(err); }
        setTabLoading(false);
    };

    const handleTabChange = (tab) => {
        closeModal();
        setSelectedOrder(null);
        setActiveTab(tab);
        fetchData(tab);
    };

    const handleSeedFAQs = async () => {
        setTabLoading(true);
        await supabase.from('faqs').delete().neq('question', '');

        const baseFAQs = [
            { question: '¿Cómo es el proceso de compra si quiero un mate?', answer: 'Elegís tu pieza premium en el catálogo, la agregás al carrito y completás los datos de facturación. El pago se procesa de forma segura y nos contactamos de inmediato por WhatsApp para coordinar detalles finales.' },
            { question: '¿Hacen envíos a todo el país y cómo entregan en Mendoza?', answer: 'Hacemos envíos blindados a toda la Argentina. Si estás en Mendoza, podés retirar sin cargo en nuestro punto oficial de Código Vinario (Av. Colón 701) o seleccionar envío express por cadetería.' },
            { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos todas las tarjetas de débito y crédito en hasta 3 cuotas sin interés a través de Mercado Pago. También contás con la opción de transferencia bancaria directa.' },
            { question: '¿De qué materiales están hechos los mates y qué garantía tienen?', answer: 'Nuestras piezas están seleccionadas rigurosamente: calabazas brasileñas de paredes gruesas, madera noble de algarrobo y cueros vacunos legítimos de 4mm con virolas de alpaca. Poseen garantía total por fallas de fabricación.' },
            { question: '¿El mate viene listo para usar o debo curarlo?', answer: 'Los mates de calabaza y madera necesitan un proceso de curado previo para sellar sus poros. En nuestra pestaña "Guía de Curado" te dejamos el paso a paso interactivo para hacerlo como un profesional.' }
        ];

        const { error } = await supabase.from('faqs').insert(baseFAQs);
        if (!error) {
            toast.success("Preguntas reales sincronizadas 🧉");
            fetchData('faq');
        } else {
            toast.error("Error al sincronizar base de datos.");
        }
        setTabLoading(false);
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (!error) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Pedido marcado como ${newStatus}`);
        }
    };

    // 💥 FUNCIÓN LOGÍSTICA: CANCELAR PEDIDO Y RESTAURAR STOCK 💥
    const handleCancelOrder = async (order) => {
        if (!window.confirm(`¿Seguro que querés CANCELAR el pedido de ${order.customer_name}? Se devolverá el stock disponible.`)) return;

        setTabLoading(true);
        try {
            // 1. Cambiar estado a cancelado
            const { error: statusErr } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
            if (statusErr) throw statusErr;

            // 2. Recorrer los items devueltos e incrementar el stock en Supabase
            if (order.items && order.items.length > 0) {
                for (const item of order.items) {
                    // Buscamos el producto por su nombre (title en la orden)
                    const { data: prod } = await supabase.from('products').select('id, stock').eq('name', item.title).single();

                    if (prod) {
                        const newStock = prod.stock + Number(item.quantity);
                        await supabase.from('products').update({ stock: newStock }).eq('id', prod.id);
                    }
                }
            }

            toast.success("Pedido cancelado. Stock devuelto a la estancia 📦");
            fetchData('orders');
        } catch (err) {
            console.error(err);
            toast.error("No se pudo procesar la cancelación.");
        } finally {
            setTabLoading(false);
        }
    };

    const handleSaveFAQ = async (e) => {
        e.preventDefault();
        if (isEditingFAQ) {
            await supabase.from('faqs').update(faqForm).eq('id', editingFAQId);
            toast.success("Pregunta modificada con éxito");
        } else {
            await supabase.from('faqs').insert([faqForm]);
            toast.success("Pregunta guardada");
        }
        setFaqForm({ question: '', answer: '' });
        setIsEditingFAQ(false);
        setEditingFAQId(null);
        fetchData('faq');
    };

    const handleEditFAQ = (faq) => {
        setFaqForm({ question: faq.question, answer: faq.answer });
        setIsEditingFAQ(true);
        setEditingFAQId(faq.id);
    };

    const uploadImage = async (event, type) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
            if (type === 'main') setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
            else if (type === 'category') setNewCategory(prev => ({ ...prev, image_url: data.publicUrl }));
            else setNewProduct(prev => ({ ...prev, extra_images: [...(prev.extra_images || []), data.publicUrl] }));
            toast.success("Imagen guardada");
        } catch (e) { toast.error("Error al subir"); } finally { setUploading(false); }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const slug = newProduct.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const data = { ...newProduct, slug, price: Number(newProduct.price), stock: Number(newProduct.stock) };
        if (isEditing) await supabase.from('products').update(data).eq('id', editingId);
        else await supabase.from('products').insert([data]);
        toast.success("Ficha guardada");
        closeModal();
        fetchData('inventory');
    };

    const handleUpdateSettings = async () => {
        await supabase.from('site_settings').update(siteSettings).eq('id', 'global');
        toast.success("Barra Dorada actualizada 🧉");
    };

    const closeModal = () => { setIsModalOpen(false); setIsEditing(false); setEditingId(null); setNewProduct(initialFormState); };
    const removeMainImage = (e) => { e.preventDefault(); e.stopPropagation(); setNewProduct(prev => ({ ...prev, image_url: '' })); };
    const removeExtraImage = (e, index) => { e.preventDefault(); e.stopPropagation(); const filtered = newProduct.extra_images.filter((_, i) => i !== index); setNewProduct(prev => ({ ...prev, extra_images: filtered })); };
    const handleUpdateField = async (id, field, value) => {
        const val = (field === 'stock' || field === 'price') ? Number(value) : value;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
        await supabase.from('products').update({ [field]: val }).eq('id', id);
    };
    const handleToggleFeatured = async (product) => {
        const newValue = !product.is_featured;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: newValue } : p));
        await supabase.from('products').update({ is_featured: newValue }).eq('id', product.id);
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (initialLoading) return <div className="admin-loader">Abriendo la estancia...</div>;
    if (!isAdmin) return <div className="no-access-screen"><h1>Acceso Restringido</h1><p>Solo el administrador de Cuyo Cebado puede entrar.</p><button onClick={() => window.location.href = '/'}>Volver al Inicio</button></div>;

    return (
        <div className="admin-refined-page">
            <Toaster position="top-right" />
            <header className="admin-refined-header">
                <div className="header-info"><h1>Gestión Cuyo Cebado</h1><p>Boutique Digital Admin</p></div>
                <div className="tab-refined-switcher">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => handleTabChange('inventory')}>Stock</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}>Ventas</button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => handleTabChange('categories')}>Categorías</button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => handleTabChange('settings')}>Web</button>
                    <button className={activeTab === 'faq' ? 'active' : ''} onClick={() => handleTabChange('faq')}>FAQ</button>
                </div>
            </header>

            <main className="admin-refined-content">
                {tabLoading ? (
                    <div className="tab-internal-loader"><p>Sincronizando con la estancia...</p></div>
                ) : (
                    <>
                        {/* INVENTARIO */}
                        {activeTab === 'inventory' && (
                            <section className="fade-in">
                                <div className="stats-refined-grid">
                                    <div className="stat-card">
                                        <span className="material-symbols-outlined icon-stat">inventory_2</span>
                                        <div className="stat-data"><span className="stat-label">Variedad</span><span className="stat-value">{products.length}</span></div>
                                    </div>
                                    <div className="stat-card critical">
                                        <span className="material-symbols-outlined icon-stat">priority_high</span>
                                        <div className="stat-data"><span className="stat-label">Stock Crítico</span><span className="stat-value">{products.filter(p => p.stock < 5).length}</span></div>
                                    </div>
                                </div>
                                <div className="search-bar-container">
                                    <span className="material-symbols-outlined">search</span>
                                    <input type="text" placeholder="Buscar mate..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <div className="table-container">
                                    <table className="refined-table">
                                        <thead><tr><th>PRODUCTO</th><th>PRECIO</th><th>STOCK</th><th>ESTRELLA</th><th>ACCIONES</th></tr></thead>
                                        <tbody>
                                            {filteredProducts.map(p => (
                                                <tr key={p.id}>
                                                    <td className="cell-product"><img src={p.image_url || '/assets/placeholder.png'} className="mini-thumb" />{p.name}</td>
                                                    <td>${p.price.toLocaleString()}</td>
                                                    <td>
                                                        <div className="refined-stock-pill">
                                                            <button className="stock-btn minus" onClick={() => handleUpdateField(p.id, 'stock', p.stock - 1)}>−</button>
                                                            <span className="stock-qty">{p.stock}</span>
                                                            <button className="stock-btn plus" onClick={() => handleUpdateField(p.id, 'stock', p.stock + 1)}>+</button>
                                                        </div>
                                                    </td>
                                                    <td><button className={`star-refined-btn ${p.is_featured ? 'active' : ''}`} onClick={() => handleToggleFeatured(p)}><span className="material-symbols-outlined">{p.is_featured ? 'star_rate' : 'star'}</span></button></td>
                                                    <td><div className="actions-flex-row">
                                                        <button onClick={() => { setIsEditing(true); setEditingId(p.id); setNewProduct(p); setIsModalOpen(true); }} className="btn-edit-modern">EDITAR</button>
                                                        <button onClick={() => { if (window.confirm("¿Borrar?")) supabase.from('products').delete().eq('id', p.id).then(() => fetchData('inventory')); }} className="btn-delete-icon-only"><span className="material-symbols-outlined">delete</span></button>
                                                    </div></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button className="btn-add-main" onClick={() => setIsModalOpen(true)}><span className="material-symbols-outlined">add</span> NUEVO PRODUCTO</button>
                            </section>
                        )}

                        {/* VENTAS CON ACCIÓN DE CANCELAR REPARADA */}
                        {activeTab === 'orders' && (
                            <section className="fade-in">
                                <div className="table-container">
                                    <table className="refined-table">
                                        <thead><tr><th>FECHA</th><th>CLIENTE</th><th>TOTAL</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
                                        <tbody>
                                            {orders && orders.length > 0 ? orders.map(o => (
                                                <tr key={o.id} style={{ opacity: o.status === 'cancelled' ? 0.5 : 1 }}>
                                                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                                    <td>{o.customer_name || 'Sin especificar'}</td>
                                                    <td>${o.total?.toLocaleString() || '0'}</td>
                                                    <td>
                                                        <select
                                                            className={`status-selector ${o.status}`}
                                                            value={o.status || 'pending'}
                                                            disabled={o.status === 'cancelled'}
                                                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                                        >
                                                            <option value="pending">Pendiente (Sin Pagar)</option>
                                                            <option value="paid">Pagado (A preparar)</option>
                                                            <option value="shipped">Enviado por Correo</option>
                                                            <option value="completed">Entregado</option>
                                                            <option value="cancelled">Cancelado</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <div className="actions-flex-row">
                                                            <button className="btn-edit-modern" onClick={() => setSelectedOrder(o)}>DETALLES</button>
                                                            {o.status !== 'cancelled' && (
                                                                <button className="btn-delete-icon-only" title="Cancelar Orden" onClick={() => handleCancelOrder(o)}>
                                                                    <span className="material-symbols-outlined">block</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No hay ventas registradas aún.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* FAQ */}
                        {activeTab === 'faq' && (
                            <section className="fade-in">
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                                    <button className="btn-edit-modern" style={{ background: '#1a1614', color: '#a5813a', borderColor: '#a5813a' }} onClick={handleSeedFAQs}>
                                        ✨ CARGAR PREGUNTAS REALES DE LA WEB
                                    </button>
                                </div>
                                <div className="table-container">
                                    <table className="refined-table">
                                        <thead><tr><th>PREGUNTA</th><th>RESPUESTA</th><th>ACCIONES</th></tr></thead>
                                        <tbody>
                                            {faqs.length > 0 ? faqs.map(f => (
                                                <tr key={f.id}>
                                                    <td style={{ width: '30%' }}><strong>{f.question}</strong></td>
                                                    <td>{f.answer?.substring(0, 100) || ''}...</td>
                                                    <td>
                                                        <div className="actions-flex-row">
                                                            <button className="btn-edit-modern" onClick={() => handleEditFAQ(f)}>EDITAR</button>
                                                            <button className="btn-delete-icon-only" onClick={async () => { if (window.confirm("¿Borrar esta pregunta?")) { await supabase.from('faqs').delete().eq('id', f.id).then(() => fetchData('faq')); } }}>
                                                                <span className="material-symbols-outlined">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>No hay preguntas cargadas.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="category-refined-add">
                                    <h3>{isEditingFAQ ? 'Modificar Pregunta Frecuente' : 'Nueva Pregunta Frecuente'}</h3>
                                    <form onSubmit={handleSaveFAQ} className="faq-form-pro">
                                        <input className="refined-input" placeholder="Pregunta" value={faqForm.question || ''} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} required />
                                        <textarea className="refined-input" style={{ height: '100px' }} placeholder="Respuesta..." value={faqForm.answer || ''} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} required />
                                        <div className="actions-flex-row">
                                            <button type="submit" className="btn-save-gold-full">{isEditingFAQ ? 'ACTUALIZAR PREGUNTA' : 'AÑADIR PREGUNTA'}</button>
                                            {isEditingFAQ && <button type="button" className="btn-delete-pro" style={{ padding: '18px' }} onClick={() => { setIsEditingFAQ(false); setFaqForm({ question: '', answer: '' }); }}>CANCELAR</button>}
                                        </div>
                                    </form>
                                </div>
                            </section>
                        )}

                        {/* CONFIGURACIÓN WEB */}
                        {activeTab === 'settings' && (
                            <section className="fade-in">
                                <div className="category-refined-add">
                                    <div className="card-header-pro"><span className="material-symbols-outlined">campaign</span>...<h3>Configuración Barra Dorada</h3></div>
                                    <div className="settings-grid-pro">
                                        <input className="refined-input" placeholder="Ej: ENVÍOS A TODO EL PAÍS, CALIDAD PREMIUM" value={siteSettings.banner_text || ''} onChange={e => setSiteSettings({ ...siteSettings, banner_text: e.target.value })} />
                                        <p className="field-helper-text" style={{ color: '#a5813a', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '15px', fontWeight: '700' }}>
                                            💡 ¡Truco Premium! Separá cada una de tus oraciones con una coma ( , ) y el sistema les inyectará el destello de la estrella automáticamente a cada una sin dejar baches.
                                        </p>
                                        <div className="banner-status-control">
                                            <label>Mostrar barra en la web:</label>
                                            <input type="checkbox" className="premium-checkbox" checked={siteSettings.banner_active} onChange={e => setSiteSettings({ ...siteSettings, banner_active: e.target.checked })} />
                                        </div>
                                        <button className="btn-save-gold-full" onClick={handleUpdateSettings}>GUARDAR AJUSTES</button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* CATEGORÍAS */}
                        {activeTab === 'categories' && (
                            <section className="fade-in">
                                <div className="table-container">
                                    <table className="refined-table">
                                        <thead><tr><th>ICONO</th><th>NOMBRE</th><th>ACCIONES</th></tr></thead>
                                        <tbody>
                                            {categoriesList.map(c => (
                                                <tr key={c.id}>
                                                    <td className="cell-icon">{c.image_url ? <img src={c.image_url} alt="" className="cat-mini-thumb" /> : c.icon}</td>
                                                    <td className="cell-name"><strong>{c.label}</strong></td>
                                                    <td><button className="btn-delete-pro" onClick={async () => { if (window.confirm("¿Borrar?")) { await supabase.from('categories').delete().eq('id', c.id).then(() => fetchData('categories')); } }}>ELIMINAR</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="category-refined-add">
                                    <div className="card-header-pro"><span className="material-symbols-outlined">category</span><h3>Nueva Categoría</h3></div>
                                    <div className="cat-inputs">
                                        <div className="cat-img-box">
                                            <input type="file" id="cat-img" className="hidden-input" onChange={(e) => uploadImage(e, 'category')} />
                                            <label htmlFor="cat-img">{newCategory.image_url ? <img src={newCategory.image_url} className="image-preview" /> : <span className="material-symbols-outlined">add_a_photo</span>}</label>
                                        </div>
                                        <div className="input-with-label"><label>Nombre</label><input className="refined-input" value={newCategory.label} onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} required /></div>
                                        <div className="input-with-label" style={{ width: '100px' }}><label>Icono</label><input className="refined-input" style={{ textAlign: 'center' }} value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} /></div>
                                        <button className="btn-save-gold-full" style={{ marginTop: '22px', height: '54px' }} onClick={async () => {
                                            const id = newCategory.label.toLowerCase().trim().replace(/ /g, '-');
                                            await supabase.from('categories').insert([{ id, label: newCategory.label, icon: newCategory.icon, image_url: newCategory.image_url }]);
                                            setNewCategory({ label: '', icon: '🧉', image_url: '' });
                                            fetchData('categories');
                                            toast.success("Categoría creada");
                                        }}>CREAR CATEGORÍA</button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>

            {/* 🚚 MODAL DETALLES PEDIDO EXTENDIDO PARA MERCADO ENVÍOS 🚚 */}
            {selectedOrder && (
                <div className="refined-modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="refined-modal-card order-modal" onClick={e => e.stopPropagation()}>
                        <header className="modal-refined-header">
                            <h2>Ficha de Venta #{selectedOrder.id?.slice(0, 5).toUpperCase()}</h2>
                            <button className="btn-close-modern-circle" onClick={() => setSelectedOrder(null)}><span className="material-symbols-outlined">close</span></button>
                        </header>
                        <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                            <div className="client-box" style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontFamily: 'Noto Serif, serif', marginBottom: '15px', color: '#a5813a' }}>Datos de Entrega</h3>
                                <p style={{ margin: '8px 0' }}><strong>Cliente:</strong> {selectedOrder.customer_name}</p>
                                <p style={{ margin: '8px 0' }}><strong>WhatsApp:</strong> {selectedOrder.customer_phone}</p>
                                <p style={{ margin: '8px 0' }}><strong>Email:</strong> {selectedOrder.customer_email || 'No especificado'}</p>
                                <p style={{ margin: '8px 0' }}><strong>Fecha Compra:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '15px 0' }} />
                                <p style={{ margin: '8px 0' }}><strong>Método de Despacho:</strong></p>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    backgroundColor: selectedOrder.shipping_method?.includes('mercado_envios') ? '#fff159' : '#e2e8f0',
                                    color: '#1a1614',
                                    fontWeight: '800',
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    textTransform: 'uppercase',
                                    marginBottom: '10px'
                                }}>
                                    {selectedOrder.shipping_method?.includes('mercado_envios') ? '🚚 MERCADO ENVÍOS ACTIVO' : '🏠 RETIRO EN LOCAL'}
                                </span>
                                <p style={{ margin: '8px 0', lineHeight: '1.4' }}><strong>Dirección Postal:</strong> <br />{selectedOrder.shipping_address || 'Retira en local (Código Vinario)'}</p>
                            </div>

                            <div className="items-box" style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'Noto Serif, serif', marginBottom: '15px', color: '#a5813a' }}>Resumen del Mate</h3>
                                    {selectedOrder.items?.map((it, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
                                            <span style={{ fontWeight: '600' }}>{it.quantity}x {it.title}</span>
                                            <span style={{ fontWeight: '700' }}>${(it.unit_price * it.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#1a1614', color: '#a5813a', padding: '15px', borderRadius: '12px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#fff' }}>TOTAL PROCESADO</span>
                                    <span style={{ fontWeight: '800', fontSize: '1.4rem' }}>${selectedOrder.total?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL FICHA PRODUCTO */}
            {isModalOpen && (
                <div className="refined-modal-backdrop" onClick={closeModal}>
                    <div className="refined-modal-card" onClick={e => e.stopPropagation()}>
                        <header className="modal-refined-header">
                            <h2>{isEditing ? 'Editar Ficha' : 'Nueva Ficha'}</h2>
                            <button type="button" onClick={closeModal} className="btn-close-modern-circle"><span className="material-symbols-outlined">close</span></button>
                        </header>
                        <form className="modal-refined-form" onSubmit={handleSaveProduct}>
                            <div className="form-refined-grid">
                                <div className="form-side">
                                    <label className="admin-label">Foto de Portada</label>
                                    <div className="upload-refined-main">
                                        <input type="file" id="main-img" className="hidden-input" onChange={(e) => uploadImage(e, 'main')} />
                                        {newProduct.image_url ? (
                                            <div className="preview-container-main">
                                                <img src={newProduct.image_url} className="image-preview" alt="" />
                                                <button type="button" className="btn-remove-photo-pro" onClick={removeMainImage}><span className="material-symbols-outlined">delete</span></button>
                                            </div>
                                        ) : (
                                            <label htmlFor="main-img" className="placeholder-main-label"><span className="material-symbols-outlined">image</span><p>Subir portada</p></label>
                                        )}
                                    </div>
                                    <label className="admin-label">Galería de Detalles</label>
                                    <div className="extra-images-grid-admin">
                                        {newProduct.extra_images?.map((img, i) => (
                                            <div key={i} className="mini-thumb-container-pro">
                                                <img src={img} className="mini-gallery-thumb" alt="" />
                                                <button type="button" className="btn-remove-extra-pro" onClick={(e) => removeExtraImage(e, i)}>×</button>
                                            </div>
                                        ))}
                                        <div className="upload-extra-pro">
                                            <input type="file" id="extra-img" className="hidden-input" onChange={(e) => uploadImage(e, 'extra')} />
                                            <label htmlFor="extra-img"><span className="material-symbols-outlined">add_photo_alternate</span><p>Vistas</p></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-side inputs-side">
                                    <input className="refined-input" placeholder="Nombre" required value={newProduct.name || ''} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                    <div className="form-split-modern">
                                        <input type="number" className="refined-input" placeholder="Precio ($)" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                        <input type="number" className="refined-input" placeholder="Stock" value={newProduct.stock || 0} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                    </div>
                                    <div className="form-split-modern">
                                        <input className="refined-input" placeholder="Material Vacuno/Alpaca" value={newProduct.material || ''} onChange={e => setNewProduct({ ...newProduct, material: e.target.value })} />
                                        <input className="refined-input" placeholder="Tipo Imperial/Camionero" value={newProduct.type || ''} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })} />
                                    </div>
                                    <div className="form-split-modern">
                                        <select className="refined-input selector-premium" value={newProduct.category || 'mates'} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                            {categoriesList.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                        <input className="refined-input" placeholder="Badge/Etiqueta" value={newProduct.badge || ''} onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })} />
                                    </div>
                                    <textarea className="refined-input desc-box" placeholder="Descripción principal..." value={newProduct.description || ''} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                    <textarea className="refined-input desc-box" style={{ height: '80px' }} placeholder="Especificaciones Técnicas (Specs)..." value={newProduct.specs || ''} onChange={e => setNewProduct({ ...newProduct, specs: e.target.value })} />
                                    <input className="refined-input" placeholder="URL Reel Instagram" value={newProduct.video_url || ''} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} />
                                    <div className="modal-actions-footer">
                                        <button type="button" onClick={closeModal} className="btn-modal-action discard">DESCARTAR</button>
                                        <button type="submit" className="btn-modal-action save" disabled={uploading}>GUARDAR CAMBIOS</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}