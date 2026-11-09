'use client'

import { type ReactNode, useRef, useState } from 'react'

import { PlayIcon } from '@/components/art/Glyphs'
import { Action } from '@/components/ui/Action'
import { ScrollTrack } from '@/components/ui/ScrollTrack'
import { Paragraphs } from '@/components/ui/Text'

export type Reel = {
  id: string
  title: string
  text?: string | null
  video?: { url: string; mimeType?: string | null } | null
  /** The cover image, rendered on the server. */
  poster: ReactNode
  posterURL?: string | null
}

type ReelsTrackProps = {
  reels: Reel[]
  trackLabel?: string | null
  itemLabel?: string | null
  watchLabel?: string | null
  comingSoonLabel?: string | null
  dialogLink?: { label?: string | null; href?: string | null } | null
}

/**
 * Film cards in a sideways track. A card opens a dialog that plays the film, or, while there is
 * no footage yet, shows the text from the CMS.
 */
export function ReelsTrack({
  reels,
  trackLabel,
  itemLabel,
  watchLabel,
  comingSoonLabel,
  dialogLink,
}: ReelsTrackProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<Reel | null>(null)

  const show = (reel: Reel) => {
    setOpen(reel)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()

  return (
    <>
      <ScrollTrack label={trackLabel} ariaLabel="Tattoo films">
        {reels.map((reel, index) => (
          <button
            key={reel.id}
            type="button"
            data-reveal
            onClick={() => show(reel)}
            className="group relative h-[440px] overflow-hidden rounded-md border border-line-strong bg-[#161616] p-0 text-left text-white after:absolute after:inset-0 after:bg-linear-to-t after:from-[#000d] after:to-transparent after:to-55% after:content-[''] md:h-[420px] lg:h-[510px]"
          >
            <span className="absolute inset-0 opacity-75 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none">
              {reel.poster}
            </span>
            <span className="absolute top-[15px] left-[13px] z-[1] label-xs md:top-5 md:left-5 md:text-[9px]">
              {String(index + 1).padStart(2, '0')}
              {itemLabel && ` / ${itemLabel}`}
            </span>
            <span
              aria-hidden="true"
              className="absolute top-[45%] left-1/2 z-[1] grid size-[45px] -translate-1/2 place-items-center rounded-full border border-[#ffffff90] bg-[#0003] md:size-[60px]"
            >
              <PlayIcon className="ml-0.5 size-3 md:size-4" />
            </span>
            <span className="absolute right-3 bottom-5 left-3.5 z-[1] md:right-[22px] md:bottom-[25px] md:left-[22px]">
              <b className="block text-[23px] font-normal tracking-[-1px] md:text-[26px] lg:text-[30px]">
                {reel.title}
              </b>
              <span className="mt-3 block label-xs text-[#aaa]">
                {reel.video ? watchLabel : comingSoonLabel} ↗&#xFE0E;
              </span>
            </span>
          </button>
        ))}
      </ScrollTrack>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(event) => event.target === dialog.current && close()}
        className="m-auto w-[90vw] max-w-[600px] rounded-[7px] border border-[#444] bg-panel p-6 text-[#eee] backdrop:bg-[#000e] md:p-8 [&:has(video)]:max-w-[1000px]"
      >
        <button
          type="button"
          onClick={close}
          className="mb-5 ml-auto block cursor-pointer font-label text-[11px] text-white uppercase"
        >
          Close ×
        </button>
        {open && (
          <>
            {itemLabel && <span className="tag">{itemLabel}</span>}
            <h2 className="text-[33px] leading-[1.13] tracking-[-1.5px] md:text-[40px]">
              {open.title}
            </h2>
            {open.video ? (
              <video
                key={open.video.url}
                controls
                autoPlay
                playsInline
                poster={open.posterURL ?? undefined}
                className="mt-6 max-h-[70vh] w-full bg-black"
              >
                <source src={open.video.url} type={open.video.mimeType ?? undefined} />
              </video>
            ) : (
              <Paragraphs
                text={open.text}
                className="mt-[23px] text-[13px] leading-[1.8] md:text-[14px]"
              />
            )}
            <Action link={dialogLink} variant="outline" className="mt-[25px]" />
          </>
        )}
      </dialog>
    </>
  )
}
