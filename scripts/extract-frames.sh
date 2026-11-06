#!/usr/bin/env bash
#
# Turns a video into a frame sequence for <ScrollSequence>.
#
#   pnpm sequence:extract <input.mp4> <name>
#   → public/sequences/<name>/{desktop,mobile}/0001.avif|webp, poster.avif, manifest.json
#
# Source footage: rendered or shot on a PURE BLACK background, subject centred, 6–10 seconds,
# at least 1080p, no text in the video (step text is real HTML on top).
#
# ffmpeg decodes the video (24 fps, at most 180 frames) and crushes near-black to pure black so
# the frames blend into the page; sharp then resizes and encodes (scripts/sequence/encode.ts).
# Afterwards, set Homepage → Process → "sequence" in the CMS to <name>.

set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: pnpm sequence:extract <input-video> <name>" >&2
  exit 1
fi

input=$1
name=$2

if ! command -v ffmpeg > /dev/null; then
  echo "ffmpeg is not installed. Windows: winget install Gyan.FFmpeg · macOS: brew install ffmpeg" >&2
  exit 1
fi
if [ ! -f "$input" ]; then
  echo "Video not found: $input" >&2
  exit 1
fi
if [[ ! $name =~ ^[a-z0-9-]+$ ]]; then
  echo "Name must use lowercase letters, digits and dashes, e.g. process-v2" >&2
  exit 1
fi

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

echo "Extracting frames from $input…"
ffmpeg -hide_banner -loglevel error -i "$input" \
  -vf "fps=24,colorlevels=rimin=0.03:gimin=0.03:bimin=0.03,format=rgb24" \
  -frames:v 180 -an "$tmp/%04d.png"

pnpm exec tsx scripts/encode-frames.ts "$tmp" "$name"
