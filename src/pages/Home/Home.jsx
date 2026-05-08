import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Filtramos los productos destacados
    const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);
    const mainCategories = categories.slice(0, 6);

    // Buscamos el producto del Kit de Regalo para que el botón funcione
    const giftProduct = products.find(p => p.id === 401) || products.find(p => p.category === 'kits');

    const scrollToCategories = () => {
        const element = document.getElementById('categorias-home');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const handleGiftClick = () => {
        if (giftProduct) {
            addToCart(giftProduct);
            alert("¡Kit Regalo Premium agregado al carrito! 🎁");
        }
    };

    return (
        <div className="home">
            {/* HERO SECTION RESTAURADO AL 100% */}
            <section className="hero">
                <div className="hero__background-image"></div>
                <div className="hero__overlay">
                    <div className="hero__content-box">
                        <h1>
                            MATES CON <br />
                            <span className="gold-text">IDENTIDAD</span>
                        </h1>
                        <p>
                            Curaduría premium de mates imperiales tallados a mano en Mendoza.
                            Una pieza de arte en cada cebada.
                        </p>
                        <div className="hero__actions">
                            <button onClick={scrollToCategories} className="btn-primary">
                                VER CATÁLOGO
                            </button>
                            <a
                                href="https://wa.me/5492625597956?text=Hola!%20Quiero%20consultar%20por%20un%20mate%20premium"
                                target="_blank"
                                rel="noreferrer"
                                className="btn-outline"
                            >
                                CONSULTAR POR WHATSAPP
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORÍAS */}
            <section id="categorias-home" className="section-container">
                <div className="section-header">
                    <h2>Encontrá tu compañero ideal</h2>
                    <div className="gold-divider"></div>
                </div>

                <div className="home-categories-grid">
                    {mainCategories.map(cat => (
                        <Link key={cat.id} to={`/productos/${cat.id}`} className="category-item">
                            <span className="category-item__icon">{cat.icon}</span>
                            <h3>{cat.label}</h3>
                            <span className="category-item__link">Explorar</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* PRODUCTOS MÁS BUSCADOS */}
            <section className="section-container bg-white">
                <div className="section-header">
                    <h2>Los Más Buscados</h2>
                    <div className="gold-divider"></div>
                </div>

                <div className="products-featured-grid">
                    {bestSellers.map(product => (
                        <div key={product.id} className="home-product-card">
                            <div className="home-product-card__image">
                                <span className="placeholder-icon">🧉</span>
                                <span className="home-product-card__badge">Destacado</span>
                            </div>
                            <div className="home-product-card__info">
                                <span className="home-product-card__tag">{product.type}</span>
                                <h4>{product.name}</h4>
                                <p className="home-product-card__price">${product.price.toLocaleString()}</p>
                                <button
                                    className="btn-add-to-cart"
                                    onClick={() => addToCart(product)}
                                >
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROMO BANNER FUNCIONAL */}
            <section className="promo-section">
                <div className="promo-container">
                    <div className="promo-image-box">
                        <div className="promo-placeholder">🎁</div>
                    </div>
                    <div className="promo-content">
                        <span className="promo-subtitle">EDICIÓN LIMITADA</span>
                        <h2>El regalo perfecto para el verdadero matero</h2>
                        <ul className="promo-list">
                            <li><span className="material-symbols-outlined">check_circle</span> Mate de madera noble seleccionada</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Bombilla de alpaca premium</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Caja artesanal de madera</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Guía de curado paso a paso</li>
                        </ul>
                        <div className="promo-footer">
                            <p className="promo-price">$89.000</p>
                            <button onClick={handleGiftClick} className="btn-promo-action">
                                Lo quiero ahora
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}