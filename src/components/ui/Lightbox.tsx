'use client'

import { type ReactNode, useRef } from 'react'

import { cn } from '@/lib/cn'

/**
 * An "Enlarge" button that opens the photo full size in a dialog. Without JS it is a plain link
 * to the image file.
 */
export function Lightbox({
  href,
  label = 'Enlarge',
  children,
  className,
}: {
  /** The full-size image, for the no-JS link. */
  href: string
  label?: string
  /** The large image, rendered on the server. */
  children: ReactNode
  className?: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const close = () => dialog.current?.close()

  return (
    <>
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault()
          dialog.current?.showModal()
        }}
        className={cn('btn btn-outline bg-[#111c] px-[13px] py-2.5 text-[9px]', className)}
      >
        {label} ↗&#xFE0E;
      </a>
      <dialog
        ref={dialog}
        onClick={(event) => event.target === dialog.current && close()}
        className="m-auto w-auto max-w-[95vw] rounded-[7px] border border-[#444] bg-panel p-[18px] text-[#eee] backdrop:bg-[#000e]"
      >
        <button
          type="button"
          onClick={close}
          className="mb-4 ml-auto block cursor-pointer font-label text-[11px] text-white uppercase"
        >
          Close ×
        </button>
        {children}
      </dialog>
    </>
  )
}
