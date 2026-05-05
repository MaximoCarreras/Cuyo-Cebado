/**
 * BestSellers — Grilla de productos para Cuyo Cebado.
 * Se reemplazó el carrito por contacto directo por WhatsApp.
 */
import { useFeaturedProducts } from '../../hooks/useProducts';
import './BestSellers.css';

export default function BestSellers() {
  const { products, loading } = useFeaturedProducts();

  /* Formatear precio a moneda ARS */
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
                {/* Imagen del producto */}
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

                {/* Info del producto */}
                <div className="product-card__info">
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__description">{product.description}</p>
                  <p className="product-card__price">{formatPrice(product.price)}</p>

                  {/* Botón de consulta directa por WhatsApp */}
                  <a 
                    href={`https://wa.me/5492625597956?text=Hola!%20Me%20interesa%20consultar%20por%20el%20${encodeURIComponent(product.name)}%20que%20vi%20en%20la%20web.`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--primary product-card__btn"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <span className="material-symbols-outlined">chat</span>
                    Consultar por WhatsApp
                  </a>

                  {/* Indicador de stock (opcional, solo si hay poco) */}
                  {product.stock > 0 && product.stock <= 3 && (
                    <p className="product-card__stock">
                      ¡Últimas unidades!
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="bestsellers__cta">
          <a href="https://wa.me/5492625597956" className="btn btn--outline-gold">
            Consultar catálogo completo →
          </a>
        </div>
      </div>
    </section>
  );
}
