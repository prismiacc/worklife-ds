import { useRef, useId, useState, type InputHTMLAttributes, type ChangeEvent } from 'react'
import styles from './SearchField.module.css'

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  value?:        string
  onSearch?:     (value: string) => void
  onClear?:      () => void
  size?:         'sm' | 'md' | 'lg'
  isLoading?:    boolean
  fullWidth?:    boolean
  placeholder?:  string
}

export function SearchField({
  value: controlledValue,
  onSearch,
  onClear,
  size        = 'md',
  isLoading   = false,
  fullWidth   = false,
  placeholder = 'Buscar...',
  onChange,
  className,
  id: idProp,
  ...rest
}: SearchFieldProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalValue, setInternalValue] = useState('')

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value)
    onChange?.(e)
    onSearch?.(e.target.value)
  }

  const handleClear = () => {
    if (!isControlled) setInternalValue('')
    onSearch?.('')
    onClear?.()
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') handleClear()
  }

  return (
    <div
      className={[
        styles.root,
        styles[`root--${size}`],
        fullWidth ? styles['root--full'] : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Search icon */}
      <span className={styles.iconLeft} aria-hidden="true">
        {isLoading ? (
          <svg className={styles.spinner} viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="4" />
            <line x1="10" y1="10" x2="13.5" y2="13.5" />
          </svg>
        )}
      </span>

      <input
        ref={inputRef}
        id={id}
        type="search"
        role="searchbox"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={styles.input}
        autoComplete="off"
        aria-label={placeholder}
        {...rest}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label="Limpar busca"
          tabIndex={-1}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" width="12" height="12" aria-hidden="true">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
      )}
    </div>
  )
}
