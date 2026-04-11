import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'amber'
export type BadgeSize    = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:    BadgeVariant
  size?:       BadgeSize
  /** Ponto colorido antes do label */
  dot?:        boolean
  /** Ícone antes do label */
  icon?:       ReactNode
  /** Remove o badge quando clicado (passa onDismiss) */
  onDismiss?:  () => void
}

export function Badge({
  variant   = 'default',
  size      = 'md',
  dot       = false,
  icon,
  onDismiss,
  children,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={[
        styles.badge,
        styles[`badge--${variant}`],
        styles[`badge--${size}`],
        className,
      ].filter(Boolean).join(' ')}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={styles.dismiss}
          aria-label="Remover"
        >
          <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="2" y1="2" x2="8" y2="8" />
            <line x1="8" y1="2" x2="2" y2="8" />
          </svg>
        </button>
      )}
    </span>
  )
}
