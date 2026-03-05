export default function SalesPage() {
    return (
        <main>
            <h1>💰 Sales Management</h1>
            <p>Sales Application - Running on port 3004</p>
            <p>Accessed via Shell reverse proxy at http://localhost:3000/sales</p>

            <div style={{ marginTop: '2rem' }}>
                <h2>Features:</h2>
                <ul>
                    <li>Order creation</li>
                    <li>Order status tracking</li>
                    <li>Revenue calculation</li>
                    <li>Invoice generation</li>
                </ul>
            </div>
        </main>
    )
}
