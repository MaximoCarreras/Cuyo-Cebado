import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name');
        if (!error) setProducts(data);
        setLoading(false);
    };

    // ESTA ES LA FUNCIÓN CLAVE QUE GUARDA EN SUPABASE
    const handleUpdate = async (id, field, value) => {
        // 1. Actualizamos visualmente primero para que sea rápido
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

        // 2. Guardamos en Supabase inmediatamente
        const { error } = await supabase
            .from('products')
            .update({ [field]: value })
            .eq('id', id);

        if (error) {
            alert("Error al guardar: " + error.message);
            fetchProducts(); // Si falla, recargamos los datos originales
        }
    };

    if (loading) return <div className="admin-loading">Cargando inventario...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Panel de Control</h1>
                <p>Los cambios se guardan automáticamente al modificar los valores.</p>
            </header>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio ($)</th>
                            <th>Stock</th>
                            <th>Acciones de Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>
                                    <input
                                        type="number"
                                        className="admin-input-price"
                                        defaultValue={product.price}
                                        // Cuando el usuario deja de escribir (onBlur), guardamos
                                        onBlur={(e) => handleUpdate(product.id, 'price', Number(e.target.value))}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="admin-input-stock"
                                        value={product.stock}
                                        onChange={(e) => handleUpdate(product.id, 'stock', Number(e.target.value))}
                                    />
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button onClick={() => handleUpdate(product.id, 'stock', product.stock + 1)} className="btn-stock">+</button>
                                        <button onClick={() => handleUpdate(product.id, 'stock', Math.max(0, product.stock - 1))} className="btn-stock">-</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}