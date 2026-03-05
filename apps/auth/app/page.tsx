import Link from 'next/link';

export default function Home() {
    return (
        <main>
            <h1>🔐 Auth Application</h1>
            <p>Running on port 3001</p>
            <p>This is the root page when accessing directly.</p>

            <div style={{ marginTop: '2rem' }}>
                <h3>Available Routes:</h3>
                <ul>
                    <li><Link href="/auth/login">Login</Link></li>
                    <li><Link href="/auth/register">Register</Link></li>
                    <li><Link href="/auth/logout">Logout</Link></li>
                </ul>

                <p style={{ marginTop: '1rem' }}>
                    <strong>Direct access:</strong> <a href="http://localhost:3001/auth/login">http://localhost:3001/auth/login</a>
                </p>
                <p>
                    <strong>Via Shell proxy:</strong> <a href="http://localhost:3000/auth/login">http://localhost:3000/auth/login</a>
                </p>
            </div>
        </main>
    )
}
