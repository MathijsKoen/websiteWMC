import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Voorkomt trailing-slash redirect loops in Netlify's preview proxy
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'downloads.ctfassets.net',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
