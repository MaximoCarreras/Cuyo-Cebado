import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('todas');

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

    const handleUpdate = async (id, field, value) => {
        // Actualización local rápida
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

        const { error } = await supabase
            .from('products')
            .update({ [field]: value })
            .eq('id', id);

        if (error) {
            toast.error("Error al sincronizar con la base de datos");
            fetchProducts();
        } else {
            toast.success("¡Cambio guardado!", {
                style: { background: '#1a1614', color: '#a5813a', border: '1px solid #a5813a' }
            });
        }
    };

    // Lógica de filtrado
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'todas' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Estadísticas rápidas
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockCount = products.filter(p => p.stock < 5).length;

    if (loading) return <div className="admin-loading">Cargando la estancia...</div>;

    return (
        <div className="admin-container">
            <Toaster position="top-right" />

            <header className="admin-header">
                <div className="header-info">
                    <h1>Panel de Control</h1>
                    <p>Gestioná el stock y precios de Cuyo Cebado en tiempo real.</p>
                </div>
                <div className="admin-stats">
                    <div className="stat-card">
                        <span>Productos</span>
                        <strong>{products.length}</strong>
                    </div>
                    <div className="stat-card">
                        <span>Stock Total</span>
                        <strong>{totalStock}</strong>
                    </div>
                    <div className="stat-card alert">
                        <span>Stock Bajo</span>
                        <strong>{lowStockCount}</strong>
                    </div>
                </div>
            </header>

            <div className="admin-controls">
                <div className="search-box">
                    <span className="material-symbols-outlined">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="admin-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="todas">Todas las categorías</option>
                    <option value="mates">Mates</option>
                    <option value="yerbas">Yerbas</option>
                    <option value="bombillas">Bombillas</option>
                </select>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio ($)</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} className={product.stock < 5 ? 'row-low-stock' : ''}>
                                <td className="td-name">{product.name}</td>
                                <td className="td-category">{product.category}</td>
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
                                        readOnly
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