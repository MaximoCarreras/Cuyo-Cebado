import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useCart } from '../../context/CartContext'; // <-- ACÁ IMPORTAMOS TU CARRITO
import toast, { Toaster } from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // Traemos la función para agregar al carrito
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
            }
            setLoading(false);
        };

        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        // Ejecutamos la función de tu carrito tantas veces como cantidad haya elegido el cliente
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        // Mostramos el cartelito de éxito
        toast.success(`${quantity}x ${product.name} agregado al carrito`, {
            icon: '🧉',
            style: { background: '#1a1614', color: '#a5813a', border: '1px solid #a5813a' }
        });
    };

    if (loading) return <div className="product-loading">Preparando el mate...</div>;

    if (!product) return (
        <div className="product-not-found">
            <h2>Pucha, no encontramos este producto.</h2>
            <Link to="/" className="btn-back-home">Volver al inicio</Link>
        </div>
    );

    return (
        <div className="product-detail-page">
            <Toaster position="bottom-center" />

            <div className="product-detail-container">
                {/* COLUMNA IZQUIERDA: Imagen */}
                <div className="product-image-section">
                    <div className="main-image-wrapper">
                        {product.badge && <span className="product-badge-premium">{product.badge}</span>}
                        {/* Se muestra la foto real que carga tu socio */}
                        <img src={product.image_url || '/assets/placeholder.png'} alt={product.name} className="product-main-image" />
                    </div>
                </div>

                {/* COLUMNA DERECHA: Info y Compra */}
                <div className="product-info-section">
                    <div className="breadcrumbs">
                        <Link to="/">Inicio</Link> / <span>{product.category}</span> / <span>{product.name}</span>
                    </div>

                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price">${product.price.toLocaleString('es-AR')}</p>

                    {/* Ficha Técnica Rápida */}
                    <div className="product-quick-specs">
                        {product.material && (
                            <div className="spec-item">
                                <span className="material-symbols-outlined">diamond</span>
                                <span><strong>Material:</strong> {product.material}</span>
                            </div>
                        )}
                        {product.type && (
                            <div className="spec-item">
                                <span className="material-symbols-outlined">category</span>
                                <span><strong>Tipo:</strong> {product.type}</span>
                            </div>
                        )}
                        {product.specs && (
                            <div className="spec-item">
                                <span className="material-symbols-outlined">verified</span>
                                <span><strong>Detalle:</strong> {product.specs}</span>
                            </div>
                        )}
                    </div>

                    <p className="product-description">{product.description}</p>

                    {/* Controles de Compra */}
                    <div className="purchase-controls">
                        {product.stock > 0 ? (
                            <>
                                <div className="qty-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                </div>
                                {/* El botón ahora sí dispara la función real */}
                                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                                    AGREGAR AL CARRITO
                                </button>
                            </>
                        ) : (
                            <div className="out-of-stock-alert">Sin stock por el momento</div>
                        )}
                    </div>

                    {/* Beneficios Cuyo Cebado */}
                    <div className="store-benefits">
                        <div className="benefit">
                            <span className="material-symbols-outlined">local_shipping</span>
                            <span>Envíos a todo Mendoza y el país</span>
                        </div>
                        <div className="benefit">
                            <span className="material-symbols-outlined">security</span>
                            <span>Compra 100% segura</span>
                        </div>
                    </div>

                    {/* Botón de Video (Si el socio cargó uno) */}
                    {product.video_url && (
                        <div className="product-video-section">
                            <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="btn-watch-video">
                                <span className="material-symbols-outlined">play_circle</span>
                                Ver Reel del Producto
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}