import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function AdminInventory() {
    const [products, setProducts] = useState([]);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('name');
        setProducts(data || []);
    };

    const updateStock = async (id, currentStock, change) => {
        const newStock = currentStock + change;
        await supabase.from('products').update({ stock: newStock }).eq('id', id);
        fetchProducts();
        toast.success("Stock actualizado");
    };

    return (
        <div>
            <h2>Stock de Mates</h2>
            <table className="refined-table">
                <thead><tr><th>Producto</th><th>Stock</th><th>Acciones</th></tr></thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button onClick={() => updateStock(p.id, p.stock, -1)}>-</button>
                                <button onClick={() => updateStock(p.id, p.stock, 1)}>+</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}