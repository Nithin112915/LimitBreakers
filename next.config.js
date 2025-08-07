/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'limit-breakers.com'],
    unoptimized: true, // For static export compatibility
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
  // Optimize for deployment
  swcMinify: true,
  // Handle trailing slashes
  trailingSlash: false,
  // Output configuration for Netlify
  output: 'standalone',
  // Disable static optimization for problematic pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
