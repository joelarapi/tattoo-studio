'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'
import { ENQUIRY_ID } from '@/lib/routes'

/**
 * The orange bar pinned to the bottom of phone screens on the homepage. It steps aside while the
 * enquiry form itself is on screen.
 */
export function MobileCta({ label, href }: { label: string; href: string }) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const form = document.getElementById(ENQUIRY_ID)
    if (!form) return
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      threshold: 0.05,
    })
    observer.observe(form)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      href={href}
      data-mobile-cta
      className={cn(
        'fixed inset-x-[6%] bottom-3 z-20 rounded-[5px] bg-accent p-3.5 text-center font-label text-[11px] tracking-[0.3px] text-on-accent uppercase shadow-[0_3px_25px_#0008] md:hidden',
        hidden && 'hidden',
      )}
    >
      {label} ↗&#xFE0E;
    </a>
  )
}
