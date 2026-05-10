import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { categories, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
// Importamos supabase (Asegurate de tenerlo configurado en tu proyecto)
// import { supabase } from '../../supabaseClient'; 
import heroImg from '../../assets/fondo_hero_principal.png';
import './Home.css';

export default function Home() {
    const { addToCart } = useCart();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const heroRef = useRef(null);
    const categoryCardRefs = useRef([]);

    // Seleccionamos el producto estrella (El primer kit de regalo que encuentre)
    const featuredKit = products.find(p => p.type === 'Prensado') || products[0];

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
    }, []);

    // Lógica de Newsletter para Supabase
    const handleNewsletter = async (e) => {
        e.preventDefault();
        setStatus('enviando');

        /* Descomentá esto cuando tengas Supabase conectado:
        const { error } = await supabase.from('newsletter').insert([{ email }]);
        if (error) setStatus('error');
        else { setStatus('exito'); setEmail(''); }
        */

        // Simulación por ahora:
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
                            {/* Botones con estilo premium */}
                            <Link to="/productos" className="btn-gold-mafia">Ver Catálogo</Link>
                            <a href="https://wa.me/5492625597956" target="_blank" rel="noreferrer" className="btn-outline-mafia">WhatsApp</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CATEGORÍAS (CENTRADAS Y COMPACTAS EN CELU) */}
            <section className="home-categories-section">
                <h2 className="global-section-title">Nuestras Colecciones</h2>
                <div className="categories-grid-premium">
                    {categories.map((cat, index) => (
                        <Link key={cat.id} to={`/productos/${cat.id}`} className="card-cat-dark-spotlight" ref={(el) => (categoryCardRefs.current[index] = el)}>
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

            {/* 3. SHOWCASE KIT ESTRELLA */}
            <section className="featured-showcase">
                <div className="showcase-container">
                    <div className="showcase-image-side">
                        <div className="badge-premium">EL MÁS ELEGIDO</div>
                        <span className="showcase-emoji">🎁</span>
                    </div>
                    <div className="showcase-info-side">
                        <p className="gold-tag">NUESTRO KIT ESTRELLA</p>
                        <h2 className="showcase-title">{featuredKit?.name}</h2>
                        <p className="showcase-description">
                            La experiencia definitiva para el buen cebador. Un conjunto pensado para durar toda la vida.
                        </p>
                        <ul className="showcase-list">
                            <li><span className="material-symbols-outlined">check_circle</span> Mate Imperial Premium de Cuero Legítimo</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Bombilla de Alpaca Cincelada</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Yerba Mate Cuyo Cebado (500g)</li>
                            <li><span className="material-symbols-outlined">check_circle</span> Packaging de Regalo Boutique</li>
                        </ul>
                        <div className="showcase-actions">
                            <span className="showcase-price">${featuredKit?.price.toLocaleString()}</span>
                            {/* Botón ahora premium, no Windows XP */}
                            <button className="btn-gold-mafia" onClick={() => addToCart(featuredKit)}>
                                Comprar Ahora
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CLUB DE MATEROS (NEWSLETTER) */}
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

            {/* SECCIÓN FILOSOFÍA ELIMINADA POR PEDIDO */}
        </div>
    );
}