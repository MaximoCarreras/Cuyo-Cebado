import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Filtramos los kits para la sección de abajo
    const bestSellers = products.filter(p => p.type === 'Prensado').slice(0, 4);

    return (
        <div className="home-container">
            {/* SECCIÓN HERO CON SPOTLIGHT */}
            <section className="hero-section">
                <div className="hero-content-wrapper">

                    <div className="hero-text-side">
                        <h1 className="main-title">
                            MATES CON <br />
                            <span>IDENTIDAD</span>
                        </h1>
                        <p className="main-subtitle">
                            Curaduría premium de mates imperiales tallados a mano en Mendoza.
                        </p>
                        <div className="main-actions">
                            <Link to="/productos" className="btn-gold">Ver Catálogo</Link>
                            <a href="https://wa.me/tu-numero" className="btn-outline">WhatsApp</a>
                        </div>
                    </div>

                    <div className="hero-visual-side">
                        {/* ESTE ES EL CIRCULO SPOTLIGHT */}
                        <div className="spotlight-effect">
                            <img
                                src="/fondo_hero_principal.jpg"
                                alt="Mate Imperial"
                                className="img-hero-principal"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* CATEGORÍAS (Grilla 2 columnas en móvil) */}
            <section className="categories-section">
                <h2 className="title-section">Nuestras Colecciones</h2>
                <div className="grid-categories">
                    {categories.map((cat) => (
                        <Link key={cat.id} to={`/productos/${cat.id}`} className="card-category-dark">
                            <div className="card-icon">{cat.icon}</div>
                            <div className="card-body">
                                <h3>{cat.label}</h3>
                                <span>Explorar</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* LO MÁS VENDIDO */}
            <section className="best-sellers-section">
                <header className="best-header">
                    <h2 className="title-section">Lo más vendido</h2>
                    <p className="gold-tag">KIT DE REGALO PRENSADO</p>
                </header>

                <div className="grid-products-premium">
                    {bestSellers.map((product) => (
                        <div key={product.id} className="card-product-white">
                            <div className="img-holder">
                                <span className="icon-bg">🎁</span>
                            </div>
                            <div className="info-holder">
                                <p className="tag-brand">{product.brand || 'Cuyo Cebado'}</p>
                                <h4 className="product-title">{product.name}</h4>
                                <p className="product-price">${product.price.toLocaleString()}</p>
                                <button className="btn-buy" onClick={() => addToCart(product)}>
                                    Añadir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}