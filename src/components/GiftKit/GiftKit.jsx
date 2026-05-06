/**
 * GiftKit — Sección de Kit de Regalo para Cuyo Cebado.
 * Actualizado para agregar directamente al carrito de compras.
 */
import { useCart } from '../../context/CartContext'; // 1. Importamos el cerebro del carrito
import kitImage from '../../assets/kit_regalo.png';
import './GiftKit.css';

export default function GiftKit() {
  // 2. Traemos la función para despachar al carrito
  const { addToCart } = useCart();

  // 3. Armamos los datos del producto exacto como los necesita el chango
  const kitProduct = {
    id: 'kit-regalo-premium', // Un ID único para que no se pise con otros mates
    name: 'Kit Regalo Premium',
    price: 89000,
    image_url: kitImage, // Usamos la misma imagen que ya tenés importada
    stock: 10 // Un stock base para que el sistema permita la compra
  };

  return (
    <section className="giftkit section" id="kit-regalo">
      <div className="giftkit__container section__container">

        {/* Izquierda — Imagen con insignia */}
        <div className="giftkit__image-wrapper">
          <img src={kitImage} alt="Kit Regalo Premium Cuyo Cebado" loading="lazy" />
          <span className="badge badge--gold giftkit__badge">La opción más elegida</span>
        </div>

        {/* Derecha — Detalles del producto */}
        <div className="giftkit__content">
          <h2 className="giftkit__title">
            El regalo perfecto para el verdadero matero
          </h2>

          {/* Lista de ítems incluidos */}
          <ul className="giftkit__items">
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Mate de madera noble seleccionado
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Bombilla de alpaca o acero premium
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Caja artesanal de madera
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Guía de curado y cuidado paso a paso
            </li>
          </ul>

          <p className="giftkit__price">$89.000</p>

          {/* 4. NUEVO BOTÓN: Agregar al Carrito */}
          <button
            onClick={() => addToCart(kitProduct)}
            className="btn btn--primary"
            style={{
              width: '100%',
              padding: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined">shopping_cart_checkout</span>
            Agregar al carrito — $89.000
          </button>

          <p className="giftkit__trust">
            🏔️ Selección en Mendoza · Envío protegido a todo el país · Atención personal
          </p>
        </div>
      </div>
    </section>
  );
}