import { frameFileName } from './manifest'

/*
 * Progressive frame loading for <ScrollSequence>. Frame 1 first, then every 8th, every 4th,
 * every 2nd and the rest, so scrubbing works right away with coarse frames that fill in.
 * Until a frame arrives, `nearest()` returns the closest loaded one.
 */

type Frame = ImageBitmap | HTMLImageElement

const CONCURRENCY = 6

/** Load order: 0, then every 8th, 4th, 2nd frame, then the rest; no duplicates. */
export function loadOrder(count: number): number[] {
  const order: number[] = []
  const queued = new Set<number>()
  for (const step of [count, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!queued.has(i)) {
        queued.add(i)
        order.push(i)
      }
    }
  }
  return order
}

const canBitmap = () => typeof createImageBitmap === 'function'

async function decode(url: string, signal: AbortSignal): Promise<Frame> {
  if (canBitmap()) {
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    // Decodes off the main thread; rejects if the browser can't read the format (e.g. no AVIF).
    return createImageBitmap(await res.blob())
  }
  const img = new Image()
  img.src = url
  await img.decode()
  return img
}

type FrameLoaderArgs = {
  path: string
  count: number
  ext: string
  fallbackExt: string
  /** Called whenever a frame finishes loading. */
  onLoad: (index: number) => void
}

export class FrameLoader {
  private readonly frames: (Frame | null)[]
  private readonly controller = new AbortController()
  private ext: string
  private disposed = false

  constructor(private readonly args: FrameLoaderArgs) {
    this.frames = Array.from({ length: args.count }, () => null)
    this.ext = args.ext
  }

  get count() {
    return this.args.count
  }

  async start(): Promise<void> {
    const [first, ...rest] = loadOrder(this.args.count)
    // The first frame also settles the format: fall back to WebP if AVIF can't be decoded.
    try {
      await this.load(first)
    } catch {
      if (this.disposed) return
      this.ext = this.args.fallbackExt
      await this.load(first).catch(() => {})
    }

    const queue = [...rest]
    const worker = async () => {
      while (queue.length && !this.disposed) {
        await this.load(queue.shift()!).catch(() => {})
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  }

  /** The loaded frame closest to `index`, or null if none has loaded yet. */
  nearest(index: number): { index: number; frame: Frame } | null {
    const { count } = this.args
    for (let distance = 0; distance < count; distance++) {
      const before = this.frames[index - distance]
      if (before) return { index: index - distance, frame: before }
      const after = this.frames[index + distance]
      if (after) return { index: index + distance, frame: after }
    }
    return null
  }

  dispose() {
    this.disposed = true
    this.controller.abort()
    for (const frame of this.frames) {
      if (frame && 'close' in frame) frame.close()
    }
    this.frames.fill(null)
  }

  private async load(index: number) {
    const url = `${this.args.path}/${frameFileName(index, this.ext)}`
    const frame = await decode(url, this.controller.signal)
    if (this.disposed) {
      if ('close' in frame) frame.close()
      return
    }
    this.frames[index] = frame
    this.args.onLoad(index)
  }
}

/** Draws `frame` to fill the canvas like CSS `object-fit: cover`. */
export function drawCover(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { width: cw, height: ch } = ctx.canvas
  const iw = frame.width
  const ih = frame.height
  const scale = Math.max(cw / iw, ch / ih)
  const dw = iw * scale
  const dh = ih * scale
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
}
