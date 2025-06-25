import MillionLint from '@million/lint'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/demos/jb2hubs',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default MillionLint.next({ rsc: true })(nextConfig)
