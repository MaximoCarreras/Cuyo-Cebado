import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import '../AdminDashboard.css';

export default function AdminSupply() {
    const [products, setProducts] = useState([]);
    const [newSupply, setNewSupply] = useState({ proveedor: '', flete: 0, items: [] });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('id, name');
        setProducts(data || []);
    };

    const handleAddSupply = async () => {
        if (!newSupply.proveedor) return toast.error("Falta el proveedor");

        const { data: compra, error } = await supabase
            .from('compras_mayoristas')
            .insert([{ proveedor_nombre: newSupply.proveedor, flete_total: newSupply.flete }])
            .select()
            .single();

        if (error) return toast.error("Error al registrar compra");
        
        toast.success("Compra registrada. ¡Stock actualizado!");
        setNewSupply({ proveedor: '', flete: 0, items: [] });
    };

    return (
        <section className="fade-in">
            <h2>🏭 Compras Mayoristas</h2>
            <div className="category-refined-add">
                <h3>Nueva Carga de Stock</h3>
                <div className="cat-inputs">
                    <input className="refined-input" placeholder="Nombre Proveedor" value={newSupply.proveedor} onChange={e => setNewSupply({...newSupply, proveedor: e.target.value})} />
                    <input className="refined-input" type="number" placeholder="Flete ($)" value={newSupply.flete} onChange={e => setNewSupply({...newSupply, flete: e.target.value})} />
                    <button className="btn-save-gold-full" onClick={handleAddSupply}>CONFIRMAR RECEPCIÓN</button>
                </div>
            </div>
        </section>
    );
}