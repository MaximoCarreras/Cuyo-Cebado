import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Productos destacados para la Home (Maquetado)
    const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);
    const mainCategories = categories.slice(0, 6);

    // Buscamos el Kit de Regalo (asumiendo ID 501 o similar en products.js)
    const giftProduct = products.find(p => p.id === 501) || products.find(p => p.category === 'kits');

    // Función para scroll suave a las categorías
    const scrollToCategories = () => {
        const element = document.getElementById('categorias-home');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleGiftClick = () => {
        if (giftProduct) {
            addToCart(giftProduct);
            alert("¡Kit Regalo Premium agregado al carrito! 🎁");
        }
    };

    return (
        <div className="home-mafia">
            {/* HERO SECTION RESTAURADO AL 100% MAFIA STYLE - TEXTO CORREGIDO */}
            <section className="hero-mafia">
                <div className="hero-mafia__container">
                    <div className="hero-mafia__left-panel">
                        <div className="hero-mafia__content">
                            <h1 className="hero-mafia__title">
                                MATES CON <br />
                                <span className="hero-mafia__gold-text">IDENTIDAD</span>
                            </h1>
                            <p className="hero-mafia__description">
                                Curaduría premium de mates imperiales tallados a mano en Mendoza.
                                Una pieza de arte en cada cebada.
                            </p>
                            <div className="hero-mafia__btns">
                                <button onClick={scrollToCategories} className="btn-mafia-gold-solid">
                                    VER CATÁLOGO
                                </button>
                                <a
                                    href="https://wa.me/5492625597956?text=Hola!%20Vengo%20desde%20la%20web%20y%20quiero%20consultar%20por%20un%20mate%20premium"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-mafia-gold-outline"
                                >
                                    CONSULTARNOS POR WHATSAPP
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Aquí se carga fondo_hero_principal.png desde CSS */}
                    <div className="hero-mafia__right-image"></div>
                </div>
            </section>

            {/* CATEGORÍAS */}
            <section id="categorias-home" className="home-section">
                <div className="home-section__header">
                    <h2 className="home-section__title">Encontrá tu compañero ideal</h2>
                    <div className="home-section__gold-line"></div>
                </div>

                <div className="home-categories-grid">
                    {mainCategories.map(cat => (
                        <Link key={cat.id} to={`/productos/${cat.id}`} className="home-cat-card">
                            <span className="home-cat-card__icon">{cat.icon}</span>
                            <h3>{cat.label}</h3>
                            <span className="home-cat-card__action">Explorar</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* PRODUCTOS DESTACADOS */}
            <section className="home-section home-section--white">
                <div className="home-section__header">
                    <h2 className="home-section__title">Los Más Buscados</h2>
                    <div className="home-section__gold-line"></div>
                </div>

                <div className="home-products-grid">
                    {bestSellers.map(product => (
                        <div key={product.id} className="home-prod-card">
                            <div className="home-prod-card__img-box">
                                <span className="home-prod-card__placeholder">🧉</span>
                                <span className="home-prod-card__badge">Destacado</span>
                            </div>
                            <div className="home-prod-card__info">
                                <span className="home-prod-card__type">{product.type}</span>
                                <h4>{product.name}</h4>
                                <p className="home-prod-card__price">${product.price.toLocaleString()}</p>
                                <button
                                    className="home-prod-card__btn"
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

            {/* PROMO BANNER REGALO (Sin Windows XP) */}
            <section className="home-promo">
                <div className="home-promo__container">
                    <div className="home-promo__image">
                        <div className="home-promo__placeholder">🎁</div>
                    </div>
                    <div className="home-promo__content">
                        <span className="home-promo__subtitle">EDICIÓN LIMITADA</span>
                        <h2 className="home-promo__title">El regalo perfecto para el verdadero matero</h2>
                        <ul className="home-promo__list">
                            <li><span className="material-symbols-outlined">check_circle</span> Mate de madera noble seleccionada</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Bombilla de alpaca premium</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Caja artesanal de madera</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Guía de curado paso a paso</li>
                        </ul>
                        <div className="home-promo__footer">
                            <p className="home-promo__price">$89.000</p>
                            <button onClick={handleGiftClick} className="home-promo__btn">
                                Lo quiero ahora
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}