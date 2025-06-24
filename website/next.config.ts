import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '.',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
