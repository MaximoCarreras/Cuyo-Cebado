import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './InstagramCarousel.css';

export default function InstagramCarousel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // Usamos la tabla que creamos con SQL
      const { data } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('created_at', { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="ritual-carousel">
      <div className="ritual-header">
        <span className="ritual-overline">Comunidad</span>
        <h2 className="ritual-title">Momentos Cuyo Cebado</h2>
        <div className="ritual-divider"></div>
      </div>

      <div className="ritual-marquee">
        <div className="ritual-track">
          {/* Repetimos los posts para el scroll infinito */}
          {[...posts, ...posts, ...posts].map((post, idx) => (
            <a key={idx} href={post.post_url} target="_blank" rel="noreferrer" className="ritual-item">
              <div className="ritual-img-container">
                <img src={post.image_url} alt="Cuyo Cebado Instagram" />
                <div className="ritual-overlay">
                  <i className="fa-brands fa-instagram"></i>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}