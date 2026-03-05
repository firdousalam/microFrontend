import Link from 'next/link';

export default function Home() {
    return (
        <main>
            <h1>📊 Dashboard Application</h1>
            <p>Running on port 3002</p>
            <p>This is the root page when accessing directly.</p>

            <div style={{ marginTop: '2rem' }}>
                <p>
                    <strong>Direct access:</strong> <a href="http://localhost:3002/dashboard">http://localhost:3002/dashboard</a>
                </p>
                <p>
                    <strong>Via Shell proxy:</strong> <a href="http://localhost:3000/dashboard">http://localhost:3000/dashboard</a>
                </p>
                <p style={{ marginTop: '1rem' }}>
                    <Link href="/dashboard">→ Go to Dashboard</Link>
                </p>
            </div>
        </main>
    )
}
