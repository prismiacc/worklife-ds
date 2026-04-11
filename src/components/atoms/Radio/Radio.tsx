import { useId, type InputHTMLAttributes } from 'react'
import styles from './Radio.module.css'

/* ── Radio individual ───────────────────────────────────────────── */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label:       string
  description?: string
  size?:       'sm' | 'md'
}

export function Radio({
  label,
  description,
  size     = 'md',
  disabled,
  className,
  id: idProp,
  ...rest
}: RadioProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <label
      htmlFor={id}
      className={[
        styles.root,
        styles[`root--${size}`],
        disabled ? styles['root--disabled'] : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <span className={styles.control}>
        <input
          {...rest}
          id={id}
          type="radio"
          disabled={disabled}
          className={styles.input}
        />
        <span className={styles.dot} aria-hidden="true" />
      </span>
      <span className={styles.content}>
        <span className={styles.label}>{label}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </span>
    </label>
  )
}

/* ── RadioGroup ─────────────────────────────────────────────────── */
export interface RadioOption {
  value:       string
  label:       string
  description?: string
  disabled?:   boolean
}

export interface RadioGroupProps {
  name:        string
  label:       string
  options:     RadioOption[]
  value?:      string
  onChange?:   (value: string) => void
  orientation?: 'vertical' | 'horizontal'
  size?:       'sm' | 'md'
  error?:      string
  hint?:       string
  hideLabel?:  boolean
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  orientation = 'vertical',
  size        = 'md',
  error,
  hint,
  hideLabel   = false,
}: RadioGroupProps) {
  const descId = useId()

  return (
    <fieldset
      className={styles.group}
      aria-describedby={error || hint ? descId : undefined}
    >
      <legend className={[styles.groupLabel, hideLabel ? styles['groupLabel--sr'] : ''].filter(Boolean).join(' ')}>
        {label}
      </legend>

      <div className={[
        styles.options,
        styles[`options--${orientation}`],
      ].join(' ')}>
        {options.map(opt => (
          <Radio
            key={opt.value}
            name={name}
            label={opt.label}
            description={opt.description}
            value={opt.value}
            size={size}
            checked={value === opt.value}
            disabled={opt.disabled}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </div>

      {(hint || error) && (
        <span
          id={descId}
          className={error ? styles.error : styles.hint}
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </span>
      )}
    </fieldset>
  )
}
