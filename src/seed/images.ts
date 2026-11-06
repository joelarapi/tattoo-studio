import sharp from 'sharp'

/*
 * Placeholder images in the site's drafting style: black, a faint grid, thin compass circles,
 * one tiny accent square. No text, so there's nothing to replace but the image itself.
 */

export type PlaceholderKind = 'portrait' | 'portfolio' | 'cover' | 'style' | 'stat' | 'og'

const dimensions: Record<PlaceholderKind, [number, number]> = {
  portrait: [1200, 1600],
  portfolio: [1200, 1500],
  cover: [1600, 900],
  style: [1600, 1000],
  stat: [1000, 750],
  og: [1200, 630],
}

/** Small deterministic PRNG, so the same seed always draws the same picture. */
function random(seed: number) {
  let state = seed + 0x6d2b79f5
  return () => {
    state = Math.imul(state ^ (state >>> 15), state | 1)
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61)
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296
  }
}

function svg(kind: PlaceholderKind, seed: number): string {
  const [width, height] = dimensions[kind]
  const rand = random(seed * 97 + kind.length)
  const cx = width * (0.35 + rand() * 0.3)
  const cy = height * (0.35 + rand() * 0.3)
  const r = Math.min(width, height) * (0.28 + rand() * 0.14)
  const grid = 64
  const lines: string[] = []
  for (let x = grid; x < width; x += grid) lines.push(`M${x} 0V${height}`)
  for (let y = grid; y < height; y += grid) lines.push(`M0 ${y}H${width}`)
  const arcStart = rand() * Math.PI * 2
  const arcEnd = arcStart + Math.PI * (0.6 + rand() * 0.8)
  const point = (angle: number, radius: number) =>
    `${(cx + Math.cos(angle) * radius).toFixed(1)} ${(cy + Math.sin(angle) * radius).toFixed(1)}`
  const tick = 28
  const inset = 40

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="glow" cx="${cx / width}" cy="${cy / height}" r="0.6">
      <stop offset="0" stop-color="#1a1a1a"/><stop offset="1" stop-color="#000"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <path d="${lines.join('')}" stroke="#141414" stroke-width="1"/>
  <g fill="none" stroke="#343434" stroke-width="1.5">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.62}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.24}"/>
    <path d="M${cx - r * 1.3} ${cy}H${cx + r * 1.3}M${cx} ${cy - r * 1.3}V${cy + r * 1.3}" stroke="#262626"/>
    <path d="M${point(arcStart, r * 0.8)} A${r * 0.8} ${r * 0.8} 0 0 1 ${point(arcEnd, r * 0.8)}" stroke="#6b6b6b" stroke-dasharray="6 10"/>
  </g>
  <g fill="none" stroke="#4e4e4e" stroke-width="1.5">
    <path d="M${inset} ${inset + tick}V${inset}H${inset + tick}"/>
    <path d="M${width - inset - tick} ${height - inset}H${width - inset}V${height - inset - tick}"/>
  </g>
  <rect x="${(cx + Math.cos(arcEnd) * r * 0.8 - 5).toFixed(1)}" y="${(cy + Math.sin(arcEnd) * r * 0.8 - 5).toFixed(1)}" width="10" height="10" fill="#FF4800"/>
</svg>`
}

/** A placeholder JPEG ready for `payload.create({ collection: 'media', file })`. */
export async function placeholderImage(kind: PlaceholderKind, seed: number) {
  const data = await sharp(Buffer.from(svg(kind, seed)))
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer()
  return {
    data,
    mimetype: 'image/jpeg',
    name: `placeholder-${kind}-${seed}.jpg`,
    size: data.length,
  }
}
