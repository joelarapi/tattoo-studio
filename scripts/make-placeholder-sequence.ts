/**
 * Generates the placeholder frame sequence (`public/sequences/placeholder/`) so <ScrollSequence>
 * works before real footage exists: numbered frames with an expanding ring, on pure black.
 *
 *   pnpm sequence:placeholder
 *
 * Drawn as SVG and rasterised with sharp. Digits are drawn as seven-segment paths, so no fonts
 * are needed.
 */
import { encodeSequence } from './sequence/encode'

const WIDTH = 1920
const HEIGHT = 1080
const FPS = 24
const FRAMES = 144 // 6 seconds

const cx = WIDTH / 2
const cy = HEIGHT / 2

// Seven-segment digits: which of the segments a–g are lit.
const SEGMENTS: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abged',
  '3': 'abgcd',
  '4': 'fgbc',
  '5': 'afgcd',
  '6': 'afgedc',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
}

function digit(char: string, x: number, y: number, w: number, h: number, t: number) {
  const half = h / 2
  const rects: Record<string, [number, number, number, number]> = {
    a: [x + t, y, w - 2 * t, t],
    b: [x + w - t, y + t, t, half - t * 1.5],
    c: [x + w - t, y + half + t / 2, t, half - t * 1.5],
    d: [x + t, y + h - t, w - 2 * t, t],
    e: [x, y + half + t / 2, t, half - t * 1.5],
    f: [x, y + t, t, half - t * 1.5],
    g: [x + t, y + half - t / 2, w - 2 * t, t],
  }
  return [...SEGMENTS[char]]
    .map((s) => {
      const [rx, ry, rw, rh] = rects[s]
      return `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}"/>`
    })
    .join('')
}

function number(value: string, centerX: number, y: number, size: number) {
  const w = size * 0.55
  const gap = size * 0.2
  const total = value.length * w + (value.length - 1) * gap
  const start = centerX - total / 2
  return [...value]
    .map((char, i) => digit(char, start + i * (w + gap), y, w, size, size * 0.09))
    .join('')
}

function frame(index: number): string {
  const t = index / (FRAMES - 1)
  // One ring grows across the whole sequence; a faster echo ring loops four times (one per step).
  const ring = 80 + t * 420
  const echoT = (t * 4) % 1
  const echo = 60 + echoT * 300
  const echoOpacity = (1 - echoT) * 0.5
  const arc = t * Math.PI * 2
  const arcX = cx + Math.sin(arc) * 470
  const arcY = cy - Math.cos(arc) * 470
  const large = arc > Math.PI ? 1 : 0

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#000"/>
  <g fill="none" stroke="#1c1c1c" stroke-width="2">
    <circle cx="${cx}" cy="${cy}" r="470"/>
    <circle cx="${cx}" cy="${cy}" r="300"/>
    <path d="M${cx - 520} ${cy}H${cx + 520}M${cx} ${cy - 520}V${cy + 520}"/>
  </g>
  <circle cx="${cx}" cy="${cy}" r="${echo}" fill="none" stroke="#a8a8a8" stroke-opacity="${echoOpacity.toFixed(3)}" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="${ring}" fill="none" stroke="#ffffff" stroke-width="3"/>
  ${
    index > 0
      ? `<path d="M${cx} ${cy - 470} A470 470 0 ${large} 1 ${arcX.toFixed(1)} ${arcY.toFixed(1)}" fill="none" stroke="#ff4800" stroke-width="3"/>`
      : ''
  }
  <rect x="${(arcX - 6).toFixed(1)}" y="${(arcY - 6).toFixed(1)}" width="12" height="12" fill="#ff4800"/>
  <g fill="#4e4e4e">${number(String(index + 1).padStart(3, '0'), cx, cy - 36, 72)}</g>
</svg>`
}

console.log(`Generating ${FRAMES} placeholder frames…`)
await encodeSequence({
  name: 'placeholder',
  frameCount: FRAMES,
  fps: FPS,
  readFrame: async (index) => Buffer.from(frame(index)),
})
