/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: '/landing',
                destination: '/index.html',
            },
        ]
    },
}

module.exports = nextConfig
