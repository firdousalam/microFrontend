/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/ui'],
    reactStrictMode: true,
    basePath: '/products',
    assetPrefix: '/products',
}

module.exports = nextConfig
