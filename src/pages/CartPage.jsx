import React from 'react';

/**
 * CartPage — Vista principal del carrito de compras.
 * El "export default" es obligatorio para que las rutas funcionen.
 */
export default function CartPage() {
  return (
    <div 
      className="cart-page section" 
      style={{ 
        paddingTop: '160px', 
        paddingBottom: '80px',
        textAlign: 'center', 
        minHeight: '70vh',
        background: 'var(--color-brown-dark)' 
      }}
    >
      <div className="container">
        <h2 
          className="section__title" 
          style={{ color: 'var(--color-gold)', marginBottom: '20px' }}
        >
          Tu Carrito de Compras
        </h2>
        
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '40px', fontSize: '1.1rem' }}>
          Todavía no agregaste productos a tu selección.
        </p>

        <a 
          href="/" 
          className="btn btn--primary"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          Volver al Catálogo
        </a>
      </div>
    </div>
  );
}
