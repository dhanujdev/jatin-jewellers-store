/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
