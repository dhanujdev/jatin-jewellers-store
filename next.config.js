/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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
    // Add any necessary webpack configurations
    return config;
  },
};

module.exports = nextConfig;
