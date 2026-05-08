import { Link } from 'react-router-dom';
import { categories } from '../../data/products';
import './ProductsPage.css';

export default function ProductsPage() {
    return (
        <div className="products-page">
            {/* Título principal alineado */}
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