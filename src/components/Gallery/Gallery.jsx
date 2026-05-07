import './Gallery.css';

export default function Gallery() {
  return (
    <section className="gallery section" id="galeria">
      <div className="gallery__container section__container">
        {/* Cambiamos el título para que no se repita con la sección de abajo */}
        <h2 className="section__title">Nuestras Piezas en Acción</h2>

        {/* Aquí es donde se muestran las fotos de tus mates */}
        <div className="gallery__grid">
          {/* Vercel cargará aquí las imágenes que tengas en tu carpeta de assets */}
          {/* Tip: Podés mapear aquí tus fotos de Instagram o assets locales */}
        </div>

        {/* BORRAMOS el bloque gallery__actions porque esa info 
            ahora está en el componente Community que pusimos en App.jsx 
        */}
      </div>
    </section>
  );
}