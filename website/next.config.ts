import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/demos/jb2hubs',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateBuildId: () => 'static-build-id',
  webpack: (config, options) => {
    // Next.js output is not stable when there's no code change and this is a work around
    console.log(config.output.filename)
    config.output.filename = config.output.filename.replace(
      '[chunkhash]',
      '[contenthash]',
    )
    return config
  },
  devIndicators: false,
}

export default nextConfig
