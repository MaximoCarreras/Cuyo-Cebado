import { Link } from 'react-router-dom';
import { categories } from '../../data/products';
import './Home.css';

export default function Home() {
    return (
        <div className="home">
            {/* SECCIÓN HERO - PORTADA */}
            <section className="hero">
                <div className="hero__content">
                    <h1 className="hero__title">
                        MATES CON <br />
                        <span>IDENTIDAD</span>
                    </h1>
                    <p className="hero__description">
                        Curaduría premium de mates imperiales tallados a mano en Mendoza.
                        Una pieza de arte en cada cebada.
                    </p>
                    <div className="home__cta-container">
                        <Link to="/productos" className="btn-primary">Ver Catálogo</Link>
                        <a href="https://wa.me/tu-numero" target="_blank" rel="noreferrer" className="btn-secondary">
                            Consultanos por WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* SECCIÓN CATEGORÍAS - LA GRILLA QUE TE GUSTÓ */}
            <section className="home-categories">
                <h2 className="section__title">Encontrá tu compañero ideal</h2>
                <div className="products-grid">
                    {categories.map((cat) => (
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

            {/* BOTÓN FLOTANTE WHATSAPP (Asegurate de tener el CSS en App.css) */}
            <a href="https://wa.me/tu-numero" className="whatsapp-float" target="_blank" rel="noreferrer">
                <span className="material-symbols-outlined">chat</span>
            </a>
        </div>
    );
}