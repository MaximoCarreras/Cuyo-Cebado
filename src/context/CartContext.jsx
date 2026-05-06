import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
  // 1. IMPORTACIONES CORREGIDAS: Usamos 'cart' y 'cartTotal' exacto como está en tu Context
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  // Formateador de moneda argentina (AR$ 00.000)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // 2. CORREGIDO: Revisamos si 'cart' está vacío
  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty section__container">
        <span className="material-symbols-outlined empty-icon">shopping_basket</span>
        <h2>Tu carrito está vacío</h2>
        <p>Parece que todavía no has sumado ningún mate a tu pedido.</p>
        <Link to="/" className="btn btn--gold">Ir a ver productos</Link>
      </div>
    );
  }

  return (
    <div className="cart-page section__container">
      <h1 className="cart-page__title">Tu Carrito</h1>

      <div className="cart-page__grid">
        {/* COLUMNA IZQUIERDA: Lista de productos */}
        <div className="cart-items">
          {/* 3. CORREGIDO: Mapeamos la lista 'cart' */}
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__image">
                <img src={item.image_url} alt={item.name} />
              </div>

              <div className="cart-item__info">
                <h3>{item.name}</h3>
                <p className="cart-item__unit-price">{formatCurrency(item.price)} c/u</p>

                <div className="cart-item__controls">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="cart-item__subtotal">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* COLUMNA DERECHA: Resumen de compra */}
        <aside className="cart-summary">
          <div className="summary-card">
            <h3>Resumen del pedido</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              {/* 4. CORREGIDO: Usamos el número 'cartTotal' directamente */}
              <span>{formatCurrency(cartTotal)}</span>
            </div>

            <div className="summary-row">
              <span>Envío</span>
              <span className="text-free">A calcular</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>

            <button className="btn btn--gold btn-checkout">
              Continuar compra
            </button>

            <p className="cart-notice">
              <span className="material-symbols-outlined">verified_user</span>
              Compra protegida y segura
            </p>
          </div>

          <Link to="/" className="continue-shopping">
            ← Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}