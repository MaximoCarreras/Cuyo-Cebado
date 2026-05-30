import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';
import Community from './components/Community/Community';
import Home from './pages/Home/Home';
import About from './pages/About';
import Guide from './pages/Guide';
import CartPage from './pages/CartPage/CartPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import AuthPage from './pages/Auth/AuthPage';
import SuccessPage from './pages/Checkout/SuccessPage';
import FailurePage from './pages/Checkout/FailurePage';
import NotFound from './pages/NotFound/NotFound'; 

// --- ADMIN MODULES ---
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboardHome from './pages/Admin/Dashboard/AdminDashboardHome';
import AdminInventory from './pages/Admin/Inventory/AdminInventory';
import AdminOrders from './pages/Admin/Orders/AdminOrders';
import AdminCategories from './pages/Admin/Categories/AdminCategories';
import AdminWebSettings from './pages/Admin/WebSettings/AdminWebSettings';
import AdminSupply from './pages/Admin/Supply/AdminSupply';
import AdminFAQ from './pages/Admin/FAQ/AdminFAQ';

import './App.css';

export default function App() {
  const { clearCart } = useCart();

  // DETECTOR GLOBAL DE PAGO APROBADO
  useEffect(() => {
    if (window.location.href.includes('approved')) {
      console.log("✅ Pago aprobado global detectado. Limpiando carrito...");
      localStorage.removeItem('cart');
      if (typeof clearCart === 'function') clearCart();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [clearCart]);

  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/guia-curado" element={<Guide />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:categoryId" element={<CategoryPage />} />
          <Route path="/producto/:slug" element={<ProductDetail />} />
          <Route path="/mi-cuenta" element={<AuthPage />} />
          <Route path="/pago-exitoso" element={<SuccessPage />} />
          <Route path="/pago-fallido" element={<FailurePage />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="stock" element={<AdminInventory />} />
            <Route path="ventas" element={<AdminOrders />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="vitrina" element={<AdminWebSettings />} />
            <Route path="compras" element={<AdminSupply />} />
            <Route path="faq" element={<AdminFAQ />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Community />
      {/* Botón de WhatsApp rescatado y bien ubicado */}
      <a href="https://wa.me/5492612307516" target="_blank" rel="noopener noreferrer" className="whatsapp-float">
        <svg className="wa-icon" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.553 4.195 1.604 6.014L.452 22.458l4.536-1.189c1.76.954 3.754 1.464 5.825 1.464 6.646 0 12.031-5.385 12.031-12.031S17.461 0 12.031 0zm3.834 17.202c-.544.153-2.61.644-4.992-1.049-2.383-1.693-3.626-4.05-3.834-4.356-.208-.306-1.022-1.353-1.022-2.58s.642-1.821.874-2.051c.231-.23.639-.306.873-.306.234 0 .468.006.678.012.234.006.549-.076.845.644.316.766 1.052 2.564 1.146 2.756.094.192.188.461.058.73-.13.268-.234.422-.442.668-.208.246-.436.536-.624.712-.208.192-.426.402-.182.808.244.406 1.088 1.785 2.344 2.903 1.616 1.439 3.018 1.884 3.424 2.076.406.192.64.153.874-.115.234-.268 1.014-1.187 1.284-1.593.27-.406.54-.345.91-.21 1.052.383 2.656 1.264 3.106 1.494.45.23 1.05.344 1.188.536.138.191.138 1.11-.406 2.258z"/></svg>
      </a>
      <Footer />
    </div>
  );
}