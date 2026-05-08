import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { products, categories } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './CategoryPage.css';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();

    // Estados para los filtros
    const [maxPrice, setMaxPrice] = useState(250000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');
    const [selectedType, setSelectedType] = useState('todos');

    const currentCategory = categories.find(cat => cat.id === categoryId);

    // LÓGICA DE FILTRADO DINÁMICO
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchCategory = p.category === categoryId;
            const matchPrice = p.price <= maxPrice;
            const matchMaterial = selectedMaterial === 'todos' || p.material === selectedMaterial;
            const matchType = selectedType === 'todos' || p.type === selectedType;
            return matchCategory && matchPrice && matchMaterial && matchType;
        });
    }, [categoryId, maxPrice, selectedMaterial, selectedType]);

    // Generamos opciones de filtros únicas basadas en los productos actuales de esta categoría
    const materials = ['todos', ...new Set(products.filter(p => p.category === categoryId).map(p => p.material).filter(Boolean))];
    const types = ['todos', ...new Set(products.filter(p => p.category === categoryId).map(p => p.type).filter(Boolean))];

    return (
        <div className="category-page">
            {/* NAVEGACIÓN SUPERIOR */}
            <div className="category-page__nav">
                <Link to="/productos" className="btn-back">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver a categorías
                </Link>
            </div>

            <div className="category-page__main">
                {/* SIDEBAR DE CONTROL (MAFIA PREMIUM) */}
                <aside className="sidebar">
                    <div className="sidebar__header">
                        <h3>Filtros</h3>
                        <div className="gold-dot"></div>
                    </div>

                    {/* Filtro de Precio */}
                    <div className="filter-group">
                        <label>Presupuesto: <b>${maxPrice.toLocaleString()}</b></label>
                        <input
                            type="range"
                            min="0"
                            max="250000"
                            step="5000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                    </div>

                    {/* Filtro de Material (Dinámico) */}
                    <div className="filter-group">
                        <label>Material / Origen</label>
                        <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
                            {materials.map(m => (
                                <option key={m} value={m}>{m === 'todos' ? 'TODOS LOS MATERIALES' : m.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Tipo (Dinámico) */}
                    <div className="filter-group">
                        <label>Estilo / Marca</label>
                        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            {types.map(t => (
                                <option key={t} value={t}>{t === 'todos' ? 'TODOS LOS ESTILOS' : t.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sidebar__footer">
                        <p>Curaduría Cuyo Cebado © 2026</p>
                    </div>
                </aside>

                {/* GRILLA DE PRODUCTOS */}
                <section className="products-content">
                    <header className="category-header">
                        <div className="header-info">
                            <h1>{currentCategory?.label} {currentCategory?.icon}</h1>
                            <p>Mostrando {filteredProducts.length} tesoros encontrados</p>
                        </div>
                    </header>

                    <div className="products-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    {product.bestSeller && <span className="product-badge">Más buscado</span>}

                                    <div className="product-image">
                                        <span className="placeholder-icon">🧉</span>
                                        {/* <img src={product.image} alt={product.name} /> */}
                                    </div>

                                    <div className="product-info">
                                        <div className="product-tags">
                                            <span className="tag-type">{product.type}</span>
                                            <span className="tag-material">{product.material}</span>
                                        </div>
                                        <h4>{product.name}</h4>
                                        <p className="product-price">${product.price.toLocaleString()}</p>

                                        <button
                                            className="btn-add"
                                            onClick={() => addToCart(product)}
                                        >
                                            <span className="material-symbols-outlined">add_shopping_cart</span>
                                            Agregar al Carrito
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-products">
                                <span className="material-symbols-outlined">search_off</span>
                                <p>No encontramos productos con esos filtros. Probá ajustando el precio o el material.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}