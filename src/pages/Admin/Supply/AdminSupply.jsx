import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import './AdminSupply.css';

export default function AdminSupply() {
    const [products, setProducts] = useState([]);
    const [comprasHistorial, setComprasHistorial] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [newSupply, setNewSupply] = useState({ proveedor: '', flete: 0, items: [] });
    const [draftItem, setDraftItem] = useState({ name: '', quantity: 1, unit_price: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: prodData } = await supabase.from('products').select('id, name, image_url').order('name');
        setProducts(prodData || []);

        const { data: compData } = await supabase.from('compras_mayoristas').select('*').order('created_at', { ascending: false });
        setComprasHistorial(compData || []);
        
        setLoading(false);
    };

    const handleAddItemToSupply = () => {
        if (!draftItem.name.trim() || draftItem.quantity <= 0 || draftItem.unit_price <= 0) {
            toast.error("Completá bien los datos del producto");
            return;
        }

        const matchedProduct = products.find(p => p.name.toLowerCase() === draftItem.name.trim().toLowerCase());

        const newItem = {
            ...draftItem,
            product_id: matchedProduct ? matchedProduct.id : null,
            image_url: matchedProduct ? matchedProduct.image_url : '',
        };

        setNewSupply({ ...newSupply, items: [...newSupply.items, newItem] });
        setDraftItem({ name: '', quantity: 1, unit_price: 0 });
    };

    const handleRemoveItem = (index) => {
        const filtered = newSupply.items.filter((_, i) => i !== index);
        setNewSupply({ ...newSupply, items: filtered });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que querés borrar esta compra del historial?")) return;
        
        const { error } = await supabase.from('compras_mayoristas').delete().eq('id', id);
        if (error) {
            toast.error("Error al borrar: " + error.message);
        } else {
            toast.success("Compra eliminada.");
            fetchData();
        }
    };

    const handleConfirmSupply = async () => {
        if (!newSupply.proveedor) return toast.error("Falta el nombre del proveedor");
        if (newSupply.items.length === 0) return toast.error("No agregaste ningún producto");

        const subtotal = newSupply.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
        const totalFinal = subtotal + Number(newSupply.flete || 0);

        const { error } = await supabase.from('compras_mayoristas').insert([{ 
            proveedor_nombre: newSupply.proveedor, 
            flete_total: Number(newSupply.flete),
            total: totalFinal,
            items: newSupply.items
        }]);

        if (error) {
            toast.error("Error al registrar: " + error.message);
            return;
        }

        let nuevosCount = 0;
        for (const item of newSupply.items) {
            if (item.product_id) {
                const { data: prod } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
                if (prod) {
                    await supabase.from('products').update({ stock: prod.stock + Number(item.quantity) }).eq('id', item.product_id);
                }
            } else {
                nuevosCount++;
            }
        }
        
        if (nuevosCount > 0) {
            toast.success(`Compra guardada. Recordá crear los ${nuevosCount} productos nuevos.`);
        } else {
            toast.success("Compra registrada y stock actualizado.");
        }

        setNewSupply({ proveedor: '', flete: 0, items: [] });
        fetchData();
    };

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    const subtotalActual = newSupply.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    const totalActual = subtotalActual + Number(newSupply.flete || 0);

    return (
        <section className="fade-in">
            <h2>🏭 Gestión de Compras Mayoristas</h2>
            
            <div className="category-refined-add" style={{ marginBottom: '40px' }}>
                <div className="card-header-pro">
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    <h3>Registrar Nuevo Ingreso de Mercadería</h3>
                </div>
                
                <div className="supply-grid-top">
                    <div className="input-with-label">
                        <label className="admin-label">Proveedor</label>
                        <input className="refined-input" placeholder="Ej: Distribuidora Mates Sur" value={newSupply.proveedor} onChange={e => setNewSupply({...newSupply, proveedor: e.target.value})} />
                    </div>
                    <div className="input-with-label">
                        <label className="admin-label">Costo de Envío / Flete ($)</label>
                        <input className="refined-input" type="number" placeholder="Ej: 5000" value={newSupply.flete} onChange={e => setNewSupply({...newSupply, flete: e.target.value})} />
                    </div>
                </div>

                <div className="supply-item-adder">
                    <h4 className="admin-label" style={{ marginBottom: '15px', display: 'block' }}>Agregar Productos a este pedido</h4>
                    <div className="item-adder-row">
                        <input className="refined-input" list="catalogo-productos" placeholder="Nombre del producto..." value={draftItem.name} onChange={e => setDraftItem({...draftItem, name: e.target.value})} />
                        <datalist id="catalogo-productos">
                            {products.map(p => <option key={p.id} value={p.name} />)}
                        </datalist>
                        <input className="refined-input" type="number" placeholder="Cantidad" value={draftItem.quantity} onChange={e => setDraftItem({...draftItem, quantity: e.target.value})} />
                        <input className="refined-input" type="number" placeholder="Costo Unitario ($)" value={draftItem.unit_price} onChange={e => setDraftItem({...draftItem, unit_price: e.target.value})} />
                        <button className="btn-add-item-pro" onClick={handleAddItemToSupply}>
                            <span className="material-symbols-outlined">add</span> AGREGAR
                        </button>
                    </div>
                </div>

                {newSupply.items.length > 0 && (
                    <div className="supply-draft-list">
                        <table className="refined-table" style={{ minWidth: '100%', marginBottom: '20px' }}>
                            <thead><tr><th>PRODUCTO</th><th>CANT.</th><th>COSTO U.</th><th>SUBTOTAL</th><th></th></tr></thead>
                            <tbody>
                                {newSupply.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="cell-product">
                                            <img src={item.image_url || '/assets/placeholder.png'} className="cat-mini-thumb" alt="" style={{ width:'35px', height:'35px', marginRight:'10px' }}/>
                                            {item.name} {item.product_id ? '✅' : '🆕'}
                                        </td>
                                        <td>{item.quantity} u.</td>
                                        <td>${Number(item.unit_price).toLocaleString()}</td>
                                        <td style={{ fontWeight: 'bold' }}>${(item.quantity * item.unit_price).toLocaleString()}</td>
                                        <td>
                                            <button className="btn-remove-extra-pro" onClick={() => handleRemoveItem(idx)}>×</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="supply-totals-box">
                            <div className="totals-row"><span>Subtotal Productos:</span> <span>${subtotalActual.toLocaleString()}</span></div>
                            <div className="totals-row"><span>Flete / Envío:</span> <span>${Number(newSupply.flete || 0).toLocaleString()}</span></div>
                            <div className="totals-row grand-total"><span>TOTAL INVERSIÓN:</span> <span>${totalActual.toLocaleString()}</span></div>
                        </div>

                        <button className="btn-save-gold-full" onClick={handleConfirmSupply}>✅ CONFIRMAR COMPRA</button>
                    </div>
                )}
            </div>

            <div className="category-refined-add">
                <div className="card-header-pro" style={{ marginBottom: '15px' }}>
                    <span className="material-symbols-outlined">history</span>
                    <h3>Historial de Pedidos</h3>
                </div>
                
                {loading ? <p>Cargando historial...</p> : comprasHistorial.length === 0 ? <p style={{ color: '#64748b' }}>No hay compras registradas.</p> : (
                    <div className="accordion-container">
                        {comprasHistorial.map((compra, index) => {
                            const isExpanded = expandedId === compra.id;
                            const numeroPedido = comprasHistorial.length - index;
                            let itemsComprados = [];
                            try { itemsComprados = typeof compra.items === 'string' ? JSON.parse(compra.items) : compra.items || []; } catch(e) {}

                            return (
                                <div key={compra.id} className={`accordion-card ${isExpanded ? 'expanded' : ''}`}>
                                    <div className="accordion-header" onClick={() => toggleExpand(compra.id)}>
                                        <div className="acc-info-left">
                                            <span className="acc-badge">Pedido #{numeroPedido}</span>
                                            <span className="acc-date">{new Date(compra.created_at).toLocaleDateString()}</span>
                                            <strong className="acc-provider">{compra.proveedor_nombre}</strong>
                                        </div>
                                        <div className="acc-info-right">
                                            <strong className="acc-total">${compra.total?.toLocaleString()}</strong>
                                            {/* BOTÓN BORRAR HISTORIAL */}
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(compra.id); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#ff4d4d', marginLeft:'10px' }}>
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                            <span className="material-symbols-outlined expand-icon">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="accordion-body">
                                            <div className="acc-items-grid">
                                                {itemsComprados.map((item, i) => (
                                                    <div key={i} className="acc-item-row">
                                                        <div className="acc-item-main">
                                                            <img src={item.image_url || '/assets/placeholder.png'} alt="" />
                                                            <div>
                                                                <p className="acc-item-name">{item.name}</p>
                                                                <p className="acc-item-price">{item.quantity} un. x ${Number(item.unit_price).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="acc-item-subtotal">${(item.quantity * item.unit_price).toLocaleString()}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="acc-footer-summary">
                                                <div className="acc-summary-line"><span>Costo Flete:</span> <span>${compra.flete_total?.toLocaleString()}</span></div>
                                                <div className="acc-summary-line total"><span>Total Abonado:</span> <span>${compra.total?.toLocaleString()}</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}