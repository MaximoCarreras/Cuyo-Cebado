import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';

// Importamos la nueva sección de Comunidad
import Community from './components/Community/Community';

// Importamos las páginas
import Home from './pages/Home';
import About from './pages/About';
import Guide from './pages/Guide';
import CartPage from './pages/CartPage/CartPage';

import './App.css';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/guia-curado" element={<Guide />} />
        </Routes>
      </main>

      {/* Ponemos la Comunidad acá para que aparezca en todas las páginas 
          antes del final, llenando ese espacio que querías.
      */}
      <Community />

      <Footer />

      {/* BURBUJA FLOTANTE DE WHATSAPP (Soporte Personal) */}
      <a
        href="https://wa.me/5492625597956"
        className="whatsapp-float"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="Soporte Cuyo Cebado"
        />
        <span className="tooltip-wa">¿Dudas? Escribinos</span>
      </a>
    </>
  );
}