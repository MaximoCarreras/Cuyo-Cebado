import { categories } from '../../data/products';
import { Link } from 'react-router-dom';
import './ProductsPage.css';

export default function ProductsPage() {
    return (
        <div className="products-view">
            <h2 className="section__title">¿Qué estás buscando hoy?</h2>
            <div className="category-grid">
                {categories.map(cat => (
                    <Link
                        key={cat.id}
                        to={`/productos/${cat.id}`}
                        className="category-card"
                    >
                        <span className="category-icon">{cat.icon}</span>
                        <h3>{cat.label}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}