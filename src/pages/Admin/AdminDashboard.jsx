import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/mi-cuenta');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                navigate('/');
            } else {
                fetchProducts();
            }
        };

        checkAdmin();
    }, [navigate]);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name', { ascending: true });

        if (!error) setProducts(data);
        setLoading(false);
    };

    const handleUpdate = async (id, field, value) => {
        const { error } = await supabase
            .from('products')
            .update({ [field]: value })
            .eq('id', id);

        if (!error) {
            setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
        }
    };

    if (loading) return <div className="admin-loading">Cargando inventario...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Panel de Control</h1>
                <p>Gestión de Stock y Precios - Cuyo Cebado</p>
            </header>

            <div className="admin-stats">
                <div className="stat-card">
                    <span>Total Productos</span>
                    <strong>{products.length}</strong>
                </div>
                <div className="stat-card">
                    <span>Sin Stock</span>
                    <strong style={{ color: '#ff4d4d' }}>
                        {products.filter(p => p.stock === 0).length}
                    </strong>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio ($)</th>
                            <th>Stock</th>
                            <th>Acciones Rápidas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className={product.stock === 0 ? 'row-no-stock' : ''}>
                                <td className="td-name">{product.name}</td>
                                <td className="td-cat">{product.category}</td>
                                <td>
                                    <input
                                        type="number"
                                        className="admin-input-price"
                                        defaultValue={product.price}
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