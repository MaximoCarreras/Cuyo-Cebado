import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { products, categories } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './CategoryPage.css';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();

    const [maxPrice, setMaxPrice] = useState(250000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');
    const [selectedType, setSelectedType] = useState('todos');

    const currentCategory = categories.find(cat => cat.id === categoryId);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchCategory = p.category === categoryId;
            const matchPrice = p.price <= maxPrice;
            const matchMaterial = selectedMaterial === 'todos' || p.material === selectedMaterial;
            const matchType = selectedType === 'todos' || p.type === selectedType;
            return matchCategory && matchPrice && matchMaterial && matchType;
        });
    }, [categoryId, maxPrice, selectedMaterial, selectedType]);

    const getOptions = (key) => {
        const items = products.filter(p => p.category === categoryId);
        return ['todos', ...new Set(items.map(p => p[key]).filter(Boolean))];
    };

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
                        <input type="range" min="0" max="250000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
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

                    <div className="products-grid-meli">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card-premium">
                                <div className="product-image-container">
                                    <span className="category-icon-bg">{currentCategory?.icon}</span>
                                </div>
                                <div className="product-details">
                                    <p className="details-material">{product.material}</p>
                                    <h4 className="details-name">{product.name}</h4>
                                    <p className="details-price">${product.price.toLocaleString()}</p>
                                    <button className="btn-add-cart" onClick={() => addToCart(product)}>
                                        Añadir
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