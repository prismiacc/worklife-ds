import { useState, useCallback, type ReactNode } from 'react'
import styles from './Tag.module.css'

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'amber'
export type TagSize = 'sm' | 'md' | 'lg'

export interface TagProps {
  label:       string
  variant?:    TagVariant
  size?:       TagSize
  selectable?: boolean
  selected?:   boolean
  onSelect?:   (selected: boolean) => void
  onRemove?:   () => void
  icon?:       ReactNode
  avatar?:     string
  disabled?:   boolean
  className?:  string
}

export function Tag({
  label,
  variant    = 'default',
  size       = 'md',
  selectable = false,
  selected: controlledSelected,
  onSelect,
  onRemove,
  icon,
  avatar,
  disabled   = false,
  className,
}: TagProps) {
  const [internalSelected, setInternalSelected] = useState(false)

  const isControlled = controlledSelected !== undefined
  const isSelected = isControlled ? controlledSelected : internalSelected

  const handleClick = useCallback(() => {
    if (!selectable || disabled) return
    const next = !isSelected
    if (!isControlled) setInternalSelected(next)
    onSelect?.(next)
  }, [selectable, disabled, isSelected, isControlled, onSelect])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!selectable || disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }, [selectable, disabled, handleClick])

  const rootClasses = [
    styles.tag,
    styles[`tag--${variant}`],
    styles[`tag--${size}`],
    isSelected ? styles['tag--selected'] : '',
    selectable ? styles['tag--selectable'] : '',
    disabled ? styles['tag--disabled'] : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <span
      className={rootClasses}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable && !disabled ? 0 : undefined}
      aria-pressed={selectable ? isSelected : undefined}
      aria-disabled={disabled || undefined}
      onClick={selectable ? handleClick : undefined}
      onKeyDown={selectable ? handleKeyDown : undefined}
    >
      {avatar && (
        <span className={styles.avatar} aria-hidden="true">
          {avatar}
        </span>
      )}
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{label}</span>
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          aria-label={`Remover ${label}`}
          disabled={disabled}
          tabIndex={-1}
        >
          <svg viewBox="0 0 10 10" width="8" height="8" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <line x1="2" y1="2" x2="8" y2="8" />
            <line x1="8" y1="2" x2="2" y2="8" />
          </svg>
        </button>
      )}
    </span>
  )
}
