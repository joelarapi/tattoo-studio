/**
 * Second half of scripts/extract-frames.sh: encodes a folder of PNG frames (0001.png, …) into a
 * <ScrollSequence> sequence. Usage: tsx scripts/encode-frames.ts <png-folder> <name>
 */
import { readdir, readFile } from 'fs/promises'
import path from 'path'

import { isSequenceName } from '../src/components/scroll-sequence/manifest'
import { encodeSequence } from './sequence/encode'

const [dir, name] = process.argv.slice(2)
if (!dir || !name || !isSequenceName(name)) {
  console.error(
    'Usage: tsx scripts/encode-frames.ts <png-folder> <name: lowercase letters, digits, dashes>',
  )
  process.exit(1)
}

const files = (await readdir(dir)).filter((file) => file.endsWith('.png')).sort()
if (files.length === 0) {
  console.error(`No PNG frames found in ${dir}`)
  process.exit(1)
}

console.log(`Encoding ${files.length} frames as "${name}"…`)
await encodeSequence({
  name,
  frameCount: files.length,
  fps: 24,
  readFrame: (index) => readFile(path.join(dir, files[index])),
})
