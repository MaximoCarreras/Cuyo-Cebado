import { Routes, Route } from 'react-router-dom';
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
// RUTA ORIGINAL:
import AdminDashboard from './pages/Admin/AdminDashboard';
import SuccessPage from './pages/Checkout/SuccessPage';
import FailurePage from './pages/Checkout/FailurePage';
import NotFound from './pages/NotFound/NotFound'; 
import './App.css';

export default function App() {
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/pago-exitoso" element={<SuccessPage />} />
          <Route path="/pago-fallido" element={<FailurePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Community />
      <Footer />
    </div>
  );
}