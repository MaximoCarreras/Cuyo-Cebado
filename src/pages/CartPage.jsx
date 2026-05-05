// Es fundamental que empiece con "export default"
export default function CartPage() {
    return (
        <div className="cart-page section" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
            <h2 className="section__title">Tu Carrito de Compras</h2>
            <p style={{ color: 'white', marginBottom: '20px' }}>
                Aquí aparecerán tus mates seleccionados.
            </p>
            <button className="btn btn--primary">
                Finalizar Compra
            </button>
        </div>
    );
}