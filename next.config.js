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
};

module.exports = nextConfig;
