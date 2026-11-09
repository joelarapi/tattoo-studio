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
  // NOINDEX=true on demo / staging deploys keeps search engines away from placeholder content.
  headers: async () =>
    process.env.NOINDEX === 'true'
      ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
      : [],
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
