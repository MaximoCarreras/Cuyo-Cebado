import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
// Imagen importada correctamente desde assets
import heroImg from '../../assets/fondo_hero_principal.png';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();

    // Referencias para los efectos de luz (Spotlight)
    const heroRef = useRef(null);
    const categoryCardRefs = useRef([]);

    useEffect(() => {
        // Luz interactiva para el HERO
        const handleHeroMouse = (e) => {
            if (!heroRef.current) return;
            const rect = heroRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroRef.current.style.setProperty("--hero-x", `${x}px`);
            heroRef.current.style.setProperty("--hero-y", `${y}px`);
        };

        // Luz interactiva para las CATEGORÍAS
        const handleCardMouse = (e, card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        };

        const currentHero = heroRef.current;
        if (currentHero) {
            currentHero.addEventListener('mousemove', handleHeroMouse);
        }

        categoryCardRefs.current.forEach((card) => {
            if (!card) return;
            card.addEventListener('mousemove', (e) => handleCardMouse(e, card));
        });

        return () => {
            if (currentHero) {
                currentHero.removeEventListener('mousemove', handleHeroMouse);
            }
            categoryCardRefs.current.forEach((card) => {
                if (!card) return;
                card.removeEventListener('mousemove', (e) => handleCardMouse(e, card));
            });
        };
    }, []);

    const bestSellers = products.filter(p => p.type === 'Prensado').slice(0, 4);

    return (
        <div className="home-main">
            {/* 1. HERO SECTION CON SPOTLIGHT EN EL FONDO */}
            <section className="hero-mafia" ref={heroRef}>
                <div className="hero-spotlight-layer"></div>

                {/* VISUAL BLOCK (IMAGEN) */}
                <div className="hero-visual-block">
                    <div className="spotlight-overlay"></div>
                    <img src={heroImg} alt="Mate Cuyo Cebado" className="hero-main-image" />
                    {/* Nueva Capa de máscara de degradado solo para celular */}
                    <div className="hero-mobile-gradient-mask"></div>
                </div>

                {/* CONTENT BLOCK (TEXTO) */}
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
                            <a href="https://wa.me/5492625597956" target="_blank" rel="noreferrer" className="btn-outline-mafia">
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

            </section>

            {/* 2. CATEGORÍAS CON SPOTLIGHT CARDS */}
            <section className="home-categories-section">
                <h2 className="global-section-title">Nuestras Colecciones</h2>
                <div className="categories-grid-premium">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            to={`/productos/${cat.id}`}
                            className="card-cat-dark-spotlight"
                            ref={(el) => (categoryCardRefs.current[index] = el)}
                        >
                            <div className="spotlight-light-layer"></div>
                            <div className="card-cat-content">
                                <div className="cat-icon-display">{cat.icon}</div>
                                <div className="cat-text-display">
                                    <h3>{cat.label}</h3>
                                    <span>Explorar colección</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. LO MÁS VENDIDO */}
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
                                    Añadir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. FILOSOFÍA - BRANDING CORREGIDO: CUYO CEBADO */}
            <section className="home-philosophy">
                <div className="philosophy-container">
                    <h2 className="philosophy-title">Identidad y Tradición</h2>
                    <p>
                        No vendemos simples objetos, seleccionamos compañeros de vida.
                        En <strong>Cuyo Cebado</strong> creemos en la mística del ritual mendocino.
                    </p>
                    <Link to="/nosotros" className="btn-gold-mafia">Nuestra Historia</Link>
                </div>
            </section>
        </div>
    );
}