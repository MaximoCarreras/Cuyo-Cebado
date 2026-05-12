import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { categories } from '../../data/products'; // Traemos solo las categorías
import { useCart } from '../../context/CartContext';
import heroImg from '../../assets/fondo_hero_principal.png';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    // ESTADOS PARA PRODUCTOS DE SUPABASE
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [featuredKit, setFeaturedKit] = useState(null);

    const heroRef = useRef(null);
    const categoryCardRefs = useRef([]);

    // 1. EFECTOS DE SPOTLIGHT (TU LÓGICA ORIGINAL)
    useEffect(() => {
        const handleHeroMouse = (e) => {
            if (!heroRef.current) return;
            const rect = heroRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroRef.current.style.setProperty("--hero-x", `${x}px`);
            heroRef.current.style.setProperty("--hero-y", `${y}px`);
        };
        const handleCardMouse = (e, card) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        };
        const currentHero = heroRef.current;
        if (currentHero) currentHero.addEventListener('mousemove', handleHeroMouse);
        categoryCardRefs.current.forEach((card) => {
            if (!card) return;
            card.addEventListener('mousemove', (e) => handleCardMouse(e, card));
        });
        return () => {
            if (currentHero) currentHero.removeEventListener('mousemove', handleHeroMouse);
            categoryCardRefs.current.forEach((card) => {
                if (!card) return;
                card.removeEventListener('mousemove', (e) => handleCardMouse(e, card));
            });
        };
    }, [featuredProducts]); // Re-ejecutar cuando carguen los productos

    // 2. CARGA AUTOMÁTICA DESDE SUPABASE
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_URL}/api/products`);
                const data = await response.json();

                // Filtramos los destacados (is_featured en Supabase)
                const featured = data.filter(p => p.is_featured);
                setFeaturedProducts(featured);

                // Buscamos un Kit para el Showcase o usamos el primero de la lista
                const kit = data.find(p => p.category === 'kits') || data[0];
                setFeaturedKit(kit);
            } catch (error) {
                console.error("Error cargando datos de inicio:", error);
            }
        };
        fetchHomeData();
    }, []);

    const handleNewsletter = (e) => {
        e.preventDefault();
        setStatus('enviando');
        setTimeout(() => { setStatus('exito'); setEmail(''); }, 1000);
    };

    return (
        <div className="home-main">
            {/* 1. HERO SECTION */}
            <section className="hero-mafia" ref={heroRef}>
                <div className="hero-spotlight-layer"></div>
                <div className="hero-visual-block">
                    <div className="spotlight-overlay"></div>
                    <img src={heroImg} alt="Mate Cuyo Cebado" className="hero-main-image" />
                    <div className="hero-mobile-gradient-mask"></div>
                </div>
                <div className="hero-mafia__content">
                    <div className="hero-text-block">
                        <h1 className="hero-title">MATES CON <br /><span>IDENTIDAD</span></h1>
                        <p className="hero-subtitle">Curaduría premium de mates imperiales tallados a mano en Mendoza. Una pieza de arte en cada cebada.</p>
                        <div className="hero-buttons">
                            <Link to="/productos" className="btn-gold-mafia">Ver Catálogo</Link>
                            <a href="https://wa.me/5492612307516" target="_blank" rel="noreferrer" className="btn-outline-mafia">WhatsApp</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CATEGORÍAS */}
            <section className="home-categories-section">
                <h2 className="global-section-title">Nuestras Colecciones</h2>
                <div className="categories-grid-premium">
                    {categories.map((cat, index) => (
                        <Link key={cat.id} to={`/categoria/${cat.id}`} className="card-cat-dark-spotlight" ref={(el) => (categoryCardRefs.current[index] = el)}>
                            <div className="spotlight-light-layer"></div>
                            <div className="card-cat-content">
                                <div className="cat-icon-display">{cat.icon}</div>
                                <div className="cat-text-display">
                                    <h3>{cat.label}</h3>
                                    <span>Explorar</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. SHOWCASE DINÁMICO (Kit Estrella) */}
            {featuredKit && (
                <section className="featured-showcase">
                    <div className="showcase-container">
                        <div className="showcase-image-side">
                            {featuredKit.image_url ? (
                                <img src={featuredKit.image_url} alt={featuredKit.name} className="img-showcase-real" />
                            ) : (
                                <>
                                    <div className="badge-premium">EL MÁS ELEGIDO</div>
                                    <span className="showcase-emoji">🎁</span>
                                </>
                            )}
                        </div>
                        <div className="showcase-info-side">
                            <p className="gold-tag">PRODUCTO DESTACADO</p>
                            <h2 className="showcase-title">{featuredKit.name}</h2>
                            <p className="showcase-description">
                                {featuredKit.description || "La experiencia definitiva para el buen cebador. Una pieza seleccionada por su calidad y terminación artesanal."}
                            </p>
                            <ul className="showcase-list">
                                <li><span className="material-symbols-outlined">check_circle</span> Calidad de Exportación</li>
                                <li><span className="material-symbols-outlined">check_circle</span> Materiales Seleccionados</li>
                                <li><span className="material-symbols-outlined">check_circle</span> {featuredKit.stock > 0 ? 'Stock Disponible' : 'Próximamente disponible'}</li>
                            </ul>
                            <div className="showcase-actions">
                                <span className="showcase-price">${Number(featuredKit.price).toLocaleString()}</span>
                                <button
                                    className="btn-gold-mafia"
                                    onClick={() => featuredKit.stock > 0 && addToCart(featuredKit)}
                                    disabled={featuredKit.stock === 0}
                                >
                                    {featuredKit.stock > 0 ? 'Comprar Ahora' : 'Sin Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 4. CLUB DE MATEROS */}
            <section className="club-newsletter">
                <div className="club-card">
                    <h2 className="club-title">Unite al Club de Materos</h2>
                    <p className="club-subtitle">Recibí alertas de stock, lanzamientos exclusivos y beneficios antes que nadie.</p>
                    <form className="club-form" onSubmit={handleNewsletter}>
                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" className="btn-club">
                            {status === 'enviando' ? 'Enviando' : 'Unirme'}
                        </button>
                    </form>
                    {status === 'exito' && <p className="club-msg-ok">¡Bienvenido al Club!</p>}
                </div>
            </section>
        </div>
    );
}