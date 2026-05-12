import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { categories } from '../../data/products'; // Solo importamos categorías
import { useCart } from '../../context/CartContext';
import './CategoryPage.css';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();

    const [dbProducts, setDbProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [maxPrice, setMaxPrice] = useState(250000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');
    const [selectedType, setSelectedType] = useState('todos');

    const currentCategory = categories.find(cat => cat.id === categoryId);

    // Buscamos los productos en el servidor al cargar la página
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_URL}/api/products`);
                const data = await response.json();
                setDbProducts(data);
            } catch (error) {
                console.error("Error en la conexión con el catálogo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    const filteredProducts = useMemo(() => {
        return dbProducts.filter(p => {
            const matchCategory = p.category === categoryId;
            const matchPrice = p.price <= maxPrice;
            const matchMaterial = selectedMaterial === 'todos' || p.material === selectedMaterial;
            const matchType = selectedType === 'todos' || p.type === selectedType;
            return matchCategory && matchPrice && matchMaterial && matchType;
        });
    }, [dbProducts, categoryId, maxPrice, selectedMaterial, selectedType]);

    const getOptions = (key) => {
        const items = dbProducts.filter(p => p.category === categoryId);
        return ['todos', ...new Set(items.map(p => p[key]).filter(Boolean))];
    };

    if (loading) return <div className="loading-view">🧉 Preparando el catálogo de Cuyo...</div>;

    return (
        <div className="category-page">
            <div className="category-page__nav">
                <Link to="/productos" className="btn-back">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver a categorías
                </Link>
            </div>

            <div className="category-page__main">
                <aside className="sidebar">
                    <div className="sidebar__title">
                        <h3>Filtros</h3>
                        <div className="gold-dot"></div>
                    </div>

                    <div className="filter-group">
                        <label>Precio máximo: <b>${maxPrice.toLocaleString()}</b></label>
                        <input
                            type="range"
                            min="0"
                            max="250000"
                            step="5000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                    </div>

                    {getOptions('material').length > 1 && (
                        <div className="filter-group">
                            <label>Material</label>
                            <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
                                {getOptions('material').map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                            </select>
                        </div>
                    )}

                    {getOptions('type').length > 1 && (
                        <div className="filter-group">
                            <label>Estilo</label>
                            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                {getOptions('type').map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                            </select>
                        </div>
                    )}
                </aside>

                <section className="products-content">
                    <header className="category-header">
                        <h1 className="section__title">{currentCategory?.label}</h1>
                        <p className="products-count">{filteredProducts.length} piezas encontradas</p>
                    </header>

                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className={`product-card ${product.stock === 0 ? 'out-of-stock-card' : ''}`}>
                                {product.stock === 0 ? (
                                    <span className="product-badge out-of-stock">Sin Stock</span>
                                ) : (
                                    product.is_featured && <span className="product-badge">Top Ventas</span>
                                )}

                                <div className="product-image-container">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="product-img-real" />
                                    ) : (
                                        <span className="category-icon-bg">{currentCategory?.icon}</span>
                                    )}
                                    {product.stock === 0 && <div className="out-of-stock-overlay">Agotado</div>}
                                </div>

                                <div className="product-info">
                                    <p className="product-tag">{product.material}</p>
                                    <h4 className="product-name">{product.name}</h4>
                                    <p className="product-price">${Number(product.price).toLocaleString()}</p>

                                    <button
                                        className={`btn-add-to-cart ${product.stock === 0 ? 'btn-disabled' : ''}`}
                                        onClick={() => product.stock > 0 && addToCart(product)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock === 0 ? 'Sin Disponibilidad' : 'Añadir al Carrito'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}