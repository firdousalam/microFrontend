export default function ProductsPage() {
    return (
        <main>
            <h1>📦 Product Catalog</h1>
            <p>Product Application - Running on port 3003</p>
            <p>Accessed via Shell reverse proxy at http://localhost:3000/products</p>

            <div style={{ marginTop: '2rem' }}>
                <h2>Features:</h2>
                <ul>
                    <li>Product CRUD operations</li>
                    <li>Inventory management</li>
                    <li>Product validation</li>
                    <li>Category management</li>
                </ul>
            </div>
        </main>
    )
}
