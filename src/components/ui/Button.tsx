import Link from 'next/link'
import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react'

import { ScrambleLabel } from '@/components/motion/ScrambleLabel'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonSize = 'md' | 'sm'

type BaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Show the trailing "→". Defaults to true. */
  arrow?: boolean
  className?: string
  children: ReactNode
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined
    asChild?: false
  }

type ButtonAsLink = BaseProps &
  Omit<ComponentProps<typeof Link>, keyof BaseProps> & {
    asChild?: false
  }

/** Styles the single child element (e.g. an external <a>) as a button. */
type ButtonAsChild = BaseProps & {
  asChild: true
  href?: undefined
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsChild

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'bg-surface-2 text-text hover:bg-muted',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-12 px-5 text-label',
  sm: 'h-8 px-3 text-label-sm',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}): string {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-[0.75em] rounded-sm font-mono leading-none font-medium whitespace-nowrap uppercase transition-colors duration-300 ease-studio select-none disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}

function ButtonContent({ children, arrow }: { children: ReactNode; arrow: boolean }) {
  return (
    <>
      {typeof children === 'string' ? <ScrambleLabel text={children} /> : children}
      {arrow && <span aria-hidden="true">→</span>}
    </>
  )
}

/**
 * Primary / secondary button in two sizes, with a scramble-on-hover label.
 * - `<Button>Send</Button>` renders a <button type="button">
 * - `<Button href="/journal">Read</Button>` renders a Next.js <Link>
 * - `<Button asChild><a href="https://…">Map</a></Button>` styles your own element
 */
export function Button(props: ButtonProps) {
  const { variant, size, arrow = true, className, children, asChild, ...rest } = props
  const classes = buttonClasses({ variant, size, className })

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error('<Button asChild> expects a single React element child.')
    }
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>
    return cloneElement(
      child,
      { className: cn(classes, child.props.className) },
      <ButtonContent arrow={arrow}>{child.props.children}</ButtonContent>,
    )
  }

  if (rest.href !== undefined) {
    const linkProps = rest as Omit<ButtonAsLink, keyof BaseProps | 'asChild'>
    return (
      <Link {...linkProps} className={classes}>
        <ButtonContent arrow={arrow}>{children}</ButtonContent>
      </Link>
    )
  }

  const { type = 'button', ...buttonProps } = rest as Omit<
    ButtonAsButton,
    keyof BaseProps | 'asChild'
  >
  return (
    <button type={type} {...buttonProps} className={classes}>
      <ButtonContent arrow={arrow}>{children}</ButtonContent>
    </button>
  )
}
