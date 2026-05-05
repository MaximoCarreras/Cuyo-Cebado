// src/components/Hero/Hero.jsx
import './Hero.css';

// 1. Importamos la imagen (Asumiendo que el componente Hero está en src/components/Hero/)
// Si Hero.jsx está en otra carpeta, la cantidad de "../" puede variar.
import heroMateImg from '../../assets/hero_mate_grande.png'; 

export default function Hero() {
  
  // 2. Imprimimos en consola para ver si React encontró la imagen
  console.log("Ruta de la imagen:", heroMateImg);

  return (
    <section className="hero" id="hero">
      
      {/* 
        3. LA PRUEBA: Usamos una etiqueta <img> normal.
        Si la ruta está bien, la imagen va a aparecer enorme en la pantalla. 
      */}
      <img 
        src={heroMateImg} 
        alt="Prueba de carga" 
        style={{ width: '100%', height: 'auto', zIndex: 9999, position: 'relative' }} 
      />

      {/* Dejamos el resto comentado temporalmente para que no estorbe */}
      {/* 
      <div className="hero__shape"></div>
      <div className="hero__container section__container">
        ... contenido ...
      </div> 
      */}
    </section>
  );
}
