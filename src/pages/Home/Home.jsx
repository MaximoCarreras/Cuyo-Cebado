import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
// IMPORTAMOS LA IMAGEN DESDE ASSETS
import heroImg from '../../assets/fondo_hero_principal.jpg';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Filtramos para mostrar los Kits de Regalo Prensado
    const bestSellers = products.filter(p => p.type === 'Prensado').slice(0, 4);

    return (
        <div className="home-container">
            {/* 1. HERO CON EFECTO CURVO Y SPOTLIGHT */}
            <section className="hero-mafia">
                <div className="hero-mafia__content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            MATES CON <br />
                            <span>IDENTIDAD</span>
                        </h1>
                        <p className="hero-subtitle">
                            Curaduría premium de mates imperiales tallados a mano en Mendoza.
                            Una pieza de arte en cada cebada.
                        </p>
                        <div className="hero-actions">
                            <Link to="/productos" className="btn-gold">Ver Catálogo</Link>
                            <a href="https://wa.me/tu-numero" target="_blank" rel="noreferrer" className="btn-outline">
                                Consultanos por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: LA IMAGEN CON EL MÁSCARA CURVA */}
                <div className="hero-visual">
                    <div className="spotlight-overlay"></div>
                    <img src={heroImg} alt="Mate Cuyo Cebado" className="hero-main-img" />
                </div>
            </section>

            {/* 2. CATEGORÍAS (Grilla 2 columnas en móvil) */}
            <section className="categories-section">
                <h2 className="home-section-title">Nuestras Colecciones</h2>
                <div className="categories-grid-mza">
                    {categories.map((cat) => (
                        <Link key={cat.id} to={`/productos/${cat.id}`} className="category-card-mafia">
                            <div className="cat-icon">{cat.icon}</div>
                            <div className="cat-info">
                                <h3>{cat.label}</h3>
                                <span>Explorar colección</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. LO MÁS VENDIDO - KIT DE REGALO */}
            <section className="best-sellers-home">
                <header className="best-sellers-header">
                    <h2 className="home-section-title">Lo más vendido</h2>
                    <p className="gold-subtitle-tag">KIT DE REGALO PRENSADO</p>
                    <div className="separator-gold"></div>
                </header>

                <div className="products-grid-premium">
                    {bestSellers.map((product) => (
                        <div key={product.id} className="product-card-white">
                            <div className="card-img-container">
                                <span className="card-emoji-bg">🎁</span>
                            </div>
                            <div className="card-body-premium">
                                <p className="card-brand-tag">{product.brand || 'Cuyo Cebado'}</p>
                                <h4 className="card-product-name">{product.name}</h4>
                                <p className="card-product-price">${product.price.toLocaleString()}</p>
                                <button className="btn-add-mafia" onClick={() => addToCart(product)}>
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* WHATSAPP FLOAT */}
            <a href="https://wa.me/tu-numero" className="whatsapp-float-btn" target="_blank" rel="noreferrer">
                <span className="material-symbols-outlined">chat</span>
            </a>
        </div>
    );
}