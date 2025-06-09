import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/demos/jb2hubs',
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
