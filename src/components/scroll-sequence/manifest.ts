/*
 * Shape of public/sequences/<name>/manifest.json, written by scripts/sequence/encode.ts and read
 * by <ScrollSequence>. Frame files are numbered from 0001.
 */

export type SequenceManifest = {
  /** Desktop frame count and size (16:9, 1920 wide). */
  frameCount: number
  width: number
  height: number
  fps: number
  desktopPath: string
  /** Mobile frames: every 2nd frame, centre-cropped to 4:5 so portrait screens stay sharp. */
  mobilePath: string
  mobile: { frameCount: number; width: number; height: number }
  /** Preferred format, and the one used where the browser can't decode it. */
  ext: 'avif'
  fallbackExt: 'webp'
  /** First desktop frame, used as the LCP image under the canvas. */
  poster: string
}

/** Folder names are restricted so a CMS value can never point outside /sequences. */
export const isSequenceName = (name: string) => /^[a-z0-9-]+$/.test(name)

export const sequenceBase = (name: string) => `/sequences/${name}`

/** "0001" for index 0. */
export const frameBaseName = (index: number) => String(index + 1).padStart(4, '0')

export const frameFileName = (index: number, ext: string) => `${frameBaseName(index)}.${ext}`
