import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import styles from './Input.module.css'

export type InputType   = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
export type InputSize   = 'sm' | 'md' | 'lg'
export type InputStatus = 'default' | 'error' | 'success'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?:         InputSize
  status?:       InputStatus
  /** Ícone ou texto na borda esquerda */
  leadingAddon?: ReactNode
  /** Ícone ou texto na borda direita */
  trailingAddon?:ReactNode
  /** aria-describedby — passa o id do HelperText para acessibilidade */
  describedBy?:  string
}

export function Input({
  type          = 'text',
  size          = 'md',
  status        = 'default',
  leadingAddon,
  trailingAddon,
  describedBy,
  disabled,
  className,
  id: idProp,
  ...rest
}: InputProps) {
  const autoId = useId()
  const id = idProp ?? autoId

  return (
    <div
      className={[
        styles.inputRoot,
        styles[`inputRoot--${size}`],
        styles[`inputRoot--${status}`],
        disabled && styles['inputRoot--disabled'],
        leadingAddon  && styles['inputRoot--hasLeading'],
        trailingAddon && styles['inputRoot--hasTrailing'],
        className,
      ].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      data-status={status !== 'default' ? status : undefined}
    >
      {leadingAddon && (
        <span className={styles.addon} data-position="leading" aria-hidden="true">
          {leadingAddon}
        </span>
      )}

      <input
        {...rest}
        id={id}
        type={type}
        disabled={disabled}
        aria-invalid={status === 'error' || undefined}
        aria-describedby={describedBy}
        className={styles.input}
      />

      {trailingAddon && (
        <span className={styles.addon} data-position="trailing" aria-hidden="true">
          {trailingAddon}
        </span>
      )}
    </div>
  )
}
