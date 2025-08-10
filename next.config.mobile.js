/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // No static export for mobile build - keep dynamic for API routes
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/mobile' : '',
  env: {
    CUSTOM_KEY: 'mobile-app',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
