import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ProductReviews.css'; // Podés usar los mismos colores de tu theme

export default function ProductReviews({ productSlug }) {
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Verificar si hay usuario logueado
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setUser(session.user);
        });
        fetchReviews();
    }, [productSlug]);

    const fetchReviews = async () => {
        // Traemos las reseñas y cruzamos datos con la tabla profiles para sacar el nombre
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                id, rating, comment, created_at,
                profiles:user_id (full_name)
            `)
            .eq('product_slug', productSlug)
            .order('created_at', { ascending: false });

        if (!error && data) setReviews(data);
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
            toast.error("Hubo un error al publicar tu reseña");
        } else {
            toast.success("¡Gracias por tu opinión!");
            setComment('');
            setRating(5);
            fetchReviews(); // Recargamos la lista
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
                                    className={`material-symbols-outlined ${star <= rating ? 'star-active' : 'star-inactive'}`}
                                    onClick={() => setRating(star)}
                                    style={{cursor: 'pointer', color: star <= rating ? '#a5813a' : '#ccc'}}
                                >
                                    star
                                </span>
                            ))}
                        </div>
                        <textarea 
                            value={comment} 
                            onChange={(e) => setComment(e.target.value)} 
                            placeholder="¿Qué te pareció este producto?" 
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
                                <strong>{rev.profiles?.full_name || 'Usuario Anónimo'}</strong>
                                <div className="review-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined" style={{color: i < rev.rating ? '#a5813a' : '#ccc', fontSize: '16px'}}>star</span>
                                    ))}
                                </div>
                            </div>
                            <p className="review-date">{new Date(rev.created_at).toLocaleDateString('es-AR')}</p>
                            <p className="review-text">{rev.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}