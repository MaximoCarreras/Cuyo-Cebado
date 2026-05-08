import { Link } from 'react-router-dom';
import { categories, products } from '../data/products';
import { useCart } from '../context/CartContext';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Filtramos los 4 productos más vendidos para mostrar en la Home
    const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);

    // Elegimos las 5 categorías principales para el menú de arriba
    const mainCategories = categories.slice(0, 5);

    return (
        <div className="home">
            {/* HERO SECTION (El impacto inicial) */}
            <section className="hero">
                <div className="hero__content">
                    <h1>CURADURÍA MATERA PREMIUM</h1>
                    <p>Desde el corazón de Mendoza, seleccionamos los tesoros más exclusivos para tu ritual.</p>
                    <Link to="/productos" className="btn-hero">Explorar Catálogo</Link>
                </div>
            </section>

            {/* ENCONTRÁ TU CATEGORÍA (Sincronizado con la tienda) */}
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
                            <p>Ver colección</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* PRODUCTOS MÁS VENDIDOS (Escaparate real) */}
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
                                <span className="badge-best">Más vendido</span>
                            </div>
                            <div className="product-card__info">
                                <h4>{product.name}</h4>
                                <p className="product-tag">{product.type}</p>
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

            {/* BANNER PROMOCIONAL (El Regalo Perfecto) */}
            <section className="promo-banner section__container">
                <div className="promo-grid">
                    <div className="promo-image">
                        {/* Aquí iría la foto del kit de regalo */}
                        <div className="placeholder-promo">🎁</div>
                    </div>
                    <div className="promo-text">
                        <span className="promo-tag">LA OPCIÓN MÁS ELEGIDA</span>
                        <h2>El regalo perfecto para el verdadero matero</h2>
                        <ul>
                            <li><span className="material-symbols-outlined">check</span> Mate de madera noble seleccionado</li>
                            <li><span className="material-symbols-outlined">check</span> Bombilla de alpaca o acero premium</li>
                            <li><span className="material-symbols-outlined">check</span> Caja artesanal de madera</li>
                            <li><span className="material-symbols-outlined">check</span> Guía de curado y cuidado paso a paso</li>
                        </ul>
                        <p className="promo-price">$89.000</p>
                        <button className="btn-promo">Comprar ahora</button>
                    </div>
                </div>
            </section>
        </div>
    );
}