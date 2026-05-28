import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import './AdminInventory.css'; 

export default function AdminInventory() {
    const [products, setProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialFormState = {
        name: '', price: '', stock: 0, category: 'mates',
        material: '', type: '', specs: '', badge: '',
        description: '', image_url: '', video_url: '', extra_images: [],
        is_featured: false
    };
    const [newProduct, setNewProduct] = useState(initialFormState);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setTabLoading(true);
        try {
            const { data: pData } = await supabase.from('products').select('*').order('name');
            setProducts(pData || []);
            const { data: catData } = await supabase.from('categories').select('*').order('label');
            setCategoriesList(catData || []);
        } catch (err) { 
            console.error(err); 
            toast.error("Error al cargar el inventario");
        }
        setTabLoading(false);
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
        fetchInventory();
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

    return (
        <section className="fade-in">
            {tabLoading ? (
                <div className="tab-internal-loader"><p>Cargando inventario...</p></div>
            ) : (
                <>
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
                                        <td className="cell-product"><img src={p.image_url || '/assets/placeholder.png'} className="mini-thumb" alt={p.name} />{p.name}</td>
                                        <td>${p.price.toLocaleString()}</td>
                                        <td>
                                            <div className="refined-stock-pill">
                                                <button className="stock-btn minus" onClick={() => handleUpdateField(p.id, 'stock', p.stock - 1)}>−</button>
                                                <span className="stock-qty">{p.stock}</span>
                                                <button className="stock-btn plus" onClick={() => handleUpdateField(p.id, 'stock', p.stock + 1)}>+</button>
                                            </div>
                                        </td>
                                        <td><button className={`star-refined-btn ${p.is_featured ? 'active' : ''}`} onClick={() => handleToggleFeatured(p)}><span className="material-symbols-outlined">{p.is_featured ? 'star_rate' : 'star'}</span></button></td>
                                        <td>
                                            <div className="actions-flex-row">
                                                <button onClick={() => { setIsEditing(true); setEditingId(p.id); setNewProduct(p); setIsModalOpen(true); }} className="btn-edit-modern">EDITAR</button>
                                                <button onClick={() => { if (window.confirm("¿Borrar?")) supabase.from('products').delete().eq('id', p.id).then(() => fetchInventory()); }} className="btn-delete-icon-only"><span className="material-symbols-outlined">delete</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <button className="btn-add-main" onClick={() => setIsModalOpen(true)}><span className="material-symbols-outlined">add</span> NUEVO PRODUCTO</button>
                </>
            )}

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
        </section>
    );
}