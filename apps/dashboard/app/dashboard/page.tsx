export default function DashboardPage() {
    return (
        <main>
            <h1>📊 Analytics Dashboard</h1>
            <p>Dashboard Application - Running on port 3002</p>
            <p>Accessed via Shell reverse proxy at http://localhost:3000/dashboard</p>

            <div style={{ marginTop: '2rem' }}>
                <h2>Features:</h2>
                <ul>
                    <li>Total products overview</li>
                    <li>Sales metrics</li>
                    <li>Revenue calculations</li>
                    <li>Data visualization</li>
                </ul>
            </div>
        </main>
    )
}
