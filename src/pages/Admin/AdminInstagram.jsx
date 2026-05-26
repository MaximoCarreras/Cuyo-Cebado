import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminInstagram.css';

export default function AdminInstagram() {
  const [posts, setPosts] = useState([]);
  const [postUrl, setPostUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Cargar los posts actuales para poder gestionarlos
  const fetchPosts = async () => {
    const { data } = await supabase
      .from('instagram_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !postUrl) {
      setMessage({ text: 'Por favor, completa el link de Instagram y selecciona una imagen.', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      // 1. Crear un nombre único para el archivo para que no se sobreescriban
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `instagram/post_${Date.now()}.${fileExt}`;
      
      // 2. Subir la imagen al Storage (Bucket 'productos')
      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // 3. Obtener la URL pública de la imagen
      const { data: { publicUrl } } = supabase.storage
        .from('productos')
        .getPublicUrl(fileName);

      // 4. Insertar el registro en la tabla de la base de datos
      const { error: insertError } = await supabase
        .from('instagram_posts')
        .insert([
          { image_url: publicUrl, post_url: postUrl }
        ]);

      if (insertError) throw insertError;

      // Todo salió bien
      setMessage({ text: '¡Publicación añadida al carrusel con éxito! 🧉🚀', type: 'success' });
      setPostUrl('');
      setImageFile(null);
      // Resetear el input file manualmente
      document.getElementById('instagram-file-input').value = '';
      
      // Recargar la lista
      fetchPosts();

    } catch (error) {
      console.error(error);
      setMessage({ text: `Error al subir: ${error.message}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta foto del carrusel?')) return;

    try {
      // Optativo: Se podría borrar también el archivo del Storage, pero con borrar la fila de la tabla 
      // ya desaparece del carrusel inmediatamente.
      const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ text: 'Publicación eliminada.', type: 'success' });
      fetchPosts();
    } catch (error) {
      setMessage({ text: 'No se pudo eliminar.', type: 'error' });
    }
  };

  return (
    <div className="admin-insta-manager">
      <header className="admin-insta-header">
        <h2>Gestor del Carrusel de Instagram</h2>
        <p>Subí las portadas de tus Reels y conectalas con su link para que se actualicen en el inicio de la web.</p>
      </header>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* FORMULARIO DE CARGA */}
      <form onSubmit={handleUpload} className="admin-insta-form">
        <div className="admin-input-group">
          <label>1. Link de la publicación / Reel</label>
          <input 
            type="url" 
            placeholder="https://www.instagram.com/p/..." 
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            required
          />
        </div>

        <div className="admin-input-group">
          <label>2. Captura o Portada de la foto</label>
          <input 
            type="file" 
            id="instagram-file-input"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="btn-admin-submit" disabled={uploading}>
          {uploading ? 'Subiendo al Ritual...' : 'Agregar al Carrusel ✨'}
        </button>
      </form>

      {/* LISTADO DE EDICIÓN / BAJAS */}
      <div className="admin-insta-list-container">
        <h3>Fotos actuales en el Carrusel ({posts.length})</h3>
        
        {posts.length === 0 ? (
          <p className="no-posts">No hay imágenes cargadas en el carrusel todavía.</p>
        ) : (
          <div className="admin-insta-grid">
            {posts.map((post) => (
              <div key={post.id} className="admin-insta-card">
                <div className="admin-card-img-wrapper">
                  <img src={post.image_url} alt="Post carrusel" />
                </div>
                <div className="admin-card-info">
                  <a href={post.post_url} target="_blank" rel="noreferrer" className="admin-link-check">
                    Ver link de Instagram ↗
                  </a>
                  <button 
                    onClick={() => handleDelete(post.id, post.image_url)}
                    className="btn-admin-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}