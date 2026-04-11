import type { TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import styles from './Textarea.module.css'

export type TextareaStatus = 'default' | 'error' | 'success'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?:     TextareaStatus
  /** Altura em linhas (aprox.) — padrão 4 */
  rows?:       number
  /** Proíbe redimensionamento manual */
  noResize?:   boolean
  describedBy?:string
}

export function Textarea({
  status      = 'default',
  rows        = 4,
  noResize    = false,
  describedBy,
  disabled,
  className,
  id: idProp,
  ...rest
}: TextareaProps) {
  const autoId = useId()
  const id = idProp ?? autoId

  return (
    <textarea
      {...rest}
      id={id}
      rows={rows}
      disabled={disabled}
      aria-invalid={status === 'error' || undefined}
      aria-describedby={describedBy}
      className={[
        styles.textarea,
        styles[`textarea--${status}`],
        noResize  && styles['textarea--noResize'],
        disabled  && styles['textarea--disabled'],
        className,
      ].filter(Boolean).join(' ')}
    />
  )
}
