/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['localhost'],
  },
  // Fix deployment paths
  basePath: '',
  trailingSlash: true,
  typescript: {
    // Disable type checking during builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint checking during builds
    ignoreDuringBuilds: true,
  },
  // Add experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Improve module resolution
  webpack: (config, { isServer }) => {
    // Handle Redis module in browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
