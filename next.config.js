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
                destination: '/landing.html',
            },
        ]
    },
}

module.exports = nextConfig
