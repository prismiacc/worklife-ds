import type { HTMLAttributes } from 'react'
import styles from './HelperText.module.css'

export type HelperTextVariant = 'default' | 'error' | 'success'

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: HelperTextVariant
  id?: string
}

export function HelperText({
  variant = 'default',
  id,
  children,
  className,
  ...rest
}: HelperTextProps) {
  if (!children) return null

  return (
    <p
      {...rest}
      id={id}
      className={[
        styles.helperText,
        variant !== 'default' && styles[`helperText--${variant}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {variant === 'error' && (
        <svg
          className={styles.helperText__icon}
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="8" cy="8" r="7" />
          <line x1="8" y1="5" x2="8" y2="8.5" />
          <circle cx="8" cy="11" r="0.5" fill="currentColor" />
        </svg>
      )}
      {variant === 'success' && (
        <svg
          className={styles.helperText__icon}
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="8" cy="8" r="7" />
          <polyline points="5,8 7,10.5 11,6" />
        </svg>
      )}
      {children}
    </p>
  )
}
