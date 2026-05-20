import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import './CategoryPage.css';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const { addToCart } = useCart();
    const [dbProducts, setDbProducts] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState(250000);
    const [selectedMaterial, setSelectedMaterial] = useState('todos');
    const [selectedType, setSelectedType] = useState('todos');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: pData } = await supabase.from('products').select('*').eq('category', categoryId);
            setDbProducts(pData || []);
            const { data: cData } = await supabase.from('categories').select('*').eq('id', categoryId).single();
            if (cData) setCurrentCategory(cData);
            setLoading(false);
        };
        fetchData();
        setSelectedMaterial('todos');
        setSelectedType('todos');
    }, [categoryId]);

    const filteredProducts = useMemo(() => {
        return dbProducts.filter(p => {
            return p.price <= maxPrice && 
                   (selectedMaterial === 'todos' || p.material === selectedMaterial) &&
                   (selectedType === 'todos' || p.type === selectedType);
        });
    }, [dbProducts, maxPrice, selectedMaterial, selectedType]);

    if (loading) return <div className="loading-view">Cargando la estantería...</div>;

    return (
        <div className="category-page">
            <Link to="/productos" className="btn-back"><span className="material-symbols-outlined">arrow_back</span> Volver</Link>
            
            <div className="category-page__main">
                <aside className="sidebar-mafia">
                    <h3>Filtros</h3>
                    <label>Precio: ${maxPrice.toLocaleString()}</label>
                    <input type="range" min="0" max="250000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                </aside>

                <section>
                    <h1 className="section__title">{currentCategory?.label}</h1>
                    <div className="products-grid-mafia">
                        {filteredProducts.map(product => (
                            <Link key={product.id} to={`/producto/${product.slug}`} className="product-card-link">
                                <div className="product-card">
                                    <div className="img-container">
                                        <img src={product.image_url} alt={product.name} />
                                    </div>
                                    <div className="info">
                                        <h4>{product.name}</h4>
                                        <p className="price">${Number(product.price).toLocaleString()}</p>
                                        <button className={product.stock === 0 ? 'btn-disabled' : ''} disabled={product.stock === 0} onClick={(e) => { e.preventDefault(); addToCart(product); }}>
                                            {product.stock === 0 ? 'SIN STOCK' : 'AGREGAR'}
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}