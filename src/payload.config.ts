import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { hasRole } from './access'
import { Artists } from './collections/Artists'
import { Categories } from './collections/Categories'
import { Faqs } from './collections/Faqs'
import { LeadAttachments } from './collections/LeadAttachments'
import { Leads } from './collections/Leads'
import { LegalPages } from './collections/LegalPages'
import { Media } from './collections/Media'
import { PortfolioItems } from './collections/PortfolioItems'
import { Posts } from './collections/Posts'
import { Styles } from './collections/Styles'
import { Users } from './collections/Users'
import { basicEditor } from './fields/richText'
import { Homepage } from './globals/Homepage'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { bearerToken, matchesSecret } from './lib/secrets'
import { seo } from './plugins/seo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/*
 * Cloudflare R2 (S3-compatible). Each bucket is used only when its env var is set; otherwise
 * uploads go to local disk (/media, /media-private), which is what development uses.
 */
const s3ClientConfig = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
}
const publicMediaURL = process.env.S3_PUBLIC_URL?.replace(/\/$/, '')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' · Studio CMS' },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  // Sidebar order: Content, Studio, Leads, Settings.
  collections: [
    Posts,
    Categories,
    Media,
    Artists,
    Styles,
    PortfolioItems,
    Faqs,
    Leads,
    LeadAttachments,
    LegalPages,
    Users,
  ],
  globals: [Homepage, SiteSettings, Navigation],
  editor: basicEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  // Without an API key, Payload prints outgoing emails to the console (fine in development).
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Studio website',
      })
    : undefined,
  sharp,
  // Scheduled publishing runs as a job. On a Node server Payload checks the queue every minute;
  // on Vercel, Vercel Cron calls /api/payload-jobs/run instead (see vercel.json).
  jobs: {
    access: {
      run: ({ req }) => {
        if (hasRole(req.user, 'admin')) return true
        return matchesSecret(bearerToken(req.headers), process.env.CRON_SECRET)
      },
    },
    autoRun: process.env.VERCEL ? undefined : [{ cron: '* * * * *', queue: 'default' }],
  },
  plugins: [
    seo,
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      // Adds the plugin's columns (prefix, _objectKey) even when disabled, so the database schema
      // is the same with or without R2. Production never pushes schema changes by itself.
      alwaysInsertFields: true,
      bucket: process.env.S3_BUCKET || '',
      config: s3ClientConfig,
      // Browser uploads straight to R2, so large files skip Vercel's 4.5 MB request limit.
      // The bucket needs a CORS rule allowing PUT from the site (see README).
      clientUploads: true,
      collections: {
        media: publicMediaURL
          ? {
              prefix: 'media',
              // Served straight from R2's public URL / CDN rather than through Payload.
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) =>
                `${publicMediaURL}/${prefix ? `${prefix}/` : ''}${filename}`,
            }
          : { prefix: 'media' },
      },
    }),
    // Private bucket: client reference images, only readable through Payload's access control.
    s3Storage({
      enabled: Boolean(process.env.S3_PRIVATE_BUCKET),
      alwaysInsertFields: true,
      bucket: process.env.S3_PRIVATE_BUCKET || '',
      config: s3ClientConfig,
      collections: { 'lead-attachments': { prefix: 'leads' } },
    }),
  ],
})
