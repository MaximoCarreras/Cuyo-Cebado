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
            {/* NAVEGACIÓN SUPERIOR (Donde hiciste el círculo rojo) */}
            <div className="category-page__nav">
                <Link to="/productos" className="btn-back">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver a categorías
                </Link>
            </div>

            <div className="category-page__main">
                {/* SIDEBAR IZQUIERDO */}
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
                                <option key(m) value = { m } > { m.toUpperCase() }</option>
              ))}
                    </select>
            </div>
        </aside>

        {/* CONTENIDO DE PRODUCTOS */ }
    <section className="products-content">
        <header className="category-header">
            <h1>{currentCategory?.label} {currentCategory?.icon}</h1>
            <p>{filteredProducts.length} productos encontrados en Mendoza</p>
        </header>

        <div className="products-grid">
            {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        {product.bestSeller && <span className="product-badge">Destacado</span>}

                        <div className="product-image">
                            <span>🧉</span>
                        </div>

                        <div className="product-info">
                            <p className="product-material">{product.material}</p>
                            <h4>{product.name}</h4>
                            <p className="product-price">${product.price.toLocaleString()}</p>

                            <button
                                className="btn-add"
                                onClick={() => addToCart(product)}
                            >
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-products">
                    <p>No hay productos que coincidan. 🧉</p>
                </div>
            )}
        </div>
    </section>
      </div >
    </div >
  );
}