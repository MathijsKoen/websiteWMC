import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    loader: 'custom',
    loaderFile: './lib/contentful-loader.ts',
  },
}

export default nextConfig
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
