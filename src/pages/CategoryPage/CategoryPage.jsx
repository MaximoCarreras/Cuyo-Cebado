import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import './CategoryPage.css';

// 🔥 TRUCO MÁGICO 1: CACHÉ GLOBAL DE LA CATEGORÍA
// Esto vive fuera del componente. Una vez que se descarga una categoría, 
// queda guardada acá y la próxima vez carga en 0 segundos.
const categoryCache = {};

export default function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();
    
    const [dbProducts, setDbProducts] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    
    // Si la categoría ya está en nuestro caché, loading arranca en false. ¡Magia!
    const [loading, setLoading] = useState(!categoryCache[categoryId]);
    
    const [maxPrice, setMaxPrice] = useState(250000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');
    const [selectedType, setSelectedType] = useState('todos');
    
    // Estado para el acordeón de filtros en celular
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // Si los datos ya están en memoria, los inyectamos al instante y cortamos la función acá.
            if (categoryCache[categoryId]) {
                setDbProducts(categoryCache[categoryId].products);
                setCurrentCategory(categoryCache[categoryId].category);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const { data: pData, error: pError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', categoryId);
                if (pError) throw pError;

                const { data: cData } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('id', categoryId)
                    .single();

                setDbProducts(pData || []);
                if (cData) setCurrentCategory(cData);

                // 🔥 GUARDAMOS EN CACHÉ PARA LA PRÓXIMA VEZ
                categoryCache[categoryId] = {
                    products: pData || [],
                    category: cData || null
                };

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

    // 🔥 TRUCO MÁGICO 2: ELIMINAMOS EL RETURN BLOQUEANTE
    // Ya no hacemos "if (loading) return <div>Cargando...</div>"
    // Dejamos que cargue la interfaz completa al instante siempre.

    return (
        <div className="category-page">
            <div className="category-page__nav">
                <Link to="/productos" className="btn-back">
                    <span className="material-symbols-outlined">arrow_back</span> Volver a categorías
                </Link>
            </div>
            <div className="category-page__main">
                <aside className="sidebar-mafia">
                    <div className="sidebar__title" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        <div className="title-left">
                            <h3>Filtros</h3>
                            <div className="gold-dot desktop-only-dot"></div>
                        </div>
                        <span className="material-symbols-outlined mobile-only-icon">
                            {isFilterOpen ? 'expand_less' : 'filter_list'}
                        </span>
                    </div>
                    
                    <div className={`filter-options-wrapper ${isFilterOpen ? 'open' : ''}`}>
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
                    </div>
                </aside>

                <section className="products-content">
                    <header className="category-header">
                        <h1 className="section__title">
                            {/* Mostramos el nombre de la categoría si lo tenemos, sino un genérico mientras carga */}
                            {currentCategory ? currentCategory.label : (loading ? 'Cargando...' : 'Productos')}
                        </h1>
                        <p className="products-count">
                            {loading ? 'Buscando catálogo...' : `${filteredProducts.length} piezas encontradas`}
                        </p>
                    </header>
                    
                    <div className="products-grid-mafia">
                        {/* 🔥 MOSTRADOR CONDICIONAL SUAVE */}
                        {loading ? (
                            <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', color: '#a5813a', fontWeight: '800', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <span className="material-symbols-outlined" style={{ animation: 'spin 2s linear infinite', fontSize: '2rem' }}>sync</span>
                                Trayendo catálogo...
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <Link key={product.id} to={`/producto/${product.slug}`} className="product-card-link-mafia">
                                    <div className={`product-card-mafia`}>
                                        
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
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#888' }}>
                                No encontramos productos con estos filtros.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}