import { getProducts, getSalesStats, formatPrice } from '@/lib/api';

export default async function DashboardPage() {
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
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px'
            }}>
                <h2>💡 Data Sharing Demo</h2>
                <p>This page fetches data from Product and Sales services via API calls.</p>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <h2>📦 Product Summary</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <a
                        href="/products"
                        style={{
                            flex: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '1rem',
                            background: '#f0f9ff',
                            borderRadius: '8px',
                            display: 'block'
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Total Products</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {products.length}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#0070f3', marginTop: '0.5rem' }}>
                            Click to view →
                        </p>
                    </a>
                    <div style={{ flex: 1, padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Total Stock Value</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {formatPrice(products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0))}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <h2>💰 Sales Summary</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    <a
                        href="/sales"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '1rem',
                            background: '#f0fdf4',
                            borderRadius: '8px',
                            display: 'block'
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Total Orders</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {salesStats.totalOrders}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem' }}>
                            Click to view →
                        </p>
                    </a>
                    <a
                        href="/sales"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '1rem',
                            background: '#fef3c7',
                            borderRadius: '8px',
                            display: 'block'
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Completed</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {salesStats.completedOrders}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.5rem' }}>
                            Click to view →
                        </p>
                    </a>
                    <a
                        href="/sales"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '1rem',
                            background: '#fee2e2',
                            borderRadius: '8px',
                            display: 'block'
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Pending</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {salesStats.pendingOrders}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>
                            Click to view →
                        </p>
                    </a>
                    <a
                        href="/sales"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '1rem',
                            background: '#e0e7ff',
                            borderRadius: '8px',
                            display: 'block'
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Total Revenue</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {formatPrice(salesStats.totalRevenue)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#0070f3', marginTop: '0.5rem' }}>
                            Click to view →
                        </p>
                    </a>
                    <a
                        href="/sales"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '1rem',
                            background: '#f3e8ff',
                            borderRadius: '8px',
                            display: 'block'
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>Avg Order Value</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {formatPrice(salesStats.averageOrderValue)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9333ea', marginTop: '0.5rem' }}>
                            Click to view →
                        </p>
                    </a>
                </div>
            </div>
        </main>
    );
}
