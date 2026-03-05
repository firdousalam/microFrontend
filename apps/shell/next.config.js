/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/ui'],
    reactStrictMode: true,

    async rewrites() {
        return [
            // Auth routes - proxy to port 3001
            {
                source: '/auth/:path*',
                destination: 'http://localhost:3001/auth/:path*',
            },
            // Dashboard routes - proxy to port 3002
            {
                source: '/dashboard/:path*',
                destination: 'http://localhost:3002/dashboard/:path*',
            },
            // Product routes - proxy to port 3003
            {
                source: '/products/:path*',
                destination: 'http://localhost:3003/products/:path*',
            },
            // Sales routes - proxy to port 3004
            {
                source: '/sales/:path*',
                destination: 'http://localhost:3004/sales/:path*',
            },
        ];
    },
}

module.exports = nextConfig
