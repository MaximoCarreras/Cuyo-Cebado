import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './InstagramCarousel.css';

export default function InstagramCarousel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // Necesitás crear esta tabla en Supabase: id, image_url, post_url, created_at
      const { data } = await supabase.from('instagram_posts').select('*').limit(8);
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="insta-carousel-section">
      <div className="insta-carousel-header">
        <span className="insta-overline">Comunidad</span>
        <h2 className="insta-title">#CuyoCebado</h2>
        <div className="gold-line"></div>
      </div>

      <div className="insta-marquee">
        <div className="insta-marquee-track">
          {/* Duplicamos el array para el efecto de scroll infinito continuo */}
          {[...posts, ...posts].map((post, idx) => (
            <a key={idx} href={post.post_url} target="_blank" rel="noreferrer" className="insta-card">
              <img src={post.image_url} alt="Instagram Cuyo Cebado" />
              <div className="insta-overlay">
                <span className="material-symbols-outlined">favorite</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}