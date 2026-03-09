/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/ui'],
    reactStrictMode: true,

    async rewrites() {
        // Only enable rewrites in development
        if (process.env.NODE_ENV === 'development') {
            return {
                beforeFiles: [
                    // Sales _next assets (must be first to catch /sales/_next/...)
                    {
                        source: '/sales/_next/:path*',
                        destination: 'http://localhost:3004/sales/_next/:path*',
                    },
                    // Products _next assets
                    {
                        source: '/products/_next/:path*',
                        destination: 'http://localhost:3003/products/_next/:path*',
                    },
                    // Dashboard _next assets
                    {
                        source: '/dashboard/_next/:path*',
                        destination: 'http://localhost:3002/dashboard/_next/:path*',
                    },
                    // Auth _next assets
                    {
                        source: '/auth/_next/:path*',
                        destination: 'http://localhost:3001/auth/_next/:path*',
                    },
                ],
                afterFiles: [
                    // Auth routes - proxy to port 3001
                    {
                        source: '/auth',
                        destination: 'http://localhost:3001/auth',
                    },
                    {
                        source: '/auth/:path*',
                        destination: 'http://localhost:3001/auth/:path*',
                    },
                    // Dashboard routes - proxy to port 3002
                    {
                        source: '/dashboard',
                        destination: 'http://localhost:3002/dashboard',
                    },
                    {
                        source: '/dashboard/:path*',
                        destination: 'http://localhost:3002/dashboard/:path*',
                    },
                    // Product routes - proxy to port 3003
                    {
                        source: '/products',
                        destination: 'http://localhost:3003/products',
                    },
                    {
                        source: '/products/:path*',
                        destination: 'http://localhost:3003/products/:path*',
                    },
                    // Sales routes - proxy to port 3004
                    {
                        source: '/sales',
                        destination: 'http://localhost:3004/sales',
                    },
                    {
                        source: '/sales/:path*',
                        destination: 'http://localhost:3004/sales/:path*',
                    },
                ],
            };
        }

        // In production, return empty rewrites (or configure with production URLs)
        return {
            beforeFiles: [],
            afterFiles: [],
        };
    },
}

module.exports = nextConfig
