import { mkdir, rm, writeFile } from 'fs/promises'
import { availableParallelism } from 'os'
import path from 'path'
import sharp, { type Sharp, type SharpInput } from 'sharp'

import {
  frameBaseName,
  type SequenceManifest,
  sequenceBase,
} from '../../src/components/scroll-sequence/manifest'

/*
 * Turns full-resolution source frames into the files <ScrollSequence> loads:
 *   public/sequences/<name>/desktop/0001.avif|webp   1920 wide, every frame
 *   public/sequences/<name>/mobile/0001.avif|webp    960×1200 centre crop, every 2nd frame
 *   public/sequences/<name>/poster.avif              frame 1, the LCP image
 *   public/sequences/<name>/manifest.json
 */

const DESKTOP_WIDTH = 1920
const MOBILE = { width: 960, height: 1200, every: 2 }

const avif = { quality: 50, effort: 4 }
const webp = { quality: 72, effort: 4 }

type EncodeArgs = {
  name: string
  frameCount: number
  fps: number
  /** Returns frame `index` (0-based) at full resolution, in any format sharp reads. */
  readFrame: (index: number) => Promise<SharpInput>
}

async function writeBoth(image: Sharp, file: string) {
  await Promise.all([
    image.clone().avif(avif).toFile(`${file}.avif`),
    image.clone().webp(webp).toFile(`${file}.webp`),
  ])
}

/** Runs `task` for 0..count-1 with a fixed number in flight. */
async function eachLimited(count: number, limit: number, task: (index: number) => Promise<void>) {
  let next = 0
  const worker = async () => {
    while (next < count) await task(next++)
  }
  await Promise.all(Array.from({ length: Math.min(limit, count) }, worker))
}

export async function encodeSequence({ name, frameCount, fps, readFrame }: EncodeArgs) {
  const outDir = path.resolve('public', 'sequences', name)
  await rm(outDir, { recursive: true, force: true })
  await mkdir(path.join(outDir, 'desktop'), { recursive: true })
  await mkdir(path.join(outDir, 'mobile'), { recursive: true })

  const first = sharp(await readFrame(0)).resize({ width: DESKTOP_WIDTH, withoutEnlargement: true })
  const { info } = await first.clone().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  await first.clone().avif(avif).toFile(path.join(outDir, 'poster.avif'))

  const mobileCount = Math.ceil(frameCount / MOBILE.every)
  let done = 0
  // sharp is multi-threaded already; a few frames at a time keeps memory flat.
  await eachLimited(frameCount, Math.max(2, Math.floor(availableParallelism() / 2)), async (i) => {
    const source = await readFrame(i)
    await writeBoth(
      sharp(source).resize({ width: DESKTOP_WIDTH, withoutEnlargement: true }),
      path.join(outDir, 'desktop', frameBaseName(i)),
    )
    if (i % MOBILE.every === 0) {
      await writeBoth(
        sharp(source).resize({ width: MOBILE.width, height: MOBILE.height, fit: 'cover' }),
        path.join(outDir, 'mobile', frameBaseName(i / MOBILE.every)),
      )
    }
    done++
    if (done % 24 === 0 || done === frameCount) {
      process.stdout.write(`\r  encoded ${done}/${frameCount} frames`)
    }
  })
  process.stdout.write('\n')

  const base = sequenceBase(name)
  const manifest: SequenceManifest = {
    frameCount,
    width,
    height,
    fps,
    desktopPath: `${base}/desktop`,
    mobilePath: `${base}/mobile`,
    mobile: { frameCount: mobileCount, width: MOBILE.width, height: MOBILE.height },
    ext: 'avif',
    fallbackExt: 'webp',
    poster: `${base}/poster.avif`,
  }
  await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(
    `  wrote ${path.relative(process.cwd(), outDir)} (${frameCount} desktop, ${mobileCount} mobile frames)`,
  )
}
