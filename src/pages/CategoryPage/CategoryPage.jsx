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

    // ESTADOS DE FILTROS
    const [maxPrice, setMaxPrice] = useState(250000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');
    const [selectedType, setSelectedType] = useState('todos');

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
        // Reset de filtros al cambiar de categoría para evitar conflictos
        setSelectedMaterial('todos');
        setSelectedType('todos');
    }, [categoryId]);

    // FILTRADO DINÁMICO
    const filteredProducts = useMemo(() => {
        return dbProducts.filter(p => {
            const matchCategory = p.category === categoryId;
            const matchPrice = p.price <= maxPrice;
            const matchMaterial = selectedMaterial === 'todos' || p.material === selectedMaterial;
            const matchType = selectedType === 'todos' || p.type === selectedType;
            return matchCategory && matchPrice && matchMaterial && matchType;
        });
    }, [dbProducts, categoryId, maxPrice, selectedMaterial, selectedType]);

    // OBTENER OPCIONES DE FILTROS DESDE LA DB
    const getOptions = (key) => {
        const itemsInCategory = dbProducts.filter(p => p.category === categoryId);
        const uniqueValues = [...new Set(itemsInCategory.map(p => p[key]).filter(Boolean))];
        return ['todos', ...uniqueValues];
    };

    // ETIQUETA DINÁMICA DEL FILTRO
    const getTypeLabel = () => {
        if (categoryId === 'yerbas') return 'Variedad';
        if (categoryId === 'bombillas') return 'Estilo';
        return 'Modelo';
    };

    // AGREGAR AL CARRITO SIN NAVEGAR
    const handleQuickAdd = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    if (loading) return <div className="loading-view-mafia">🧉 Preparando el catálogo de Cuyo...</div>;

    return (
        <div className="category-page">
            <div className="category-page__nav">
                <Link to="/productos" className="btn-back">
                    <span className="material-symbols-outlined">arrow_back</span> Volver a categorías
                </Link>
            </div>

            <div className="category-page__main">
                {/* BARRA LATERAL DE FILTROS */}
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
                            className="price-slider-mafia"
                        />
                    </div>

                    {getOptions('material').length > 1 && (
                        <div className="filter-group">
                            <label>Material</label>
                            <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
                                {getOptions('material').map(o => (
                                    <option key={o} value={o}>{o === 'todos' ? 'TODOS' : o.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {getOptions('type').length > 1 && (
                        <div className="filter-group">
                            <label>{getTypeLabel()}</label>
                            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                {getOptions('type').map(o => (
                                    <option key={o} value={o}>{o === 'todos' ? 'TODOS' : o.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <section className="products-content">
                    <header className="category-header">
                        <h1 className="section__title">{currentCategory?.label}</h1>
                        <p className="products-count">{filteredProducts.length} piezas encontradas</p>
                    </header>

                    <div className="products-grid-mafia">
                        {filteredProducts.map(product => (
                            <Link key={product.id} to={`/producto/${product.id}`} className="product-card-link-mafia">
                                <div className={`product-card-mafia ${product.stock === 0 ? 'out-of-stock-card' : ''}`}>
                                    {/* BADGES */}
                                    {product.stock === 0 ? (
                                        <span className="product-badge out-of-stock">Próximo Ingreso</span>
                                    ) : (
                                        product.is_featured && <span className="product-badge">Top Ventas</span>
                                    )}

                                    <div className="product-image-container-mafia">
                                        <span className="emoji-display">{currentCategory?.icon}</span>
                                        {product.stock === 0 && <div className="out-of-stock-overlay-mafia">Próximamente</div>}
                                    </div>

                                    <div className="product-info-mafia">
                                        <p className="product-tag-mafia">
                                            {product.type} {product.material ? `| ${product.material}` : ''}
                                        </p>
                                        <h4 className="product-name-mafia">{product.name}</h4>
                                        <p className="product-price-mafia">${Number(product.price).toLocaleString()}</p>

                                        {/* BOTÓN DE ACCIÓN RÁPIDA */}
                                        <button
                                            className={`btn-add-mafia ${product.stock === 0 ? 'btn-disabled' : ''}`}
                                            disabled={product.stock === 0}
                                            onClick={(e) => handleQuickAdd(e, product)}
                                        >
                                            {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="no-results-mafia">
                            <span className="material-symbols-outlined">search_off</span>
                            <p>No encontramos productos con esos filtros.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}