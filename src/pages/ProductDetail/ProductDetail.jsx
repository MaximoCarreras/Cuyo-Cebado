import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGlobalCatalog } from '../../lib/catalogStore'; // 🔥 ACÁ IMPORTAMOS EL CEREBRO
import { useCart } from '../../context/CartContext';
import toast, { Toaster } from 'react-hot-toast';
import './ProductDetail.css';

// IMPORTAMOS EL COMPONENTE DE RESEÑAS
import ProductReviews from '../../components/ProductReviews/ProductReviews'; 

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState(null);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            
            // 🔥 MAGIA: Pedimos el catálogo global a la memoria
            const { products } = await getGlobalCatalog();
            
            // Buscamos nuestro producto específico
            const currentProduct = products.find(p => p.slug === slug);
            
            if (currentProduct) {
                setProduct(currentProduct);
                setActiveImg(currentProduct.image_url);

                // Calculamos los productos relacionados al instante
                const relData = products
                    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
                    .slice(0, 4);
                setRelated(relData);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success("Agregado al carrito 🧉");
    };

    // Mensajes dinámicos para WhatsApp dependiendo del stock
    const waLinkStock = `https://wa.me/5492612307516?text=Hola! Tengo una duda sobre el ${product?.name} que vi en la web.`;
    const waLinkNoStock = `https://wa.me/5492612307516?text=Hola! Quería consultar cuándo vuelve a ingresar el ${product?.name} o si lo puedo encargar.`;

    if (loading) return <div className="product-loading">Preparando el mate...</div>;
    if (!product) return <div className="product-not-found">No encontramos este producto.</div>;

    const allImages = [product.image_url, ...(product.extra_images || [])].filter(Boolean);

    // TU DISEÑO INTACTO DESDE ACÁ PARA ABAJO
    return (
        <div className="product-detail-page fade-in">
            <Toaster position="bottom-center" />
            
            {/* NAVEGACIÓN SUPERIOR */}
            <div className="product-page-top-nav">
                <button onClick={() => navigate(-1)} className="btn-back-product">
                    <span className="material-symbols-outlined">arrow_back</span> Volver
                </button>
                <span className="breadcrumbs-path">
                    <span className="divider">|</span>
                    <Link to="/">Inicio</Link> / <span>{product.name}</span>
                </span>
            </div>

            <div className="product-detail-container">
                
                {/* LADO IZQUIERDO: GALERÍA */}
                <div className="product-image-section">
                    <div className="main-image-wrapper">
                        {product.badge && <span className="product-badge-premium">{product.badge}</span>}
                        <img src={activeImg || '/assets/placeholder.png'} alt={product.name} className="product-main-image" />
                    </div>
                    {allImages.length > 1 && (
                        <div className="product-thumbnails-row">
                            {allImages.map((img, i) => (
                                <div key={i} className={`thumb-box ${activeImg === img ? 'active' : ''}`} onClick={() => setActiveImg(img)}>
                                    <img src={img} alt="detalle" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* LADO DERECHO: INFO Y COMPRA */}
                <div className="product-info-section">
                    
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price">${product.price.toLocaleString('es-AR')}</p>

                    <div className="product-quick-specs">
                        {product.material && product.material.split(',').map((mat, index) => (
                            <div key={index} className="spec-item-elegant">
                                {mat.trim()}
                            </div>
                        ))}
                        {product.type && <div className="spec-item-elegant">{product.type}</div>}
                    </div>

                    <p className="product-description">{product.description}</p>

                    {product.specs && (
                        <div className="detailed-specs-box">
                            <h4>DETALLES TÉCNICOS</h4>
                            <p>{product.specs}</p>
                        </div>
                    )}

                    <div className="purchase-block">
                        {product.stock > 0 ? (
                            <>
                                <div className="purchase-controls mobile-sticky">
                                    <div className="qty-selector">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                    </div>
                                    <button className="btn-add-to-cart" onClick={handleAddToCart}>AGREGAR AL CARRITO</button>
                                </div>
                                
                                <div className="secondary-actions">
                                    <a href={waLinkStock} target="_blank" rel="noreferrer" className="link-subtle">
                                        ¿Tenés dudas? Consultanos
                                    </a>
                                    {product.video_url && (
                                        <a href={product.video_url} target="_blank" rel="noreferrer" className="link-subtle">
                                            Ver video del producto
                                        </a>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="out-of-stock-alert">
                                    Este producto se encuentra temporalmente agotado.
                                </div>
                                <div className="purchase-controls mobile-sticky">
                                    <a href={waLinkNoStock} target="_blank" rel="noreferrer" className="btn-notify-stock">
                                        <span className="material-symbols-outlined">notifications_active</span>
                                        AVISARME CUANDO INGRESE
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ACÁ INSERTAMOS LAS RESEÑAS */}
            <ProductReviews productSlug={slug} />

            {/* PRODUCTOS RELACIONADOS */}
            {related.length > 0 && (
                <section className="related-products-section">
                    <h3 className="section-title-premium">COMPLEMENTÁ TU RITUAL</h3>
                    <div className="related-grid">
                        {related.map(r => (
                            <Link key={r.id} to={`/producto/${r.slug}`} className="related-card">
                                <div className="related-img-box">
                                    <img src={r.image_url} alt={r.name} />
                                </div>
                                <h5>{r.name}</h5>
                                <p>${r.price.toLocaleString()}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}