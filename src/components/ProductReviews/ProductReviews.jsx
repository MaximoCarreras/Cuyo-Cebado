import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ProductReviews.css';

export default function ProductReviews({ productSlug }) {
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setUser(session.user);
        });
        fetchReviews();
    }, [productSlug]);

    const fetchReviews = async () => {
        // Traemos las reseñas, incluyendo nombre, foto y respuesta del admin
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                id, rating, comment, created_at, admin_reply,
                profiles:user_id (full_name, avatar_url)
            `)
            .eq('product_slug', productSlug)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error trayendo reseñas:", error);
        } else if (data) {
            setReviews(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return toast.error("Tenés que iniciar sesión para comentar");
        if (!comment.trim()) return toast.error("El comentario no puede estar vacío");

        setLoading(true);
        const { error } = await supabase.from('reviews').insert([{
            product_slug: productSlug,
            user_id: user.id,
            rating,
            comment
        }]);

        setLoading(false);

        if (error) {
            console.error("Error guardando reseña:", error);
            toast.error("Hubo un error al publicar tu reseña.");
        } else {
            toast.success("¡Gracias por tu opinión! 🧉");
            setComment('');
            setRating(5);
            fetchReviews(); // Recargamos la lista automáticamente
        }
    };

    return (
        <div className="reviews-container">
            <h3 className="section__title">Opiniones de la Comunidad</h3>
            
            {/* FORMULARIO DE CARGA */}
            <div className="review-form-card">
                {user ? (
                    <form onSubmit={handleSubmit}>
                        <h4>Dejá tu reseña</h4>
                        <div className="star-selector">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star} 
                                    className="material-symbols-outlined"
                                    onClick={() => setRating(star)}
                                    style={{
                                        cursor: 'pointer', 
                                        color: star <= rating ? '#a5813a' : '#ccc',
                                        /* 🔥 ACÁ ESTÁ LA MAGIA PARA RELLENAR LAS ESTRELLAS */
                                        fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0',
                                        fontSize: '28px'
                                    }}
                                >
                                    star
                                </span>
                            ))}
                        </div>
                        <textarea 
                            value={comment} 
                            onChange={(e) => setComment(e.target.value)} 
                            placeholder="¿Qué te pareció este producto? Tu opinión ayuda a otros materos." 
                            rows="3"
                        />
                        <button type="submit" disabled={loading} className="btn-gold">
                            {loading ? 'Publicando...' : 'Publicar Reseña'}
                        </button>
                    </form>
                ) : (
                    <div className="login-prompt">
                        <p>¿Ya probaste este producto? Compartí tu experiencia con otros materos.</p>
                        <Link to="/mi-cuenta" className="btn-outline-gold">Iniciar sesión para comentar</Link>
                    </div>
                )}
            </div>

            {/* LISTA DE RESEÑAS */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">Todavía no hay opiniones. ¡Sé el primero en comentar!</p>
                ) : (
                    reviews.map(rev => (
                        <div key={rev.id} className="review-item">
                            <div className="review-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {/* Muestra la foto de perfil del usuario si tiene, sino un avatar por defecto */}
                                    <img 
                                        src={rev.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${rev.profiles?.full_name || 'U'}&backgroundColor=a5813a`} 
                                        alt="Avatar" 
                                        style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <strong>{rev.profiles?.full_name || 'Usuario Anónimo'}</strong>
                                </div>
                                <div className="review-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span 
                                            key={i} 
                                            className="material-symbols-outlined" 
                                            style={{
                                                color: i < rev.rating ? '#a5813a' : '#e2e8f0', 
                                                fontSize: '18px',
                                                fontVariationSettings: i < rev.rating ? '"FILL" 1' : '"FILL" 0'
                                            }}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="review-date">{new Date(rev.created_at).toLocaleDateString('es-AR')}</p>
                            <p className="review-text">{rev.comment}</p>

                            {/* RESPUESTA OFICIAL (Aparece solo si escribís algo desde Supabase en admin_reply) */}
                            {rev.admin_reply && (
                                <div style={{ marginTop: '15px', background: 'rgba(165, 129, 58, 0.05)', padding: '15px', borderRadius: '12px', borderLeft: '3px solid #a5813a' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#a5813a', fontSize: '18px' }}>storefront</span>
                                        <strong style={{ color: '#a5813a', fontSize: '0.9rem' }}>Cuyo Cebado</strong>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a403a' }}>{rev.admin_reply}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}