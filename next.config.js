/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // All images are now stored locally in the public directory
    unoptimized: true,
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
