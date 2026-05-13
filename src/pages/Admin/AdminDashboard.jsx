import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('name');
        setProducts(data);
    };

    const updateStock = async (id, newStock) => {
        await supabase.from('products').update({ stock: newStock }).eq('id', id);
        fetchProducts(); // Recargamos para ver el cambio
    };

    return (
        <div className="admin-dashboard" style={{ padding: '140px 20px' }}>
            <h1 className="section__title">Gestión de Cuyo Cebado</h1>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock Actual</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>${p.price}</td>
                            <td>{p.stock} unidades</td>
                            <td>
                                <button onClick={() => updateStock(p.id, p.stock + 1)}>+1</button>
                                <button onClick={() => updateStock(p.id, p.stock - 1)}>-1</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}