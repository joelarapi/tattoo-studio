import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import sharp from 'sharp'

// Apple home-screen icon: use the site's existing London InkTattoo emblem.
// Next.js automatically adds <link rel="apple-touch-icon"> for this file.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon(): Promise<Response> {
  const source = await readFile(join(process.cwd(), 'src/app/(frontend)/icon.png'))
  const png = await sharp(source)
    .resize(size.width, size.height)
    .flatten({ background: '#050505' })
    .png()
    .toBuffer()

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': contentType },
  })
}
