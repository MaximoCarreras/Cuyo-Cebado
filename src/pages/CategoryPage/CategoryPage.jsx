import { useParams } from 'react-router-dom';

export default function CategoryPage() {
    const { categoryId } = useParams();

    return (
        <div style={{ padding: '150px 20px', textAlign: 'center' }}>
            <h2 style={{ textTransform: 'uppercase', color: '#2b2520' }}>
                Estás en la categoría: {categoryId}
            </h2>
            <p>Próximamente: Filtros y productos de {categoryId}.</p>
        </div>
    );
}