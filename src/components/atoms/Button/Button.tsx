import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
export type ButtonSize    = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:      ButtonVariant
  size?:         ButtonSize
  isLoading?:    boolean
  loadingLabel?: string
  fullWidth?:    boolean
  /** Ícone à esquerda do label */
  iconLeft?:     ReactNode
  /** Ícone à direita do label */
  iconRight?:    ReactNode
  /** Modo icon-only — omite padding lateral, fica quadrado */
  iconOnly?:     boolean
}

export function Button({
  variant      = 'primary',
  size         = 'md',
  isLoading    = false,
  loadingLabel = 'Carregando…',
  fullWidth    = false,
  iconLeft,
  iconRight,
  iconOnly     = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      aria-disabled={isDisabled || undefined}
      className={[
        styles.btn,
        styles[`btn--${variant}`],
        styles[`btn--${size}`],
        fullWidth  && styles['btn--fullWidth'],
        iconOnly   && styles['btn--iconOnly'],
        isLoading  && styles['btn--loading'],
        className,
      ].filter(Boolean).join(' ')}
    >
      {isLoading && (
        <span className={styles.btn__spinner} aria-hidden="true" />
      )}

      {!isLoading && iconLeft && (
        <span className={styles.btn__icon} aria-hidden="true">{iconLeft}</span>
      )}

      {!isLoading && children && (
        <span className={iconOnly ? styles['sr-only'] : styles.btn__label}>
          {children}
        </span>
      )}

      {!isLoading && iconRight && (
        <span className={styles.btn__icon} aria-hidden="true">{iconRight}</span>
      )}

      {isLoading && (
        <span className={styles['sr-only']}>{loadingLabel}</span>
      )}
    </button>
  )
}
