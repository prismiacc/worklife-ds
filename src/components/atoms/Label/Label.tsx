import type { LabelHTMLAttributes } from 'react'
import styles from './Label.module.css'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  disabled?: boolean
}

export function Label({
  required,
  disabled,
  children,
  className,
  ...rest
}: LabelProps) {
  return (
    <label
      {...rest}
      className={[
        styles.label,
        disabled && styles['label--disabled'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      {required && (
        <span className={styles.label__required} aria-hidden="true">
          {' '}*
        </span>
      )}
    </label>
  )
}
