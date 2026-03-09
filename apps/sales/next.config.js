/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/ui'],
    reactStrictMode: true,
    basePath: '/sales',
    assetPrefix: '/sales',
}

module.exports = nextConfig
