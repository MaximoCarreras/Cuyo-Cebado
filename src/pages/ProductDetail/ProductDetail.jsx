import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/products';
import './ProductDetail.css';

export default function ProductDetail() {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const [allProducts, setAllProducts] = useState([]);
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
                setAllProducts(data);
                const found = data.find(p => p.id === productId);
                setProduct(found);
            } catch (error) {
                console.error("Error cargando detalle:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return allProducts
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [allProducts, product]);

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
                    <div className="detail-visual-side">
                        <div className="main-image-box-mafia">
                            <span className="emoji-detail-display">{getCategoryIcon(product.category)}</span>
                        </div>
                    </div>

                    <div className="detail-info-side">
                        <p className="detail-tag-mafia">{product.category} | {product.material || 'Artesanal'}</p>
                        <h1 className="detail-title-mafia">{product.name}</h1>
                        <div className="detail-price-box-mafia">
                            <span className="price-main">${Number(product.price).toLocaleString()}</span>
                            <span className="installments-tag">3 CUOTAS SIN INTERÉS</span>
                        </div>
                        <div className="detail-description-mafia">
                            <h3>Descripción</h3>
                            <p>{product.description || "Pieza artesanal de curaduría premium."}</p>
                        </div>
                        <div className="technical-sheet-mafia">
                            <h3>Ficha Técnica</h3>
                            <div className="specs-grid">
                                <div className="spec-row"><span>Material</span><span>{product.material || "Artesanal"}</span></div>
                                <div className="spec-row"><span>Disponibilidad</span><span>{product.stock > 0 ? `${product.stock} unidades` : "Agotado"}</span></div>
                                {product.specs && <div className="spec-row"><span>Detalles</span><span>{product.specs}</span></div>}
                            </div>
                        </div>

                        {product.stock > 0 ? (
                            <div className="purchase-action-area">
                                <div className="qty-selector-mafia-detail">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                </div>
                                <button className="btn-add-to-cart-mafia" onClick={() => addToCart({ ...product, quantity })}>
                                    Añadir al Carrito
                                </button>
                            </div>
                        ) : (
                            <div className="out-of-stock-notice-mafia">Sin stock por el momento</div>
                        )}
                    </div>
                </div>

                {/* PRODUCTOS RELACIONADOS */}
                {relatedProducts.length > 0 && (
                    <div className="related-section-mafia">
                        <h2 className="related-title-mafia">También te puede interesar</h2>
                        <div className="related-grid-mafia">
                            {relatedProducts.map(rp => (
                                <Link key={rp.id} to={`/producto/${rp.id}`} className="related-card-mafia">
                                    <div className="related-img-box">
                                        <span>{getCategoryIcon(rp.category)}</span>
                                    </div>
                                    <div className="related-info">
                                        <h4>{rp.name}</h4>
                                        <p>${Number(rp.price).toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}