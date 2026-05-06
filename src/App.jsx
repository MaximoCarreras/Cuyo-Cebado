import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// 1. Importamos el componente de Scroll
import ScrollToTop from './components/ScrollToTop';

// Importamos las páginas
import Home from './pages/Home';
import About from './pages/About';
import Guide from './pages/Guide';

// IMPORTACIÓN CORREGIDA: Apuntamos al archivo exacto dentro de la nueva carpeta
import CartPage from './pages/CartPage/CartPage';

import './App.css';

export default function App() {
  return (
    <>
      {/* 2. Lo colocamos aquí arriba: no se ve, pero "limpia" el scroll en cada cambio */}
      <ScrollToTop />

      <Navbar />
      <main>
        <Routes>
          {/* Aquí definimos qué componente se renderiza en cada URL */}
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/guia-curado" element={<Guide />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}