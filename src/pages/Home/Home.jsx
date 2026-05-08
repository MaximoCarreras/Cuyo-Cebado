import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Filtramos para mostrar solo los Kits de Regalo Prensado (Lo más vendido)
    const bestSellers = products.filter(p => p.type === 'Prensado').slice(0, 4);

    return (
        <div className="home-mendoza">
            {/* 1. HERO SPOTLIGHT - Texto Izq, Imagen/Círculo Der */}
            <section className="hero-mafia">
                <div className="hero-mafia__container">

                    <div className="hero-mafia__left">
                        <h1 className="hero-mza-title">
                            MATES CON <br />
                            <span>IDENTIDAD</span>
                        </h1>
                        <p className="hero-mza-subtitle">
                            Curaduría premium de mates imperiales tallados a mano en Mendoza.
                            Una pieza de arte en cada cebada.
                        </p>
                        <div className="hero-mza-cta">
                            <Link to="/productos" className="btn-gold-mafia">Ver Catálogo</Link>
                            <a href="https://wa.me/tu-numero" target="_blank" rel="noreferrer" className="btn-outline-mafia">
                                Consultanos
                            </a>
                        </div>
                    </div>

                    <div className="hero-mafia__right">
                        {/* EL CÍRCULO SPOTLIGHT Y LA IMAGEN ESPECÍFICA */}
                        <div className="mafia-spotlight-circle">
                            <img src="/fondo_hero_principal.jpg" alt="Mate Imperial Premium" className="mafia-hero-img" />
                        </div>
                    </div>

                </div>
            </section>

            {/* 2. CATEGORÍAS (La grilla que te encantó, centrada) */}
            <section className="mza-categories">
                <h2 className="title-mza-section">Nuestras Colecciones</h2>

                {/* GRILLA QUE SE CLAVA EN 2 COLUMNAS EN MÓVIL */}
                <div className="grid-mza-categories">
                    {categories.map((cat) => (
                        <Link key={cat.id} to={`/productos/${cat.id}`} className="card-mza-category">
                            <div className="card-mza-icon">{cat.icon}</div>
                            <div className="card-mza-body">
                                <h3>{cat.label}</h3>
                                <span>Explorar</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. LO MÁS VENDIDO - KIT DE REGALO PRENSADO */}
            <section className="mza-best-sellers">
                <header className="best-mza-header">
                    <h2 className="title-mza-section">Lo más vendido</h2>
                    <p className="subtitle-mza-tag">KIT DE REGALO PRENSADO</p>
                    <div className="mza-gold-separator"></div>
                </header>

                <div className="grid-mza-products">
                    {bestSellers.map((product) => (
                        <div key={product.id} className="card-mza-product">
                            <div className="img-mza-holder">
                                <span className="icon-mza-bg">🎁</span>
                            </div>
                            <div className="info-mza-holder">
                                <p className="tag-mza-brand">{product.brand || 'Cuyo Cebado'}</p>
                                <h4 className="product-mza-title">{product.name}</h4>
                                <p className="product-mza-price">${product.price.toLocaleString()}</p>
                                <button className="btn-mza-buy" onClick={() => addToCart(product)}>
                                    Añadir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* WHATSAPP FLOAT (CSS en App.css) */}
            <a href="https://wa.me/tu-numero" className="whatsapp-float" target="_blank" rel="noreferrer">
                <span className="material-symbols-outlined">chat</span>
            </a>
        </div>
    );
}