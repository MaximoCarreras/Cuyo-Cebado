/**
 * GiftKit — Sección de Kit de Regalo Premium.
 */
import { useCart } from '../../context/CartContext';
import kitImage from '../../assets/kit_regalo.png';
import './GiftKit.css';

export default function GiftKit() {
  const { addToCart } = useCart();

  const kitProduct = {
    id: 'kit-regalo-premium',
    name: 'Kit Regalo Premium',
    price: 89000,
    image_url: kitImage,
    stock: 10
  };

  return (
    <section className="giftkit section" id="kit-regalo">
      <div className="giftkit__container section__container">

        {/* Izquierda — Imagen con insignia */}
        <div className="giftkit__image-wrapper">
          <img src={kitImage} alt="Kit Regalo Premium Cuyo Cebado" loading="lazy" />
          <span className="giftkit__badge">La opción más elegida</span>
        </div>

        {/* Derecha — Detalles del producto */}
        <div className="giftkit__content">
          <h2 className="giftkit__title">
            El regalo perfecto para el verdadero matero
          </h2>

          {/* Lista de ítems incluidos */}
          <ul className="giftkit__items">
            <li>
              <span className="material-symbols-outlined">done</span>
              Mate de madera noble seleccionado
            </li>
            <li>
              <span className="material-symbols-outlined">done</span>
              Bombilla de alpaca o acero premium
            </li>
            <li>
              <span className="material-symbols-outlined">done</span>
              Caja artesanal de madera
            </li>
            <li>
              <span className="material-symbols-outlined">done</span>
              Guía de curado y cuidado paso a paso
            </li>
          </ul>

          <p className="giftkit__price">$ 89.000</p>

          {/* Botón Premium igual al de los productos (Sin la leyenda abajo) */}
          <button
            onClick={() => addToCart(kitProduct)}
            className="btn btn--gold giftkit__btn"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  );
}