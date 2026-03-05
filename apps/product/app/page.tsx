import Link from 'next/link';

export default function Home() {
    return (
        <main>
            <h1>📦 Product Application</h1>
            <p>Running on port 3003</p>
            <p>This is the root page when accessing directly.</p>

            <div style={{ marginTop: '2rem' }}>
                <p>
                    <strong>Direct access:</strong> <a href="http://localhost:3003/products">http://localhost:3003/products</a>
                </p>
                <p>
                    <strong>Via Shell proxy:</strong> <a href="http://localhost:3000/products">http://localhost:3000/products</a>
                </p>
                <p style={{ marginTop: '1rem' }}>
                    <Link href="/products">→ Go to Products</Link>
                </p>
            </div>
        </main>
    )
}
