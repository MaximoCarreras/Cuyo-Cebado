/**
 * GiftKit — Featured gift product section with two columns.
 * Left: large image with badge. Right: details + CTA. [SF]
 */
import { useCart } from '../../context/CartContext';
import kitImage from '../../assets/kit_regalo.png';
import './GiftKit.css';

/* Kit product data — single product highlight [CMV] */
const KIT_PRODUCT = {
  id: 'kit-premium',
  name: 'Kit Regalo Premium',
  slug: 'kit-regalo-premium',
  price: 89000,
  image_url: kitImage,
  stock: 5,
  category: 'kit',
};

export default function GiftKit() {
  const { addItem } = useCart();

  return (
    <section className="giftkit section" id="kit-regalo">
      <div className="giftkit__container section__container">
        {/* Left — Image */}
        <div className="giftkit__image-wrapper">
          <img src={kitImage} alt="Kit Regalo Premium Mates Mendoza" loading="lazy" />
          <span className="badge badge--gold giftkit__badge">Opción más regalada</span>
        </div>

        {/* Right — Product details */}
        <div className="giftkit__content">
          <h2 className="giftkit__title">
            El regalo perfecto para el verdadero matero
          </h2>

          {/* Items included list */}
          <ul className="giftkit__items">
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Mate lapacho tallado a mano
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Bombilla de alpaca premium
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Yerba orgánica 500g
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Caja de madera artesanal
            </li>
          </ul>

          <p className="giftkit__price">$89.000</p>

          <button
            className="btn btn--primary"
            onClick={() => addItem(KIT_PRODUCT)}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Comprar kit ahora
          </button>

          <p className="giftkit__trust">
            🔒 Pago seguro · Envío en 48hs · Devolución sin preguntas
          </p>
        </div>
      </div>
    </section>
  );
}
