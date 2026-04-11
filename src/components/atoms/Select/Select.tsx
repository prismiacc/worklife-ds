import { useId, forwardRef, type SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

export type SelectSize   = 'sm' | 'md' | 'lg'
export type SelectStatus = 'default' | 'error' | 'success'

export interface SelectOption {
  value:     string
  label:     string
  disabled?: boolean
}

export interface SelectGroup {
  label:   string
  options: SelectOption[]
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options:      (SelectOption | SelectGroup)[]
  placeholder?: string
  size?:        SelectSize
  status?:      SelectStatus
  fullWidth?:   boolean
}

function isGroup(opt: SelectOption | SelectGroup): opt is SelectGroup {
  return 'options' in opt
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    options,
    placeholder,
    size      = 'md',
    status    = 'default',
    fullWidth = false,
    disabled,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <div
      className={[
        styles.wrapper,
        styles[`wrapper--${size}`],
        fullWidth ? styles['wrapper--full'] : '',
        disabled   ? styles['wrapper--disabled']   : '',
        status !== 'default' ? styles[`wrapper--${status}`] : '',
        className,
      ].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      data-status={status !== 'default' ? status : undefined}
    >
      <select
        ref={ref}
        id={id}
        disabled={disabled}
        className={styles.select}
        aria-invalid={status === 'error' ? true : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt, i) =>
          isGroup(opt) ? (
            <optgroup key={i} label={opt.label}>
              {opt.options.map(o => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ),
        )}
      </select>

      {/* Chevron icon */}
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4,6 8,10 12,6" />
        </svg>
      </span>
    </div>
  )
})
