import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Importamos las nuevas páginas
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import About from './pages/About';
import Guide from './pages/Guide';

import './App.css';

export default function App() {
  return (
    <>
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