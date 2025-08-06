import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  generateBuildId: () => 'static-build-id',
  webpack: config => {
    // Next.js output is not stable when there's no code change and this is a work around
    config.output.filename = config.output.filename.replace(
      '[chunkhash]',
      '[contenthash]',
    )
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
