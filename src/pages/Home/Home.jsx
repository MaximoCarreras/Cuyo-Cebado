import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCart } from '../../context/CartContext';
import heroImg from '../../assets/fondo_hero_principal.png';
import InstagramCarousel from '../../components/InstagramCarousel/InstagramCarousel'; 
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [featuredKit, setFeaturedKit] = useState(null);
    const [dbCategories, setDbCategories] = useState([]);

    const heroRef = useRef(null);
    const categoryCardRefs = useRef([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const { data: catData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
                if (catData) setDbCategories(catData);

                const { data: featuredData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_featured', true)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (featuredData && featuredData.length > 0) {
                    setFeaturedKit(featuredData[0]);
                } else {
                    const { data: fallbackData } = await supabase
                        .from('products')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(1);

                    if (fallbackData && fallbackData.length > 0) {
                        setFeaturedKit(fallbackData[0]);
                    }
                }
            } catch (error) {
                console.error("Error cargando Home:", error);
            }
        };
        fetchHomeData();
    }, []);

    // Efecto Spotlight
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
        categoryCardRefs.current.forEach((card, index) => {
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
    }, [featuredKit, dbCategories]);

    // NUEVO EFECTO: Aparecer al scrollear (Fade-in on scroll)
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Se activa cuando el 15% del elemento es visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Dejamos de observar para que pase solo una vez
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, [featuredKit, dbCategories]);

    const handleNewsletter = (e) => {
        e.preventDefault();
        setStatus('enviando');
        setTimeout(() => { setStatus('exito'); setEmail(''); }, 1000);
    };

    return (
        <div className="home-main">
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

            {/* Agregamos la clase .reveal-on-scroll */}
            <section className="home-categories-section reveal-on-scroll">
                <h2 className="global-section-title">Nuestras Colecciones</h2>
                <div className="categories-grid-premium">
                    {dbCategories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            to={`/productos/${cat.id}`}
                            className="card-cat-dark-spotlight"
                            ref={(el) => (categoryCardRefs.current[index] = el)}
                        >
                            <div className="spotlight-light-layer"></div>
                            <div className="card-cat-content">
                                <div className="category-card__icon" style={{ display: 'flex', justifyContent: 'center' }}>
                                    {cat.image_url ? (
                                        <img
                                            src={cat.image_url}
                                            alt={cat.label}
                                            className="category-card-img"
                                        />
                                    ) : (
                                        cat.icon
                                    )}
                                </div>
                                <div className="cat-text-display">
                                    <h3>{cat.label}</h3>
                                    <span>Explorar</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Agregamos la clase .reveal-on-scroll */}
            {featuredKit && (
                <section className="featured-showcase reveal-on-scroll">
                    <div className="showcase-container">
                        <div className="showcase-image-side">
                            <div className="badge-premium">DESTACADO</div>
                            <img
                                src={featuredKit.image_url || '/assets/placeholder.png'}
                                alt={featuredKit.name}
                                className="showcase-img"
                            />
                        </div>
                        <div className="showcase-info-side">
                            <p className="gold-tag">NUESTRO ELEGIDO</p>
                            <h2 className="showcase-title">{featuredKit.name}</h2>
                            <p className="showcase-description">{featuredKit.description || "Calidad artesanal mendocina."}</p>
                            <div className="showcase-actions">
                                <span className="showcase-price">${Number(featuredKit.price).toLocaleString('es-AR')}</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-gold-mafia" onClick={() => featuredKit.stock > 0 && addToCart(featuredKit)} disabled={featuredKit.stock === 0}>
                                        {featuredKit.stock > 0 ? 'Comprar Ahora' : 'Sin Stock'}
                                    </button>
                                    <Link to={`/producto/${featuredKit.slug}`} className="btn-outline-mafia" style={{ padding: '15px 30px', display: 'flex', alignItems: 'center' }}>
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Agregamos la clase .reveal-on-scroll */}
            <section className="club-newsletter reveal-on-scroll">
                <div className="club-card">
                    <h2 className="club-title">Unite al Club de Materos</h2>
                    <form className="club-form" onSubmit={handleNewsletter}>
                        <input type="email" placeholder="Tu correo electrónico" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button type="submit" className="btn-club">{status === 'enviando' ? 'Enviando' : 'Unirme'}</button>
                    </form>
                    {status === 'exito' && <p className="club-msg-ok">¡Bienvenido al Club!</p>}
                </div>
            </section>

            {/* Agregamos la clase .reveal-on-scroll al Carrusel */}
            <div className="reveal-on-scroll">
                <InstagramCarousel />
            </div>
            
        </div>
    );
}