/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'limit-breakers.com'],
    unoptimized: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
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
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverComponentsExternalPackages: ['mongoose'],
  },
}

module.exports = nextConfig
