import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { categories } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './CategoryPage.css';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();

    const [dbProducts, setDbProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [maxPrice, setMaxPrice] = useState(250000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');

    const currentCategory = categories.find(cat => cat.id === categoryId);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const API_URL = import.meta.env.VITE_API_URL || 'https://cuyo-cebado.onrender.com';
                const response = await fetch(`${API_URL}/api/products`);
                const data = await response.json();
                setDbProducts(data);
            } catch (error) {
                console.error("Error cargando productos:", error);
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
            return matchCategory && matchPrice && matchMaterial;
        });
    }, [dbProducts, categoryId, maxPrice, selectedMaterial]);

    const getOptions = (key) => {
        const items = dbProducts.filter(p => p.category === categoryId);
        return ['todos', ...new Set(items.map(p => p[key]).filter(Boolean))];
    };

    if (loading) return <div className="loading-view-mafia">🧉 Preparando el catálogo de Cuyo...</div>;

    return (
        <div className="category-page">
            <div className="category-page__nav">
                <Link to="/productos" className="btn-back">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver a categorías
                </Link>
            </div>

            <div className="category-page__main">
                <aside className="sidebar-mafia">
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
                </aside>

                <section className="products-content">
                    <header className="category-header">
                        <h1 className="section__title">{currentCategory?.label}</h1>
                        <p className="products-count">{filteredProducts.length} piezas encontradas</p>
                    </header>

                    <div className="products-grid-mafia">
                        {filteredProducts.map(product => (
                            /* TARJETA CLICKABLE QUE LLEVA AL DETALLE */
                            <Link
                                key={product.id}
                                to={`/producto/${product.id}`}
                                className={`product-card-mafia ${product.stock === 0 ? 'out-of-stock-card' : ''}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {product.stock === 0 ? (
                                    <span className="product-badge out-of-stock">Agotado</span>
                                ) : (
                                    product.is_featured && <span className="product-badge">Top Ventas</span>
                                )}

                                <div className="product-image-container-mafia">
                                    <span className="emoji-display">{currentCategory?.icon}</span>
                                    {product.stock === 0 && <div className="out-of-stock-overlay-mafia">Sin Disponibilidad</div>}
                                </div>

                                <div className="product-info-mafia">
                                    <p className="product-tag-mafia">{product.material || 'Artesanal'}</p>
                                    <h4 className="product-name-mafia">{product.name}</h4>
                                    <p className="product-price-mafia">${Number(product.price).toLocaleString()}</p>

                                    <button
                                        className={`btn-add-mafia ${product.stock === 0 ? 'btn-disabled' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault(); // Evita que el clic en el botón active el Link de la tarjeta
                                            if (product.stock > 0) addToCart(product);
                                        }}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock === 0 ? 'Sin Stock' : 'Ver Detalles'}
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}