/*
 * Cloudflare R2 (S3-compatible) connection, shared by the storage plugins in payload.config.ts
 * and the enquiry form's direct uploads (src/lib/enquiry/uploads.ts).
 */
export const s3ClientConfig = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
}
