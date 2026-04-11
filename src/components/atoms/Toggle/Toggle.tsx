import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import styles from './Toggle.module.css'

export type ToggleSize = 'sm' | 'md' | 'lg'

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?:       ToggleSize
  label?:      ReactNode
  description?:string
  /** Exibe o label à esquerda do toggle */
  labelLeft?:  boolean
}

export function Toggle({
  size        = 'md',
  label,
  description,
  labelLeft   = false,
  disabled,
  className,
  id: idProp,
  ...rest
}: ToggleProps) {
  const autoId = useId()
  const id = idProp ?? autoId

  return (
    <label
      htmlFor={id}
      className={[
        styles.wrapper,
        labelLeft && styles['wrapper--labelLeft'],
        disabled  && styles['wrapper--disabled'],
        className,
      ].filter(Boolean).join(' ')}
    >
      {(label || description) && (
        <span className={styles.content}>
          {label      && <span className={styles.label}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </span>
      )}

      <span className={[styles.track, styles[`track--${size}`]].join(' ')}>
        <input
          {...rest}
          id={id}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className={styles.input}
          aria-checked={rest.checked}
        />
        <span className={styles.thumb} aria-hidden="true" />
      </span>
    </label>
  )
}
