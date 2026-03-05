export default function Home() {
    return (
        <div>
            <h1>🚀 Micro-Frontend Platform</h1>
            <p>Welcome to the Shell Application - Your unified entry point (Port 3000)</p>

            <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>
                <h2>How It Works:</h2>
                <p>
                    The Shell acts as a <strong>reverse proxy</strong>, routing requests to different
                    micro-frontend services. All services are accessible through port 3000.
                </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>Available Services:</h2>
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>🔐 Auth Service</h3>
                        <p>User authentication and authorization</p>
                        <p><strong>Direct:</strong> http://localhost:3001</p>
                        <p><strong>Via Shell:</strong> <a href="/auth/login">http://localhost:3000/auth/login</a></p>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>📊 Dashboard Service</h3>
                        <p>Analytics and business intelligence</p>
                        <p><strong>Direct:</strong> http://localhost:3002</p>
                        <p><strong>Via Shell:</strong> <a href="/dashboard">http://localhost:3000/dashboard</a></p>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>📦 Product Service</h3>
                        <p>Product catalog management</p>
                        <p><strong>Direct:</strong> http://localhost:3003</p>
                        <p><strong>Via Shell:</strong> <a href="/products">http://localhost:3000/products</a></p>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>💰 Sales Service</h3>
                        <p>Order and transaction management</p>
                        <p><strong>Direct:</strong> http://localhost:3004</p>
                        <p><strong>Via Shell:</strong> <a href="/sales">http://localhost:3000/sales</a></p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
                <h3>💡 Benefits of Reverse Proxy:</h3>
                <ul>
                    <li>Single entry point - only access port 3000</li>
                    <li>Unified domain - no CORS issues</li>
                    <li>Seamless navigation between services</li>
                    <li>Shared authentication cookies</li>
                    <li>Production-ready architecture</li>
                </ul>
            </div>
        </div>
    )
}
