import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import './CategoryPage.css';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();
    const [dbProducts, setDbProducts] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState(250000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');
    const [selectedType, setSelectedType] = useState('todos');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: pData, error: pError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', categoryId);
                if (pError) throw pError;
                setDbProducts(pData || []);

                const { data: cData } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('id', categoryId)
                    .single();
                if (cData) setCurrentCategory(cData);
            } catch (error) {
                console.error("Error en CategoryPage:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        setSelectedMaterial('todos');
        setSelectedType('todos');
    }, [categoryId]);

    const filteredProducts = useMemo(() => {
        return dbProducts.filter(p => {
            const matchPrice = p.price <= maxPrice;
            const matchMaterial = selectedMaterial === 'todos' || p.material === selectedMaterial;
            const matchType = selectedType === 'todos' || p.type === selectedType;
            return matchPrice && matchMaterial && matchType;
        });
    }, [dbProducts, maxPrice, selectedMaterial, selectedType]);

    const getOptions = (key) => {
        const uniqueValues = [...new Set(dbProducts.map(p => p[key]).filter(Boolean))];
        return ['todos', ...uniqueValues];
    };

    const getTypeLabel = () => {
        if (categoryId === 'yerbas') return 'Variedad';
        if (categoryId === 'bombillas') return 'Estilo';
        return 'Modelo';
    };

    const handleQuickAdd = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    if (loading) return <div className="loading-view-mafia">🧉 Preparando la estantería...</div>;

    return (
        <div className="category-page">
            <div className="category-page__nav">
                <Link to="/productos" className="btn-back">
                    <span className="material-symbols-outlined">arrow_back</span> Volver a categorías
                </Link>
            </div>
            <div className="category-page__main">
                <aside className="sidebar-mafia">
                    <div className="sidebar__title">
                        <h3>Filtros</h3>
                        <div className="gold-dot"></div>
                    </div>
                    <div className="filter-group">
                        <label>Precio máximo: <b>${maxPrice.toLocaleString('es-AR')}</b></label>
                        <input type="range" min="0" max="250000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="price-slider-mafia" />
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
                            <label>{getTypeLabel()}</label>
                            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                {getOptions('type').map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                            </select>
                        </div>
                    )}
                </aside>

                <section className="products-content">
                    <header className="category-header">
                        <h1 className="section__title">{currentCategory ? currentCategory.label : 'Productos'}</h1>
                        <p className="products-count">{filteredProducts.length} piezas encontradas</p>
                    </header>
// ... (mantiene exactamente igual toda tu lógica de filtros y useEffects)
// Asegúrate de que el renderizado de la tarjeta tenga esta estructura:

<div className="products-grid-mafia">
    {filteredProducts.map(product => (
        <Link key={product.id} to={`/producto/${product.slug}`} className="product-card-link-mafia">
            <div className="product-card-mafia">
                
                {product.is_featured && <span className="product-badge">Top Ventas</span>}

                <div className="product-image-container-mafia">
                    <img src={product.image_url || '/assets/placeholder.png'} alt={product.name} />
                </div>

                <div className="product-info-mafia">
                    <p className="product-tag-mafia">{product.type} {product.material ? `| ${product.material}` : ''}</p>
                    <h4 className="product-name-mafia">{product.name}</h4>
                    <p className="product-price-mafia">${Number(product.price).toLocaleString('es-AR')}</p>
                    <button className={`btn-add-mafia ${product.stock === 0 ? 'btn-disabled' : ''}`} disabled={product.stock === 0} onClick={(e) => handleQuickAdd(e, product)}>
                        {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        </Link>
    ))}
</div>