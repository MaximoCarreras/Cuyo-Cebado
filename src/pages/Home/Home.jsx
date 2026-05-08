import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
// IMPORTANTE: Importamos el PNG desde assets
import heroImg from '../../assets/fondo_hero_principal.png';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Filtramos para la sección de Kit de Regalo Prensado (Lo más vendido)
    const bestSellers = products.filter(p => p.type === 'Prensado').slice(0, 4);

    return (
        <div className="home-main">
            {/* 1. SECCIÓN HERO: Texto a la Izquierda / Imagen Curva a la Derecha */}
            <section className="hero-mafia">
                <div className="hero-mafia__content">
                    <div className="hero-text-block">
                        <h1 className="hero-title">
                            MATES CON <br />
                            <span>IDENTIDAD</span>
                        </h1>
                        <p className="hero-subtitle">
                            Curaduría premium de mates imperiales tallados a mano en Mendoza.
                            Una pieza de arte en cada cebada.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/productos" className="btn-gold-mafia">Ver Catálogo</Link>
                            <a href="https://wa.me/tu-numero" target="_blank" rel="noreferrer" className="btn-outline-mafia">
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: LA IMAGEN CON EL SPOTLIGHT Y CORTE CURVO */}
                <div className="hero-visual-block">
                    <div className="spotlight-overlay"></div>
                    <img src={heroImg} alt="Mate Cuyo Cebado" className="hero-main-image" />
                </div>
            </section>

            {/* 2. CATEGORÍAS (Grilla de 2 columnas en móvil) */}
            <section className="home-categories-section">
                <h2 className="global-section-title">Nuestras Colecciones</h2>
                <div className="categories-grid-premium">
                    {categories.map((cat) => (
                        <Link key={cat.id} to={`/productos/${cat.id}`} className="card-cat-dark">
                            <div className="cat-icon-display">{cat.icon}</div>
                            <div className="cat-text-display">
                                <h3>{cat.label}</h3>
                                <span>Explorar colección</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. LO MÁS VENDIDO - KIT DE REGALO PRENSADO */}
            <section className="home-best-sellers">
                <header className="best-sellers-header">
                    <h2 className="global-section-title">Lo más vendido</h2>
                    <p className="gold-subtitle">KIT DE REGALO PRENSADO</p>
                    <div className="gold-line-separator"></div>
                </header>

                <div className="products-grid-meli-style">
                    {bestSellers.map((product) => (
                        <div key={product.id} className="product-card-white-boutique">
                            <div className="product-img-wrapper">
                                <span className="emoji-bg-display">🎁</span>
                            </div>
                            <div className="product-info-wrapper">
                                <p className="product-brand-tag">{product.brand || 'Cuyo Cebado'}</p>
                                <h4 className="product-name-text">{product.name}</h4>
                                <p className="product-price-val">${product.price.toLocaleString()}</p>
                                <button className="btn-add-to-cart-mafia" onClick={() => addToCart(product)}>
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* BOTÓN WHATSAPP */}
            <a href="https://wa.me/tu-numero" className="whatsapp-float-fixed" target="_blank" rel="noreferrer">
                <span className="material-symbols-outlined">chat</span>
            </a>
        </div>
    );
}