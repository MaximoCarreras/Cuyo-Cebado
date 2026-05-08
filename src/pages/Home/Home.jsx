import { Link } from 'react-router-dom';
import { categories } from '../../data/products';
import './Home.css';

export default function Home() {
    return (
        <div className="home">
            {/* ... (Tu componente Hero/Portada aquí) ... */}

            <section className="home-categories">
                <h2 className="section__title">Encontrá tu compañero ideal</h2>

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
            </section>

            {/* ... (Otras secciones como "Más vendidos" o "Newsletter") ... */}
        </div>
    );
}