/**
 * BestSellers — Product grid showing featured products from Supabase.
 * Displays stock availability, badges, and add-to-cart functionality. [SF]
 */
import { useFeaturedProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import './BestSellers.css';

export default function BestSellers() {
  const { products, loading } = useFeaturedProducts();
  const { addItem } = useCart();

  /* Format price to ARS currency [SF] */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="bestsellers section" id="productos">
      <div className="section__container">
        <div className="section__title">
          <h2>Nuestros más vendidos</h2>
          <div className="gold-line"></div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
            Cargando productos...
          </p>
        ) : (
          <div className="bestsellers__grid">
            {products.map(product => (
              <article className="product-card" key={product.id}>
                {/* Product image with badge overlay */}
                <div className="product-card__image-wrapper">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                  />
                  {product.badge && (
                    <span className="badge badge--green product-card__badge">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product info */}
                <div className="product-card__info">
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__description">{product.description}</p>
                  <p className="product-card__price">{formatPrice(product.price)}</p>

                  {/* Stock-aware add to cart button */}
                  {product.stock > 0 ? (
                    <button
                      className="btn btn--primary product-card__btn"
                      onClick={() => addItem(product)}
                    >
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                      Agregar al carrito
                    </button>
                  ) : (
                    <button className="btn btn--primary btn--disabled product-card__btn">
                      Sin stock
                    </button>
                  )}

                  {/* Stock indicator */}
                  {product.stock > 0 && product.stock <= 5 && (
                    <p className="product-card__stock">
                      ¡Últimas {product.stock} unidades!
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="bestsellers__cta">
          <a href="#categorias" className="btn btn--outline-gold">
            Ver todos los productos →
          </a>
        </div>
      </div>
    </section>
  );
}
