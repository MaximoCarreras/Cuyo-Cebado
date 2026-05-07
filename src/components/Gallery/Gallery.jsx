import './Gallery.css';

export default function Gallery() {
  return (
    <section className="gallery" id="galeria">
      <div className="gallery__container">
        {/* Usamos la clase global para que el diseño sea coherente */}
        <h2 className="section__title">Nuestras Piezas en Acción</h2>

        <div className="gallery__grid">
          {/* Este párrafo ayuda a que la sección no se vea vacía mientras subís las fotos */}
          <p style={{
            textAlign: 'center',
            color: '#2b2520',
            opacity: 0.7,
            gridColumn: '1 / -1',
            fontSize: '1.1rem',
            marginBottom: '40px'
          }}>
            Momentos compartidos por nuestra comunidad disfrutando el ritual de un buen mate.
          </p>

          {/* Tip para el futuro: Aquí es donde vas a mapear tus imágenes 
            cuando las tengas listas en tu carpeta public o assets. 
          */}
        </div>
      </div>
    </section>
  );
}