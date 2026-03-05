import Link from 'next/link';

export default function Home() {
    return (
        <main>
            <h1>💰 Sales Application</h1>
            <p>Running on port 3004</p>
            <p>This is the root page when accessing directly.</p>

            <div style={{ marginTop: '2rem' }}>
                <p>
                    <strong>Direct access:</strong> <a href="http://localhost:3004/sales">http://localhost:3004/sales</a>
                </p>
                <p>
                    <strong>Via Shell proxy:</strong> <a href="http://localhost:3000/sales">http://localhost:3000/sales</a>
                </p>
                <p style={{ marginTop: '1rem' }}>
                    <Link href="/sales">→ Go to Sales</Link>
                </p>
            </div>
        </main>
    )
}
