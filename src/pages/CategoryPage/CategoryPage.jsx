import { useParams, Link } from 'react-router-dom'; // Link agregado aquí
import { useState, useMemo } from 'react';
import { products, categories } from '../../data/products';
import './CategoryPage.css';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const [maxPrice, setMaxPrice] = useState(150000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');

    const currentCategory = categories.find(cat => cat.id === categoryId);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchCategory = p.category === categoryId;
            const matchPrice = p.price <= maxPrice;
            const matchMaterial = selectedMaterial === 'todos' || p.material === selectedMaterial;
            return matchCategory && matchPrice && matchMaterial;
        });
    }, [categoryId, maxPrice, selectedMaterial]);

    const materials = ['todos', ...new Set(products.filter(p => p.category === categoryId).map(p => p.material).filter(Boolean))];

    return (
        <div className="category-page">
            <aside className="sidebar">
                <h3>Filtros</h3>

                <div className="filter-group">
                    <label>Precio máximo: <b>${maxPrice.toLocaleString()}</b></label>
                    <input
                        type="range"
                        min="0"
                        max="150000"
                        step="1000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Material</label>
                    <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
                        {materials.map(m => (
                            <option key={m} value={m}>{m.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </aside>

            <section className="products-content">
                {/* BOTÓN VOLVER ELEGANTE */}
                <Link to="/productos" className="btn-back">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver a categorías
                </Link>

                <header className="category-header">
                    <h1>{currentCategory?.label} {currentCategory?.icon}</h1>
                    <p>{filteredProducts.length} productos encontrados</p>
                </header>

                <div className="products-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                {product.bestSeller && <span className="badge">Destacado</span>}
                                <div className="product-image">
                                    <div className="placeholder-img">📦</div>
                                </div>
                                <div className="product-info">
                                    <h4>{product.name}</h4>
                                    <p className="product-material">{product.material}</p>
                                    <p className="product-price">${product.price.toLocaleString()}</p>
                                    <button className="btn-add">Agregar al Carrito</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-products">
                            <p>No hay productos que coincidan con los filtros. 🧉</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}