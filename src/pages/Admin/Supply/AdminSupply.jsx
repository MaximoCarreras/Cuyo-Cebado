import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import './AdminSupply.css';

export default function AdminSupply() {
    const [products, setProducts] = useState([]);
    const [comprasHistorial, setComprasHistorial] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estado para la compra que estamos armando
    const [newSupply, setNewSupply] = useState({ proveedor: '', flete: 0, items: [] });
    
    // Estado para el producto individual que estamos por agregar a la lista
    const [draftItem, setDraftItem] = useState({ product_id: '', name: '', image_url: '', quantity: 1, unit_price: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Traemos productos para el selector (necesitamos imagen y nombre)
        const { data: prodData } = await supabase.from('products').select('id, name, image_url').order('name');
        setProducts(prodData || []);

        // Traemos el historial de compras
        const { data: compData } = await supabase.from('compras_mayoristas').select('*').order('created_at', { ascending: false });
        setComprasHistorial(compData || []);
        
        setLoading(false);
    };

    // Manejar selección del producto en el form
    const handleProductSelect = (e) => {
        const selectedId = e.target.value;
        const selectedProd = products.find(p => p.id === selectedId);
        if (selectedProd) {
            setDraftItem({ ...draftItem, product_id: selectedProd.id, name: selectedProd.name, image_url: selectedProd.image_url });
        } else {
            setDraftItem({ ...draftItem, product_id: '', name: '', image_url: '' });
        }
    };

    // Agregar item a la compra actual
    const handleAddItemToSupply = () => {
        if (!draftItem.product_id || draftItem.quantity <= 0 || draftItem.unit_price <= 0) {
            toast.error("Completá bien los datos del producto");
            return;
        }
        setNewSupply({ ...newSupply, items: [...newSupply.items, draftItem] });
        // Resetear el form chiquito
        setDraftItem({ product_id: '', name: '', image_url: '', quantity: 1, unit_price: 0 });
    };

    // Quitar item de la compra actual
    const handleRemoveItem = (index) => {
        const filtered = newSupply.items.filter((_, i) => i !== index);
        setNewSupply({ ...newSupply, items: filtered });
    };

    // Confirmar toda la compra a Supabase
    const handleConfirmSupply = async () => {
        if (!newSupply.proveedor) return toast.error("Falta el nombre del proveedor");
        if (newSupply.items.length === 0) return toast.error("No agregaste ningún producto a la compra");

        const subtotal = newSupply.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
        const totalFinal = subtotal + Number(newSupply.flete || 0);

        // 1. Guardar la compra en el historial
        const { error } = await supabase.from('compras_mayoristas').insert([{ 
            proveedor_nombre: newSupply.proveedor, 
            flete_total: Number(newSupply.flete),
            total: totalFinal,
            items: newSupply.items
        }]);

        if (error) {
            toast.error("Error al registrar la compra");
            return;
        }

        // 2. Actualizar el stock de cada producto en la base de datos
        for (const item of newSupply.items) {
            const { data: prod } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
            if (prod) {
                await supabase.from('products').update({ stock: prod.stock + Number(item.quantity) }).eq('id', item.product_id);
            }
        }
        
        toast.success("Compra registrada. ¡Stock del catálogo sumado automáticamente! 📦");
        setNewSupply({ proveedor: '', flete: 0, items: [] });
        fetchData();
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Cálculos en vivo
    const subtotalActual = newSupply.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    const totalActual = subtotalActual + Number(newSupply.flete || 0);

    return (
        <section className="fade-in">
            <h2>🏭 Gestión de Compras Mayoristas</h2>
            
            {/* 1. SECCIÓN DE NUEVO INGRESO */}
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
                        <select className="refined-input" value={draftItem.product_id} onChange={handleProductSelect}>
                            <option value="">-- Seleccionar Producto --</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
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
                                            <img src={item.image_url || '/assets/placeholder.png'} className="cat-mini-thumb" alt="" style={{ width:'35px', height:'35px' }}/>
                                            {item.name}
                                        </td>
                                        <td>{item.quantity} u.</td>
                                        <td>${Number(item.unit_price).toLocaleString()}</td>
                                        <td style={{ fontWeight: 'bold' }}>${(item.quantity * item.unit_price).toLocaleString()}</td>
                                        <td>
                                            <button className="btn-remove-extra-pro" style={{ position: 'relative', top: '0', right: '0' }} onClick={() => handleRemoveItem(idx)}>×</button>
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

                        <button className="btn-save-gold-full" onClick={handleConfirmSupply}>✅ CONFIRMAR Y SUMAR AL STOCK</button>
                    </div>
                )}
            </div>

            {/* 2. HISTORIAL DE COMPRAS (ACORDEÓN) */}
            <div className="category-refined-add">
                <div className="card-header-pro" style={{ marginBottom: '15px' }}>
                    <span className="material-symbols-outlined">history</span>
                    <h3>Historial de Pedidos</h3>
                </div>
                
                {loading ? <p>Cargando historial...</p> : comprasHistorial.length === 0 ? <p style={{ color: '#64748b' }}>No hay compras registradas aún.</p> : (
                    <div className="accordion-container">
                        {comprasHistorial.map((compra, index) => {
                            const isExpanded = expandedId === compra.id;
                            const numeroPedido = comprasHistorial.length - index; // Para que el más nuevo tenga el número más alto
                            
                            // Parsear items por seguridad
                            let itemsComprados = [];
                            try { itemsComprados = typeof compra.items === 'string' ? JSON.parse(compra.items) : compra.items || []; } catch(e) {}

                            return (
                                <div key={compra.id} className={`accordion-card ${isExpanded ? 'expanded' : ''}`}>
                                    {/* CABECERA (Siempre visible) */}
                                    <div className="accordion-header" onClick={() => toggleExpand(compra.id)}>
                                        <div className="acc-info-left">
                                            <span className="acc-badge">Pedido #{numeroPedido}</span>
                                            <span className="acc-date">{new Date(compra.created_at).toLocaleDateString()}</span>
                                            <strong className="acc-provider">{compra.proveedor_nombre}</strong>
                                        </div>
                                        <div className="acc-info-right">
                                            <strong className="acc-total">${compra.total?.toLocaleString()}</strong>
                                            <span className="material-symbols-outlined expand-icon">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                                        </div>
                                    </div>

                                    {/* DETALLE (Desplegable) */}
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
                                                        <div className="acc-item-subtotal">
                                                            ${(item.quantity * item.unit_price).toLocaleString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="acc-footer-summary">
                                                <div className="acc-summary-line">
                                                    <span>Costo Flete:</span>
                                                    <span>${compra.flete_total?.toLocaleString()}</span>
                                                </div>
                                                <div className="acc-summary-line total">
                                                    <span>Total Abonado:</span>
                                                    <span>${compra.total?.toLocaleString()}</span>
                                                </div>
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