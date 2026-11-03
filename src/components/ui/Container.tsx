import type { ComponentPropsWithoutRef, ElementType } from 'react'

import { cn } from '@/lib/cn'

type ContainerProps<T extends ElementType> = {
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, 'as'>

/** Centred page column: max width --site-max, side gutter --site-margin. */
export function Container<T extends ElementType = 'div'>({
  as,
  className,
  ...rest
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? 'div'
  return <Tag className={cn('mx-auto w-full max-w-site px-site-margin', className)} {...rest} />
}
