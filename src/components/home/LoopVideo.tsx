'use client'

import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from '@/lib/motion/gsap'

/**
 * A short muted loop that only downloads and plays while it's on screen (`preload="none"` plus an
 * IntersectionObserver). Reduced motion keeps the poster still.
 */
export function LoopVideo({ src, type, poster }: { src: string; type: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video || prefersReducedMotion()) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover"
    >
      <source src={src} type={type} />
    </video>
  )
}
