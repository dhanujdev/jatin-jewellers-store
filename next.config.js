/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Configure image loader
    unoptimized: true,
    // Allow domains for external images if needed
    domains: [],
  },
  // Indicate the output directory to Same.dev
  distDir: 'build',
  // Fix Same.dev deployment paths
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
