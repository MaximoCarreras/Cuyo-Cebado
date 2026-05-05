/**
 * Main entry point — wraps App in BrowserRouter and CartProvider for global state.
 * Imports design system CSS.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importamos el enrutador
import { CartProvider } from './context/CartContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* El BrowserRouter envuelve todo para habilitar las rutas */}
      <CartProvider> {/* El CartProvider sigue envolviendo a App para el carrito */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);