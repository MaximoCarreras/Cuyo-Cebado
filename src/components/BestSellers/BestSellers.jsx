import { useFeaturedProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import './BestSellers.css';

export default function BestSellers() {
  const { products, loading } = useFeaturedProducts();
  const { addToCart } = useCart();

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

        {/* Título unificado */}
        <div className="section__title bestsellers__header">
          <h2>Nuestros productos más vendidos</h2>
          <div className="gold-line"></div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '50px' }}>Cargando mates seleccionados...</p>
        ) : (
          <div className="bestsellers__grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>

                {/* Contenedor de la Imagen y el Badge */}
                <div className="product-card__image-wrapper">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                  />

                  {/* Etiqueta "Más vendido". Solo se muestra si product.badge existe y tiene contenido */}
                  {product.badge && product.badge.trim() !== '' && (
                    <span className="product-card__badge">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="product-card__info">
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__description">{product.description}</p>
                  <p className="product-card__price">{formatPrice(product.price)}</p>

                  <button
                    onClick={() => addToCart(product)}
                    className="btn btn--primary product-card__btn"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    Agregar al Carrito
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}