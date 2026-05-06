/**
 * BestSellers — Grilla de productos para Cuyo Cebado.
 * Conectado al CartContext y con rutas de imagen optimizadas.
 */
import { useFeaturedProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import './BestSellers.css';

export default function BestSellers() {
  const { products, loading } = useFeaturedProducts();
  const { addToCart } = useCart();

  /* Formato de moneda para Argentina (AR$ 00.000) */
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
          <h2>Nuestros productos más vendidos</h2>
          <div className="gold-line"></div>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Cargando mates seleccionados...</p>
          </div>
        ) : (
          <div className="bestsellers__grid">
            {products.map(product => (
              <article className="product-card" key={product.id}>

                {/* Imagen del producto con GPS de ruta corregido */}
                <div className="product-card__image-wrapper">
                  <img
                    /* Lógica de ruta: 
                       Si la imagen ya tiene la ruta completa, la usa. 
                       Si no, la busca dentro de /images/ en la carpeta public.
                    */
                    src={product.image_url.startsWith('/')
                      ? product.image_url
                      : `/images/${product.image_url.split('/').pop()}`}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=Cuyo+Cebado+Mate';
                    }}
                  />

                  {product.badge && (
                    <span className="badge badge--green product-card__badge">
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
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '12px',
                      borderRadius: '50px',
                      fontWeight: 'bold'
                    }}
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    Agregar al Carrito
                  </button>

                  {/* Indicador de stock crítico */}
                  {product.stock > 0 && product.stock <= 3 && (
                    <p className="product-card__stock">
                      ⚠️ ¡Solo quedan {product.stock} unidades!
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="bestsellers__cta">
          <a href="/nosotros" className="btn btn--outline-gold">
            Conocé nuestra historia →
          </a>
        </div>
      </div>
    </section>
  );
}