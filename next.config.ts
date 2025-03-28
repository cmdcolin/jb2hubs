import type {
 NextConfig 
} from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'export',
  basePath: '/jb2hubs',
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
