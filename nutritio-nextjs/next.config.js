/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Docker
  output: 'standalone',
  eslint: {
    // Désactiver ESLint pendant le build pour Docker
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver TypeScript pendant le build pour Docker
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
