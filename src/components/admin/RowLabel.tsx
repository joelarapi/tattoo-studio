'use client'

import { useRowLabel } from '@payloadcms/ui'

/* Admin-only: names array rows after their content instead of "Row 01". */

type RowData = {
  title?: string
  label?: string
  question?: string
  platform?: string
  text?: string
}

export function ItemRowLabel() {
  const { data, rowNumber } = useRowLabel<RowData>()
  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const name = data?.title || data?.label || data?.question || data?.platform || data?.text
  return <span>{`${number} ${name?.split('\n')[0] || 'New item'}`}</span>
}
