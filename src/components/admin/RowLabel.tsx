'use client'

import { useRowLabel } from '@payloadcms/ui'

/* Admin-only: names array rows after their content instead of "Row 01". */

const number = (rowNumber?: number) => String((rowNumber ?? 0) + 1).padStart(2, '0')

export function HeadingRowLabel() {
  const { data, rowNumber } = useRowLabel<{ heading?: string }>()
  return <span>{`${number(rowNumber)} ${data?.heading || 'New step'}`}</span>
}

export function TitleRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <span>{`${number(rowNumber)} ${data?.title || 'New item'}`}</span>
}

export function StatRowLabel() {
  const { data } = useRowLabel<{ value?: number; unit?: string; text?: string }>()
  const text = [data?.value, data?.unit].filter((part) => part != null).join('')
  return <span>{text ? `${text} ${data?.text ?? ''}` : 'New stat'}</span>
}

export function LinkRowLabel() {
  const { data } = useRowLabel<{ label?: string }>()
  return <span>{data?.label || 'New link'}</span>
}

export function PlatformRowLabel() {
  const { data } = useRowLabel<{ platform?: string }>()
  return <span>{data?.platform || 'New link'}</span>
}
