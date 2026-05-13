import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useCart } from '../../context/CartContext';
import toast, { Toaster } from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState(null); // Para la galería

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .single();

            if (!error && data) {
                setProduct(data);
                setActiveImg(data.image_url); // Ponemos la principal al inicio
            }
            setLoading(false);
        };
        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`${quantity}x ${product.name} agregado`, {
            icon: '🧉',
            style: { background: '#1a1614', color: '#a5813a', border: '1px solid #a5813a' }
        });
    };

    if (loading) return <div className="product-loading">Preparando el mate...</div>;
    if (!product) return <div className="product-not-found">Pucha, no encontramos el producto.</div>;

    // Juntamos todas las imágenes para la galería
    const allImages = [product.image_url, ...(product.extra_images || [])].filter(Boolean);

    return (
        <div className="product-detail-page">
            <Toaster position="bottom-center" />
            <div className="product-detail-container">

                {/* COLUMNA IZQUIERDA: GALERÍA INTELIGENTE */}
                <div className="product-image-section">
                    <div className="main-image-wrapper">
                        {product.badge && <span className="product-badge-premium">{product.badge}</span>}
                        <img src={activeImg || '/assets/placeholder.png'} alt={product.name} className="product-main-image" />
                    </div>

                    {allImages.length > 1 && (
                        <div className="product-thumbnails-row">
                            {allImages.map((img, i) => (
                                <div
                                    key={i}
                                    className={`thumb-box ${activeImg === img ? 'active' : ''}`}
                                    onClick={() => setActiveImg(img)}
                                >
                                    <img src={img} alt="detalle" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* COLUMNA DERECHA: Info */}
                <div className="product-info-section">
                    <div className="breadcrumbs"><Link to="/">Inicio</Link> / <span>{product.name}</span></div>
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price">${product.price.toLocaleString('es-AR')}</p>

                    <div className="product-quick-specs">
                        {product.material && <div className="spec-item"><span className="material-symbols-outlined">diamond</span><span>{product.material}</span></div>}
                        {product.type && <div className="spec-item"><span className="material-symbols-outlined">category</span><span>{product.type}</span></div>}
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="purchase-controls">
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

                    {product.video_url && (
                        <div className="product-video-section">
                            <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="btn-watch-video">
                                <span className="material-symbols-outlined">play_circle</span> Ver Reel
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}