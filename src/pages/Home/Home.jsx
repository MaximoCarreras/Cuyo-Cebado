import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Filtramos los 4 productos marcados como bestSeller en products.js
    const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);

    // Tomamos las primeras categorías para la Home. Hay 6 en tu products.js.
    // Esto incluye: Mates, Bombillas, Yerba Mate, Kits & Regalos, Dúos de Guardado, Transporte.
    const mainCategories = categories.slice(0, 6);

    return (
        <div className="home">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero__content">
                    <h1>CURADURÍA MATERA PREMIUM</h1>
                    <p>Desde Mendoza, seleccionamos las piezas más exclusivas para elevar tu ritual diario.</p>
                    <Link to="/productos" className="btn-hero">Ver Colección Completa</Link>
                </div>
            </section>

            {/* CATEGORÍAS PRINCIPALES (Todas en una línea) */}
            <section className="section__container">
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

            {/* PRODUCTOS DESTACADOS */}
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
                                <button
                                    className="btn-add-home"
                                    onClick={() => addToCart(product)}
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* BANNER PROMOCIONAL (Botón arreglado) */}
            <section className="promo-banner section__container">
                <div className="promo-grid">
                    <div className="promo-image">
                        <div className="placeholder-promo">🎁</div>
                    </div>
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
                        {/* ESTE BOTÓN YA TIENE LA CLASE CORRECTA */}
                        <button className="btn-promo">Lo quiero ahora</button>
                    </div>
                </div>
            </section>
        </div>
    );
}