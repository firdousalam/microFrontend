export default function LogoutPage() {
    return (
        <main>
            <h1>👋 Logout</h1>
            <p>Auth Service - Logout page (Port 3001)</p>
            <p>Accessed via Shell reverse proxy at http://localhost:3000/auth/logout</p>

            <div style={{
                marginTop: '2rem',
                maxWidth: '400px',
                padding: '2rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '3rem', margin: '1rem 0' }}>👋</p>
                <h2>You have been logged out</h2>
                <p style={{ marginTop: '1rem', color: '#666' }}>
                    Thank you for using our platform!
                </p>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <a
                        href="/auth/login"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#0070f3',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Login Again
                    </a>
                    <a
                        href="/"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#f5f5f5',
                            color: '#333',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Go Home
                    </a>
                </div>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px'
            }}>
                <h3>💡 Note:</h3>
                <p>This is a demo logout page. In production, this would:</p>
                <ul>
                    <li>Clear authentication cookies</li>
                    <li>Invalidate JWT tokens</li>
                    <li>Clear session data</li>
                    <li>Redirect to login page</li>
                </ul>
            </div>
        </main>
    )
}
