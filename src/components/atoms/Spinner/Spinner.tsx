import type { HTMLAttributes } from 'react'
import styles from './Spinner.module.css'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?:  SpinnerSize
  label?: string
}

export function Spinner({
  size  = 'md',
  label = 'Carregando…',
  className,
  ...rest
}: SpinnerProps) {
  return (
    <span
      {...rest}
      role="status"
      aria-label={label}
      className={[styles.spinner, styles[`spinner--${size}`], className].filter(Boolean).join(' ')}
    >
      <span className={styles.ring} aria-hidden="true" />
      <span className={styles['sr-only']}>{label}</span>
    </span>
  )
}
