import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useCart } from '../../context/CartContext';
import toast, { Toaster } from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState(null);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
            if (!error && data) {
                setProduct(data);
                setActiveImg(data.image_url);

                const { data: relData } = await supabase.from('products')
                    .select('*')
                    .eq('category', data.category)
                    .neq('id', data.id)
                    .limit(4);
                setRelated(relData || []);
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

    return (
        <div className="product-detail-page fade-in">
            <Toaster position="bottom-center" />
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
                    <div className="breadcrumbs"><Link to="/">Inicio</Link> / <span>{product.name}</span></div>
                    
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price">${product.price.toLocaleString('es-AR')}</p>

                    <div className="product-quick-specs">
                        {product.material && <div className="spec-item"><span className="material-symbols-outlined">diamond</span><span>{product.material}</span></div>}
                        {product.type && <div className="spec-item"><span className="material-symbols-outlined">category</span><span>{product.type}</span></div>}
                    </div>

                    <p className="product-description">{product.description}</p>

                    {product.specs && (
                        <div className="detailed-specs-box">
                            <h4>DETALLES TÉCNICOS</h4>
                            <p>{product.specs}</p>
                        </div>
                    )}

                    {/* BLOQUE DE COMPRA PRINCIPAL */}
                    <div className="purchase-block">
                        {product.stock > 0 ? (
                            <>
                                {/* SI HAY STOCK: Carrito protagonista */}
                                <div className="purchase-controls mobile-sticky">
                                    <div className="qty-selector">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                    </div>
                                    <button className="btn-add-to-cart" onClick={handleAddToCart}>AGREGAR AL CARRITO</button>
                                </div>
                                
                                {/* Links secundarios discretos */}
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
                                {/* SI NO HAY STOCK: Aviso y botón a WhatsApp */}
                                <div className="out-of-stock-alert">
                                    Este producto se encuentra temporalmente agotado.
                                </div>
                                <a href={waLinkNoStock} target="_blank" rel="noreferrer" className="btn-notify-stock mobile-sticky">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                    AVISARME CUANDO INGRESE
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>

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