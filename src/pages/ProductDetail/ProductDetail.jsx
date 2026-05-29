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

    const waLink = `https://wa.me/5492612307516?text=Hola! Me interesa el ${product?.name} que vi en la web.`;

    if (loading) return <div className="product-loading">Preparando el mate...</div>;
    if (!product) return <div className="product-not-found">Pucha, no lo encontramos.</div>;

    const allImages = [product.image_url, ...(product.extra_images || [])].filter(Boolean);

    return (
        <div className="product-detail-page fade-in">
            <Toaster position="bottom-center" />
            <div className="product-detail-container">
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

                    {/* LA MAGIA DEL STICKY BUTTON OCURRE ACÁ ABAJO CON LA CLASE .mobile-sticky */}
                    <div className="purchase-controls mobile-sticky">
                        {product.stock > 0 ? (
                            <>
                                <div className="qty-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                </div>
                                <button className="btn-add-to-cart" onClick={handleAddToCart}>AGREGAR AL CARRITO</button>
                            </>
                        ) : <div className="out-of-stock-alert">Sin stock por el momento</div>}
                    </div>

                    <div className="action-links-row">
                        <a href={waLink} target="_blank" rel="noreferrer" className="btn-wa-smart">
                            <span className="material-symbols-outlined">chat</span> CONSULTAR POR WHATSAPP
                        </a>
                        {product.video_url && (
                            <a href={product.video_url} target="_blank" rel="noreferrer" className="btn-watch-video">
                                <span className="material-symbols-outlined">play_circle</span> VER VIDEO
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="related-products-section">
                    <h3 className="section-title-premium">TAMBIÉN TE PODRÍA GUSTAR</h3>
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