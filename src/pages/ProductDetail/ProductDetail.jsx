import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/products'; // Para traer los emojis
import './ProductDetail.css';

export default function ProductDetail() {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const API_URL = import.meta.env.VITE_API_URL || 'https://cuyo-cebado.onrender.com';
                const response = await fetch(`${API_URL}/api/products`);
                const data = await response.json();
                const found = data.find(p => p.id === productId);
                setProduct(found);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // Función para obtener el emoji de la categoría
    const getCategoryIcon = (categorySlug) => {
        const cat = categories.find(c => c.id === categorySlug);
        return cat ? cat.icon : '🧉';
    };

    if (loading) return <div className="loading-view-mafia">🧉 Preparando selección premium...</div>;
    if (!product) return <div className="loading-view-mafia">Producto no encontrado.</div>;

    return (
        <div className="product-detail-page">
            <div className="detail-container">
                <Link to="/productos" className="btn-back-detail">
                    <span className="material-symbols-outlined">arrow_back</span> Volver al catálogo
                </Link>

                <div className="detail-grid">
                    {/* IMAGEN / EMOJI */}
                    <div className="detail-visual-side">
                        <div className="main-image-box-mafia">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="img-real-detail" />
                            ) : (
                                <span className="emoji-detail-display">{getCategoryIcon(product.category)}</span>
                            )}
                        </div>
                    </div>

                    {/* INFO Y COMPRA */}
                    <div className="detail-info-side">
                        <p className="detail-tag-mafia">{product.category} | {product.material}</p>
                        <h1 className="detail-title-mafia">{product.name}</h1>

                        <div className="detail-price-box-mafia">
                            <span className="price-main">${Number(product.price).toLocaleString()}</span>
                            <span className="installments-tag">3 CUOTAS SIN INTERÉS</span>
                        </div>

                        <div className="detail-description-mafia">
                            <h3>Descripción</h3>
                            <p>{product.description || "Pieza artesanal de curaduría premium."}</p>
                        </div>

                        {/* NUEVA SECCIÓN: FICHA TÉCNICA */}
                        <div className="technical-sheet-mafia">
                            <h3>Ficha Técnica</h3>
                            <div className="specs-grid">
                                <div className="spec-row">
                                    <span>Material</span>
                                    <span>{product.material || "Artesanal"}</span>
                                </div>
                                <div className="spec-row">
                                    <span>Disponibilidad</span>
                                    <span>{product.stock > 0 ? `${product.stock} unidades` : "Agotado"}</span>
                                </div>
                                {/* Si agregas la columna 'specs' en Supabase, aparecerá aquí */}
                                {product.specs && (
                                    <div className="spec-row">
                                        <span>Detalles</span>
                                        <span>{product.specs}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {product.stock > 0 ? (
                            <div className="purchase-action-area">
                                <div className="qty-selector-mafia-detail">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                </div>
                                <button
                                    className="btn-add-to-cart-mafia"
                                    onClick={() => addToCart({ ...product, quantity })}
                                >
                                    Añadir al Carrito
                                </button>
                            </div>
                        ) : (
                            <div className="out-of-stock-notice-mafia">
                                <span className="material-symbols-outlined">event_busy</span>
                                Sin stock por el momento
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}