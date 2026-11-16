'use client'

import { type RefObject, useCallback, useEffect, useRef } from 'react'

import { TURNSTILE_ACTION } from '@/lib/enquiry/config'

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

let scriptPromise: Promise<TurnstileApi> | undefined

function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing'))
    script.onerror = () => {
      scriptPromise = undefined
      script.remove()
      reject(new Error('Turnstile failed to load'))
    }
    document.head.append(script)
  })
  return scriptPromise
}

type Waiter = { resolve: (token: string) => void; reject: (error: Error) => void }

/**
 * Cloudflare Turnstile, the spam check, rendered into `container`. The script loads when the
 * visitor first uses the form (`prepare`), so pages stay light. The widget stays invisible unless
 * Cloudflare needs the visitor to tick a box. Without a site key (development) tokens are empty
 * and the server skips the check.
 */
export function useTurnstile(container: RefObject<HTMLDivElement | null>) {
  const widget = useRef<string | null>(null)
  const token = useRef<string | null>(null)
  const waiters = useRef<Waiter[]>([])

  const settle = useCallback((result: string | Error) => {
    const pending = waiters.current
    waiters.current = []
    for (const waiter of pending)
      if (typeof result === 'string') waiter.resolve(result)
      else waiter.reject(result)
  }, [])

  const prepare = useCallback(async () => {
    if (!siteKey || widget.current || !container.current) return
    const api = await loadScript()
    if (widget.current || !container.current) return
    widget.current = api.render(container.current, {
      sitekey: siteKey,
      action: TURNSTILE_ACTION,
      theme: 'dark',
      size: 'flexible',
      appearance: 'interaction-only',
      callback: (value: string) => {
        token.current = value
        settle(value)
      },
      'expired-callback': () => {
        token.current = null
      },
      'error-callback': () => {
        token.current = null
        settle(new Error('Turnstile error'))
      },
    })
  }, [container, settle])

  /** A fresh token, waiting for the check to finish (or for the visitor to tick the box). */
  const getToken = useCallback(async () => {
    if (!siteKey) return ''
    await prepare()
    if (token.current) return token.current
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Turnstile timed out')), 120_000)
      waiters.current.push({
        resolve: (value) => (clearTimeout(timer), resolve(value)),
        reject: (error) => (clearTimeout(timer), reject(error)),
      })
    })
  }, [prepare])

  /** Each token works once, so get a new one after every attempt. */
  const reset = useCallback(() => {
    token.current = null
    if (widget.current) window.turnstile?.reset(widget.current)
  }, [])

  /** Takes the widget out while its element still exists (before the form is replaced). */
  const remove = useCallback(() => {
    token.current = null
    if (widget.current) window.turnstile?.remove(widget.current)
    widget.current = null
  }, [])

  useEffect(() => remove, [remove])

  return { prepare, getToken, reset, remove }
}
