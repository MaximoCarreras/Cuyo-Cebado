import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; // Conexión oficial
import { categories } from '../../data/products'; // Tus categorías fijas
import './ProductsPage.css';

export default function ProductsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('search');

        if (query) {
            setIsSearching(true);
            const fetchSearch = async () => {
                setLoading(true);
                try {
                    // Buscamos DIRECTO en nuestra base de datos de Supabase
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    // Filtramos por lo que escribió el cliente
                    const filtered = data.filter(p =>
                        p.name.toLowerCase().includes(query.toLowerCase()) ||
                        p.category.toLowerCase().includes(query.toLowerCase()) ||
                        (p.material && p.material.toLowerCase().includes(query.toLowerCase()))
                    );

                    setSearchResults(filtered);
                } catch (error) {
                    console.error("Error buscando en Supabase:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSearch();
        } else {
            setIsSearching(false);
        }
    }, [location.search]);

    // --- VISTA DE BÚSQUEDA ---
    if (isSearching) {
        return (
            <div className="products-page">
                <h1 className="products-page__title">Resultados de búsqueda</h1>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link to="/productos" className="btn-back-shop">Ver todo el catálogo</Link>
                </div>

                {loading ? (
                    <div className="catalog-loading">Buscando en la estancia...</div>
                ) : (
                    <div className="catalog-grid-premium">
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                                /* ACÁ ESTÁ LA MAGIA: usamos product.slug para que coincida con App.jsx */
                                <Link key={product.id} to={`/producto/${product.slug}`} className="catalog-card-premium">
                                    <div className="catalog-image-wrapper">
                                        {product.badge && <span className="catalog-badge">{product.badge}</span>}
                                        {product.stock <= 0 && <span className="catalog-out-of-stock">Sin Stock</span>}
                                        {/* FOTO REAL DEL PRODUCTO */}
                                        <img
                                            src={product.image_url || '/assets/placeholder.png'}
                                            alt={product.name}
                                            className="catalog-image"
                                        />
                                    </div>
                                    <div className="catalog-info-premium">
                                        <span className="catalog-category">{product.category}</span>
                                        <h3 className="catalog-title">{product.name}</h3>
                                        <div className="catalog-price-row">
                                            <span className="catalog-price">${product.price.toLocaleString('es-AR')}</span>
                                            <button className="btn-quick-view">Ver más</button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="no-results-container">
                                <span className="material-symbols-outlined icon-sad">search_off</span>
                                <p className="no-results">No encontramos productos para tu búsqueda.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // --- VISTA NORMAL (TUS CATEGORÍAS) ---
    return (
        <div className="products-page">
            <h1 className="products-page__title">¿Qué estás buscando hoy?</h1>
            <div className="products-grid">
                {categories.map(cat => (
                    <Link key={cat.id} to={`/productos/${cat.id}`} className="product-category-card">
                        <div className="category-card__icon">{cat.icon}</div>
                        <div className="category-card__info">
                            <h3>{cat.label}</h3>
                            <span>Explorar colección</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}