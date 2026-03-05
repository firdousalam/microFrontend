import Link from 'next/link';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <nav style={{
                    padding: '1rem',
                    background: '#f5f5f5',
                    borderBottom: '2px solid #ddd',
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center'
                }}>
                    <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        🏠 Shell
                    </Link>
                    <Link href="/auth/login">🔐 Auth</Link>
                    <Link href="/dashboard">📊 Dashboard</Link>
                    <Link href="/products">📦 Products</Link>
                    <Link href="/sales">💰 Sales</Link>
                </nav>
                <main style={{ padding: '2rem' }}>
                    {children}
                </main>
            </body>
        </html>
    )
}
