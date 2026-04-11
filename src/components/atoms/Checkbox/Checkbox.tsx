import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId, useRef, useEffect } from 'react'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label visível */
  label?:         ReactNode
  /** Texto de suporte abaixo do label */
  description?:   string
  /** Estado indeterminado (ex.: "selecionar todos" parcial) */
  indeterminate?: boolean
  /** Alinha o checkbox ao topo quando há description longa */
  alignTop?:      boolean
}

export function Checkbox({
  label,
  description,
  indeterminate = false,
  alignTop      = false,
  disabled,
  className,
  id: idProp,
  ...rest
}: CheckboxProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const inputRef = useRef<HTMLInputElement>(null)

  // Aplica `indeterminate` — não é possível via HTML attr, só via JS
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <label
      htmlFor={id}
      className={[
        styles.wrapper,
        alignTop && styles['wrapper--alignTop'],
        disabled && styles['wrapper--disabled'],
        className,
      ].filter(Boolean).join(' ')}
    >
      <span className={styles.control}>
        <input
          {...rest}
          ref={inputRef}
          id={id}
          type="checkbox"
          disabled={disabled}
          className={styles.input}
        />
        <span className={styles.box} aria-hidden="true">
          {/* checkmark SVG */}
          <svg
            className={styles.check}
            viewBox="0 0 12 10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {indeterminate ? (
              <line x1="2" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="2" />
            ) : (
              <polyline points="1.5,5 4.5,8 10.5,2" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </span>
      </span>

      {(label || description) && (
        <span className={styles.content}>
          {label && <span className={styles.label}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </span>
      )}
    </label>
  )
}
