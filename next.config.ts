import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Media served straight from Cloudflare R2 in production (see src/payload.config.ts).
const publicMediaURL = process.env.S3_PUBLIC_URL ? new URL(process.env.S3_PUBLIC_URL) : null

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      // Posters of the scroll sequences (public/sequences/<name>/poster.avif).
      {
        pathname: '/sequences/**',
      },
    ],
    remotePatterns: publicMediaURL
      ? [
          {
            protocol: publicMediaURL.protocol.replace(':', '') as 'http' | 'https',
            hostname: publicMediaURL.hostname,
            pathname: '/media/**',
          },
        ]
      : [],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
