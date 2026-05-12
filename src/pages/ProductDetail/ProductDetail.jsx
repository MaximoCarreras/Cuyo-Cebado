import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const API_URL = import.meta.env.VITE_API_URL || 'https://cuyo-cebado.onrender.com';
                const response = await fetch(`${API_URL}/api/products`);
                const data = await response.json();

                // Buscamos el producto específico por ID
                const found = data.find(p => p.id === productId);
                if (found) {
                    setProduct(found);
                    // Si tienes un array de imágenes, usamos la primera. Si no, la image_url básica.
                    setMainImage(found.image_url || found.images?.[0]);
                }
            } catch (error) {
                console.error("Error cargando detalle:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return <div className="loading-mafia">Cargando pieza exclusiva...</div>;
    if (!product) return <div className="error-mafia">Producto no encontrado.</div>;

    return (
        <div className="product-detail-page">
            <div className="detail-container">
                <Link to="/productos" className="btn-back-detail">
                    <span className="material-symbols-outlined">arrow_back</span> Volver al catálogo
                </Link>

                <div className="detail-grid">
                    {/* GALERÍA ESTILO MERCADO LIBRE */}
                    <div className="gallery-side">
                        <div className="thumbnails">
                            {/* Aquí mapearías tu array de imágenes de Supabase */}
                            {[product.image_url, ...(product.images || [])].map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt=""
                                    className={mainImage === img ? 'active-thumb' : ''}
                                    onClick={() => setMainImage(img)}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            ))}
                        </div>
                        <div className="main-image-box">
                            {mainImage ? (
                                <img src={mainImage} alt={product.name} />
                            ) : (
                                <span className="emoji-detail">🧉</span>
                            )}
                        </div>
                    </div>

                    {/* INFORMACIÓN Y COMPRA */}
                    <div className="info-side">
                        <span className="detail-category">{product.category} | {product.material}</span>
                        <h1 className="detail-title">{product.name}</h1>

                        <div className="detail-price-box">
                            <span className="current-price">${Number(product.price).toLocaleString()}</span>
                            <p className="payment-note">Hasta 3 cuotas sin interés</p>
                        </div>

                        <div className="detail-description">
                            <h3>Descripción</h3>
                            <p>{product.description || "Pieza artesanal de curaduría premium. Cada detalle ha sido trabajado a mano por maestros artesanos de Mendoza."}</p>
                        </div>

                        <div className="detail-specs">
                            <div className="spec-item"><strong>Material:</strong> {product.material}</div>
                            <div className="spec-item"><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} unidades` : "Agotado temporalmente"}</div>
                        </div>

                        {product.stock > 0 && (
                            <div className="purchase-zone">
                                <div className="qty-selector-detail">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                </div>
                                <button
                                    className="btn-add-detail"
                                    onClick={() => addToCart({ ...product, quantity })}
                                >
                                    Añadir al carrito
                                </button>
                            </div>
                        )}

                        {product.stock === 0 && (
                            <div className="no-stock-notice">
                                <span className="material-symbols-outlined">info</span>
                                Próximamente disponible. ¡Unite al club para recibir el aviso!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}