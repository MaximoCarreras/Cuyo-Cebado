import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from './context/CartContext';
import { getGlobalCatalog } from './lib/catalogStore'; // 🔥 IMPORTAMOS EL CEREBRO GLOBAL EN LA RAÍZ
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

// --- NUEVAS PÁGINAS LEGALES Y WHATSAPP ---
import ContactPage from './pages/Legal/ContactPage';
import ShippingPolicies from './pages/Legal/ShippingPolicies';
import TermsAndConditions from './pages/Legal/TermsAndConditions';
import WhatsAppBubble from './components/WhatsAppBubble/WhatsAppBubble';

// --- NUEVO PANEL DE CLIENTE ---
import ClientDashboard from './pages/ClientDashboard/ClientDashboard';

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

  // 🔥 MOTOR SECRETO DE VELOCIDAD GLOBAL
  // Apenas el cliente abre Cuyo Cebado, esto descarga silenciosamente todo el catálogo en segundo plano.
  // Cuando navegue al Home, Categorías o Mates, la carga será de 0 milisegundos.
  useEffect(() => {
    getGlobalCatalog();
  }, []);

  // DETECTOR GLOBAL DE PAGO APROBADO (TU LÓGICA INTACTA)
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
          
          {/* 🔥 RUTA DEL NUEVO DASHBOARD */}
          <Route path="/mi-cuenta/dashboard" element={<ClientDashboard />} />

          <Route path="/pago-exitoso" element={<SuccessPage />} />
          <Route path="/pago-fallido" element={<FailurePage />} />

          {/* --- RUTAS LEGALES NUEVAS --- */}
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/envios" element={<ShippingPolicies />} />
          <Route path="/terminos" element={<TermsAndConditions />} />

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
      {/* --- BURBUJA FLOTANTE DE WHATSAPP --- */}
      <WhatsAppBubble />
      <Footer />
    </div>
  );
}