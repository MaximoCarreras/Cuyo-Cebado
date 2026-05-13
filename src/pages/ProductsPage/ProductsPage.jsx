import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './ProductsPage.css';

export default function ProductsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchPageData = async () => {
            const params = new URLSearchParams(location.search);
            const query = params.get('search');
            setLoading(true);

            if (query) {
                setIsSearching(true);
                try {
                    const { data } = await supabase
                        .from('products')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (data) {
                        const filtered = data.filter(p =>
                            p.name.toLowerCase().includes(query.toLowerCase()) ||
                            p.category.toLowerCase().includes(query.toLowerCase()) ||
                            (p.material && p.material.toLowerCase().includes(query.toLowerCase()))
                        );
                        setSearchResults(filtered);
                    }
                } catch (error) {
                    console.error("Error buscando:", error);
                }
            } else {
                setIsSearching(false);
                try {
                    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
                    if (data) setDbCategories(data);
                } catch (error) {
                    console.error("Error cargando categorías:", error);
                }
            }
            setLoading(false);
        };
        fetchPageData();
    }, [location.search]);

    if (loading) return <div className="catalog-loading">Preparando el catálogo...</div>;

    if (isSearching) {
        return (
            <div className="products-page">
                <h1 className="products-page__title">Resultados de búsqueda</h1>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link to="/productos" className="btn-back-shop">Ver todo el catálogo</Link>
                </div>
                <div className="catalog-grid-premium">
                    {searchResults.length > 0 ? (
                        searchResults.map(product => (
                            <Link key={product.id} to={`/producto/${product.slug}`} className="catalog-card-premium">
                                <div className="catalog-image-wrapper">
                                    {product.badge && <span className="catalog-badge">{product.badge}</span>}
                                    {product.stock <= 0 && <span className="catalog-out-of-stock">Sin Stock</span>}
                                    <img src={product.image_url || '/assets/placeholder.png'} alt={product.name} className="catalog-image" />
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
            </div>
        );
    }

    return (
        <div className="products-page">
            <h1 className="products-page__title">¿Qué estás buscando hoy?</h1>
            <div className="products-grid">
                {dbCategories.map(cat => (
                    <Link key={cat.id} to={`/productos/${cat.id}`} className="product-category-card">
                        {/* LÓGICA DE FOTO O EMOJI ACTUALIZADA */}
                        <div className="category-card__icon" style={{ display: 'flex', justifyContent: 'center' }}>
                            {cat.image_url ? (
                                <img
                                    src={cat.image_url}
                                    alt={cat.label}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', marginBottom: '15px' }}
                                />
                            ) : (
                                cat.icon
                            )}
                        </div>
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