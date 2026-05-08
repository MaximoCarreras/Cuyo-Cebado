import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);
    const mainCategories = categories.slice(0, 6);

    // Función para scroll suave a las categorías
    const scrollToCategories = () => {
        document.getElementById('categorias-home').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="home">
            {/* HERO SECTION RESTAURADO */}
            <section className="hero">
                <div className="hero__container">
                    <div className="hero__left-panel">
                        <div className="hero__text-content">
                            <h1>
                                MATES CON <br />
                                <span className="gold-text">IDENTIDAD</span>
                            </h1>
                            <p>
                                Curaduría premium de mates imperiales tallados a mano en Mendoza.
                                Una pieza de arte en cada cebada.
                            </p>
                            <div className="hero__actions">
                                <button onClick={scrollToCategories} className="btn-hero-solid">
                                    VER CATÁLOGO
                                </button>
                                <a
                                    href="https://wa.me/5492625597956?text=Hola!%20Quiero%20consultar%20por%20un%20mate%20premium"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-hero-outline"
                                >
                                    CONSULTAR POR WHATSAPP
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="hero__right-image">
                        {/* Esta imagen se maneja por CSS para el efecto de fondo */}
                    </div>
                </div>
            </section>

            {/* ENCONTRÁ TU COMPAÑERO IDEAL (Categorías) */}
            <section id="categorias-home" className="section__container">
                <div className="section__title">
                    <h2>Encontrá tu compañero ideal</h2>
                    <div className="gold-line"></div>
                </div>

                <div className="home-categories">
                    {mainCategories.map(cat => (
                        <Link key={cat.id} to={`/productos/${cat.id}`} className="home-category-card">
                            <span className="cat-icon">{cat.icon}</span>
                            <h3>{cat.label}</h3>
                            <p>Explorar</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* RESTO DE LA PÁGINA (Best Sellers y Promo) */}
            <section className="section__container bg-light">
                <div className="section__title">
                    <h2>Los Más Buscados</h2>
                    <div className="gold-line"></div>
                </div>
                <div className="home-products-grid">
                    {bestSellers.map(product => (
                        <div key={product.id} className="home-product-card">
                            <div className="product-card__image">
                                <span className="placeholder-icon">🧉</span>
                                <span className="badge-best">Destacado</span>
                            </div>
                            <div className="product-card__info">
                                <p className="product-tag">{product.type}</p>
                                <h4>{product.name}</h4>
                                <p className="product-price">${product.price.toLocaleString()}</p>
                                <button className="btn-add-home" onClick={() => addToCart(product)}>
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="promo-banner section__container">
                <div className="promo-grid">
                    <div className="placeholder-promo">🎁</div>
                    <div className="promo-text">
                        <span className="promo-tag">EDICIÓN LIMITADA</span>
                        <h2>El regalo perfecto para el verdadero matero</h2>
                        <ul>
                            <li><span className="material-symbols-outlined">done</span> Mate de madera noble seleccionada</li>
                            <li><span className="material-symbols-outlined">done</span> Bombilla de alpaca premium</li>
                            <li><span className="material-symbols-outlined">done</span> Caja artesanal de madera</li>
                            <li><span className="material-symbols-outlined">done</span> Guía de curado paso a paso</li>
                        </ul>
                        <p className="promo-price">$89.000</p>
                        <button className="btn-promo">Lo quiero ahora</button>
                    </div>
                </div>
            </section>
        </div>
    );
}