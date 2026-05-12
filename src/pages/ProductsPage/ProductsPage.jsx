import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../../data/products';
import './ProductsPage.css';

export default function ProductsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('search');

        if (query) {
            setIsSearching(true);
            const fetchSearch = async () => {
                try {
                    const API_URL = import.meta.env.VITE_API_URL || 'https://cuyo-cebado.onrender.com';
                    const response = await fetch(`${API_URL}/api/products`);
                    const data = await response.json();

                    const filtered = data.filter(p =>
                        p.name.toLowerCase().includes(query.toLowerCase()) ||
                        p.category.toLowerCase().includes(query.toLowerCase()) ||
                        p.material?.toLowerCase().includes(query.toLowerCase())
                    );
                    setSearchResults(filtered);
                } catch (error) {
                    console.error("Error buscando:", error);
                }
            };
            fetchSearch();
        } else {
            setIsSearching(false);
        }
    }, [location.search]);

    if (isSearching) {
        return (
            <div className="products-page">
                <h1 className="products-page__title">Resultados de búsqueda</h1>
                <Link to="/productos" className="btn-back-shop">Ver todas las categorías</Link>
                <div className="products-grid-mafia">
                    {searchResults.length > 0 ? (
                        searchResults.map(product => (
                            <Link key={product.id} to={`/producto/${product.id}`} className="product-card-mafia">
                                <div className="product-image-container-mafia">
                                    <span className="emoji-display">🧉</span>
                                </div>
                                <div className="product-info-mafia">
                                    <p className="product-tag-mafia">{product.material}</p>
                                    <h4 className="product-name-mafia">{product.name}</h4>
                                    <p className="product-price-mafia">${Number(product.price).toLocaleString()}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="no-results">No encontramos productos que coincidan con tu búsqueda.</p>
                    )}
                </div>
            </div>
        );
    }

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