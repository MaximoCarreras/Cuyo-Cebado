/**
 * BestSellers — Grilla de productos para Cuyo Cebado.
 * Reintegra la funcionalidad de agregar al carrito para el modelo híbrido.
 */
import { useFeaturedProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext'; // Importamos el contexto del carrito
import './BestSellers.css';

export default function BestSellers() {
  const { products, loading } = useFeaturedProducts();
  const { addToCart } = useCart(); // Traemos la función para sumar productos

  /* Formato de moneda para Argentina */
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
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
            Cargando productos...
          </p>
        ) : (
          <div className="bestsellers__grid">
            {products.map(product => (
              <article className="product-card" key={product.id}>
                {/* Imagen del producto */}
                <div className="product-card__image-wrapper">
                  <img
                    /* Si la imagen no carga, usamos un placeholder para que no quede el hueco vacío */
                    src={product.image_url || '/placeholder-mate.jpg'}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Cuyo+Cebado'; }}
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

                  {/* CAMBIO CLAVE: Botón de agregar al carrito en lugar de consulta directa */}
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
                      cursor: 'pointer'
                    }}
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Agregar al Carrito
                  </button>

                  {/* Indicador de escasez */}
                  {product.stock > 0 && product.stock <= 3 && (
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
          <a href="/nosotros" className="btn btn--outline-gold">
            Conocé nuestra historia →
          </a>
        </div>
      </div>
    </section>
  );
}