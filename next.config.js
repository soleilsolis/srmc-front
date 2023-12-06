/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },

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
