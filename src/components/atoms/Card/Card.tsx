import { type KeyboardEvent, type ReactNode, forwardRef } from 'react'
import styles from './Card.module.css'

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost' | 'brand'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface CardProps {
  variant?: CardVariant
  padding?: CardPadding
  hoverable?: boolean
  clickable?: boolean
  selected?: boolean
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  onClick?: () => void
  className?: string
  as?: 'div' | 'article' | 'section' | 'li'
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    variant = 'default',
    padding = 'md',
    hoverable = false,
    clickable = false,
    selected = false,
    header,
    footer,
    children,
    onClick,
    className,
    as: Component = 'div',
  },
  ref,
) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!clickable || !onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const interactiveProps = clickable
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick,
        onKeyDown: handleKeyDown,
      }
    : { onClick }

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={[
        styles.card,
        styles[`card--${variant}`],
        styles[`card--p-${padding}`],
        hoverable && styles['card--hoverable'],
        clickable && styles['card--clickable'],
        selected && styles['card--selected'],
        className,
      ].filter(Boolean).join(' ')}
      {...interactiveProps}
    >
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Component>
  )
})

/* ── Sub-components for composed usage ─────────────────────────── */

export interface CardSectionProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: CardSectionProps) {
  return (
    <div className={[styles.body, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div className={[styles.footer, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
