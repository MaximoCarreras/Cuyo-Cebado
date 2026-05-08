import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { products, categories } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './CategoryPage.css';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();

    const [maxPrice, setMaxPrice] = useState(150000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');
    const [selectedType, setSelectedType] = useState('todos');
    const [selectedBrand, setSelectedBrand] = useState('todos');
    const [selectedCapacity, setSelectedCapacity] = useState('todos');

    const currentCategory = categories.find(cat => cat.id === categoryId);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchCategory = p.category === categoryId;
            const matchPrice = p.price <= maxPrice;
            const matchMaterial = selectedMaterial === 'todos' || p.material === selectedMaterial;
            const matchType = selectedType === 'todos' || p.type === selectedType;
            const matchBrand = selectedBrand === 'todos' || p.brand === selectedBrand;
            const matchCapacity = selectedCapacity === 'todos' || p.capacity === selectedCapacity;
            return matchCategory && matchPrice && matchMaterial && matchType && matchBrand && matchCapacity;
        });
    }, [categoryId, maxPrice, selectedMaterial, selectedType, selectedBrand, selectedCapacity]);

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
                        <input type="range" min="0" max="150000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                    </div>

                    {/* Filtros dinámicos según categoría */}
                    {(getOptions('brand').length > 1) && (
                        <div className="filter-group">
                            <label>Marca / Fabricante</label>
                            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                                {getOptions('brand').map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                            </select>
                        </div>
                    )}

                    {(getOptions('material').length > 1) && (
                        <div className="filter-group">
                            <label>Material de fabricación</label>
                            <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
                                {getOptions('material').map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                            </select>
                        </div>
                    )}

                    {(getOptions('type').length > 1) && (
                        <div className="filter-group">
                            <label>{categoryId === 'yerbas' ? 'Tipo de Molienda' : 'Modelo / Estilo'}</label>
                            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                {getOptions('type').map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                            </select>
                        </div>
                    )}

                    {(getOptions('capacity').length > 1) && (
                        <div className="filter-group">
                            <label>Capacidad / Tamaño</label>
                            <select value={selectedCapacity} onChange={(e) => setSelectedCapacity(e.target.value)}>
                                {getOptions('capacity').map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                            </select>
                        </div>
                    )}
                </aside>

                <section className="products-content">
                    <header className="category-header">
                        <h1>{currentCategory?.label} {currentCategory?.icon}</h1>
                        <p>{filteredProducts.length} productos exclusivos encontrados</p>
                    </header>

                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                {product.bestSeller && <span className="product-badge">Top Ventas</span>}
                                <div className="product-image"><span>{currentCategory?.icon}</span></div>
                                <div className="product-info">
                                    <p className="product-material">{product.brand || product.material}</p>
                                    <h4>{product.name}</h4>
                                    <p className="product-price">${product.price.toLocaleString()}</p>
                                    <button className="btn-add" onClick={() => addToCart(product)}>Agregar al Carrito</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}