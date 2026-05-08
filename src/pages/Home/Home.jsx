import { Link } from 'react-router-dom';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Filtramos para mostrar solo los Kits de Regalo Prensado como "Lo más vendido"
    const bestSellers = products.filter(p => p.type === 'Prensado').slice(0, 4);

    return (
        <div className="home">
            {/* 1. HERO SPOTLIGHT - Círculo e Imagen a la derecha */}
            <section className="hero-spotlight">
                <div className="hero-spotlight__container">
                    <div className="hero-spotlight__left">
                        <h1 className="hero-title">
                            MATES CON <br />
                            <span>IDENTIDAD</span>
                        </table>
                        <p className="hero-subtitle">
                            Curaduría premium de mates imperiales tallados a mano en Mendoza.
                            Una pieza de arte en cada cebada.
                        </p>
                        <div className="hero-cta">
                            <Link to="/productos" className="btn-primary">Ver Catálogo</Link>
                            <a href="https://wa.me/tu-numero" target="_blank" rel="noreferrer" className="btn-secondary">
                                Consultanos
                            </a>
                        </div>
                    </div>
                    <div className="hero-spotlight__right">
                        {/* EL EFECTO SPOTLIGHT (Círculo) */}
                        <div className="spotlight-circle">
                            {/* Asegurate de que la ruta a tu imagen del mate imperial sea correcta */}
                            <img src="/mate-hero.png" alt="Mate Imperial Premium" className="hero-image" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CATEGORÍAS (La grilla que te encantó, centrada) */}
            <section className="home-categories">
                <h2 className="section__title">Nuestras Colecciones</h2>
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

            {/* 3. LO MÁS VENDIDO - KIT DE REGALO PRENSADO (Suma de la foto) */}
            <section className="home-best-sellers">
                <div className="best-sellers__container">
                    <header className="best-sellers__header">
                        <h2 className="section__title">Lo más vendido</h2>
                        <p className="best-sellers__subtitle">KIT DE REGALO PRENSADO</p>
                        <div className="gold-separator"></div>
                    </header>

                    <div className="products-grid-meli">
                        {bestSellers.map((product) => (
                            <div key={product.id} className="product-card-premium">
                                <div className="product-image-container">
                                    {/* Aquí irá tu <img> cuando tengas las fotos de los kits prensados */}
                                    <span className="category-icon-bg">🎁</span>
                                </div>
                                <div className="product-details">
                                    <p className="details-material">{product.brand || 'Cuyo Cebado'}</p>
                                    <h4 className="details-name">{product.name}</h4>
                                    <p className="details-price">${product.price.toLocaleString()}</p>
                                    <button className="btn-add-cart" onClick={() => addToCart(product)}>
                                        Añadir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BOTÓN FLOTANTE WHATSAPP (Asegurate de tener el CSS en App.css) */}
            <a href="https://wa.me/tu-numero" className="whatsapp-float" target="_blank" rel="noreferrer">
                <span className="material-symbols-outlined">chat</span>
            </a>
        </div>
    );
}