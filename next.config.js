/** @type {import('next').NextConfig} */
const nextConfig = {
  // Conditionally set output based on build target
  ...(process.env.BUILD_TARGET === 'mobile' ? {} : { output: 'export' }),
  distDir: 'out',
  images: {
    domains: ['localhost', 'limit-breakers.com', 'limitbreakers.netlify.app'],
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
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://limitbreakers.netlify.app' : '',
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Mobile app optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // PWA and mobile enhancements
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
