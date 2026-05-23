import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './InstagramCarousel.css';

export default function InstagramCarousel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('created_at', { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  // Si no hay fotos, no mostramos nada
  if (posts.length === 0) return null;

  // TRUCO MATEMÁTICO: Multiplicamos las fotos si son pocas para garantizar que el 
  // carrusel sea más ancho que cualquier monitor y no deje espacios en blanco.
  let repeatedPosts = [...posts];
  while (repeatedPosts.length < 10) {
    repeatedPosts = [...repeatedPosts, ...posts];
  }

  return (
    <section className="ritual-carousel">
      <div className="ritual-header">
        <span className="ritual-overline">Comunidad</span>
        <h2 className="ritual-title">Momentos Cuyo Cebado</h2>
        <div className="ritual-divider"></div>
      </div>

      <div className="ritual-marquee">
        <div className="ritual-track">
          {/* GRUPO 1 */}
          {repeatedPosts.map((post, idx) => (
            <a key={`orig-${idx}`} href={post.post_url} target="_blank" rel="noreferrer" className="ritual-item">
              <div className="ritual-img-container">
                <img src={post.image_url} alt="Cuyo Cebado Instagram" className="ritual-main-img" />
                <div className="ritual-overlay">
                  {/* ACÁ CARGAMOS TU LOGO */}
                  <img src="/logo.png" alt="Logo Cuyo Cebado" className="ritual-overlay-logo" />
                </div>
              </div>
            </a>
          ))}
          
          {/* GRUPO 2 (Idéntico al Grupo 1, necesario para el bucle perfecto) */}
          {repeatedPosts.map((post, idx) => (
            <a key={`clone-${idx}`} href={post.post_url} target="_blank" rel="noreferrer" className="ritual-item">
              <div className="ritual-img-container">
                <img src={post.image_url} alt="Cuyo Cebado Instagram" className="ritual-main-img" />
                <div className="ritual-overlay">
                  {/* ACÁ CARGAMOS TU LOGO */}
                  <img src="/logo.png" alt="Logo Cuyo Cebado" className="ritual-overlay-logo" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}