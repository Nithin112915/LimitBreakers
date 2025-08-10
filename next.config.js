/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'limit-breakers.com', 'limitbreakers-app.netlify.app'],
    unoptimized: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverComponentsExternalPackages: ['mongoose'],
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/downloads/:path*',
        destination: '/api/downloads/:path*',
      },
    ]
  },
}

module.exports = nextConfig
