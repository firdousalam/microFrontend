export default function LoginPage() {
    return (
        <main>
            <h1>🔐 Login</h1>
            <p>Auth Service - Login page (Port 3001)</p>
            <p>Accessed via Shell reverse proxy at http://localhost:3000/auth/login</p>

            <div style={{
                marginTop: '2rem',
                maxWidth: '400px',
                padding: '2rem',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="user@example.com"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '0.75rem',
                            background: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Login
                    </button>
                </form>

                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Don't have an account? <a href="/auth/register">Register</a>
                </p>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px'
            }}>
                <h3>💡 Note:</h3>
                <p>This is a demo login page. In production, this would:</p>
                <ul>
                    <li>Validate credentials against a database</li>
                    <li>Generate JWT tokens</li>
                    <li>Set httpOnly cookies</li>
                    <li>Redirect to dashboard</li>
                </ul>
            </div>
        </main>
    )
}
