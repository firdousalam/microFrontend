import { getProducts, getSalesStats, formatPrice } from '@/lib/api';

export default async function DashboardPage() {
    // Fetch data from other services via API calls
    // This demonstrates cross-service communication
    const products = await getProducts();
    const salesStats = await getSalesStats();

    return (
        <main>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <a
                        href="/products"
                        style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        📦 Products
                    </a>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <a
                        href="/sales"
                        style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        💰 Sales
                    </a>
                </div>
                <h1>📊 Analytics Dashboard</h1>
                <p>Dashboard Application - Running on port 3002</p>
                <p>Accessed via Shell reverse proxy at http://localhost:3000/dashboard</p>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px'
            }}>
                <h2>💡 Data Sharing Demo</h2>
                <p>This page fetches data from Product and Sales services via API calls.</p>
                <p>Check <code>apps/dashboard/lib/api.ts</code> to see the implementation.</p>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <h2>📦 Product Summary (from Product Service)</h2>
                <p><strong>Total Products:</strong> {products.length}</p>
                <p><strong>Total Stock Value:</strong> {formatPrice(
                    products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0)
                )}</p>

                <div style={{ marginTop: '1rem' }}>
                    <h3>Product List:</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd' }}>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Price</th>
                                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Stock</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any) => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem' }}>{product.name}</td>
                                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                        {formatPrice(product.price)}
                                    </td>
                                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                        {product.stock}
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>{product.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <h2>💰 Sales Summary (from Sales Service)</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Total Orders</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {salesStats.totalOrders}
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Completed</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {salesStats.completedOrders}
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Pending</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {salesStats.pendingOrders}
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: '#e0e7ff', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Total Revenue</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {formatPrice(salesStats.totalRevenue)}
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: '#f3e8ff', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Avg Order Value</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {formatPrice(salesStats.averageOrderValue)}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#fef3c7',
                borderRadius: '8px'
            }}>
                <h3>🔍 How This Works:</h3>
                <ol style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
                    <li>Dashboard service calls <code>getProducts()</code> → fetches from Product API</li>
                    <li>Dashboard service calls <code>getSalesStats()</code> → fetches from Sales API</li>
                    <li>Data is aggregated and displayed on this page</li>
                    <li>Services remain independent - they don't know about each other</li>
                </ol>
                <p style={{ marginTop: '1rem' }}>
                    See <code>document/DataSharing.md</code> for more patterns!
                </p>
            </div>
        </main>
    );
}
