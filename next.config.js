/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for consistency
  trailingSlash: true,
  // Disable eslint during builds (optional, remove if you want strict checking)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable typescript errors during builds (optional, remove if you want strict checking)
  typescript: {
    ignoreBuildErrors: true,
  },
  // FIX #12, #13: Remove standalone output - conflicts with Vercel serverless deployment
  // Vercel handles its own build optimization
  experimental: {
    // Optimize package imports for better build performance
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
