'use client'

import { type KeyboardEvent, useRef, useState } from 'react'

import { CmsImage } from '@/components/ui/CmsImage'
import type { Media } from '@/payload-types'

/**
 * A piece's photos, grey like the rest of the site. Each one opens in a dialog in its original
 * colours, with previous and next buttons and the arrow keys. Without JS each photo is a link to
 * the image file.
 */
export function PieceGallery({ photos, label }: { photos: Media[]; label?: string | null }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(0)
  const count = photos.length
  const photo = photos[current]

  const step = (by: number) => setCurrent((index) => (index + by + count) % count)
  const open = (index: number) => {
    setCurrent(index)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()
  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (count < 2) return
    if (event.key === 'ArrowRight') step(1)
    if (event.key === 'ArrowLeft') step(-1)
  }

  return (
    <>
      {photos.map((media, index) => (
        <a
          key={media.id}
          href={media.url ?? undefined}
          onClick={(event) => {
            event.preventDefault()
            open(index)
          }}
          className="block w-full cursor-zoom-in border border-line-strong bg-panel"
        >
          <CmsImage
            media={media}
            photo={false}
            sizes="(min-width: 681px) 55vw, 90vw"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            className="block h-auto max-h-[900px] w-full object-contain"
          />
          {label && (
            <span className="block p-4 text-center font-label text-[14px] text-[#ddd] uppercase">
              {label} ↗&#xFE0E;
            </span>
          )}
        </a>
      ))}

      <dialog
        ref={dialog}
        aria-label={photo?.alt}
        onClick={(event) => event.target === dialog.current && close()}
        onKeyDown={onKeyDown}
        className="m-auto w-auto max-w-[95vw] rounded-[7px] border border-[#444] bg-panel p-[18px] text-[#eee] backdrop:bg-[#000e]"
      >
        <button
          type="button"
          onClick={close}
          className="mb-4 ml-auto block cursor-pointer font-label text-[14px] text-white uppercase"
        >
          Close ×
        </button>
        {photo && (
          <>
            <CmsImage
              key={photo.id}
              media={photo}
              photo={false}
              sizes="85vw"
              className="m-auto block h-auto max-h-[72vh] w-auto max-w-[80vw] md:max-h-[80vh] md:max-w-[85vw]"
            />
            <p aria-live="polite" className="mt-[15px] text-[16px] text-muted">
              {photo.alt} / {current + 1} of {count}
            </p>
          </>
        )}
        {count > 1 && (
          <div className="mt-[15px] flex justify-between gap-5">
            <button type="button" onClick={() => step(-1)} className="btn btn-outline">
              ← Previous
            </button>
            <button type="button" onClick={() => step(1)} className="btn btn-outline">
              Next →
            </button>
          </div>
        )}
      </dialog>
    </>
  )
}
