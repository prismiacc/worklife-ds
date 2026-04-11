import { useId } from 'react'
import { Label } from '../../atoms/Label/Label'
import { Input, type InputProps } from '../../atoms/Input/Input'
import { Textarea, type TextareaProps } from '../../atoms/Textarea/Textarea'
import { HelperText } from '../../atoms/HelperText/HelperText'
import styles from './FormField.module.css'

type InputFieldProps = {
  as?: 'input'
} & InputProps

type TextareaFieldProps = {
  as: 'textarea'
} & TextareaProps

export type FormFieldProps = (InputFieldProps | TextareaFieldProps) & {
  label:           string
  hint?:           string
  error?:          string
  successMessage?: string
  hideLabel?:      boolean
  required?:       boolean
  /** Contador de caracteres — passar o valor atual */
  charCount?:      number
  /** Limite para o contador */
  maxLength?:      number
}

/**
 * FormField — Label + Input (ou Textarea) + HelperText em uma unidade acessível.
 *
 * Conecta automaticamente: htmlFor → id, aria-describedby → HelperText,
 * aria-invalid, e exibe contador de caracteres quando maxLength é passado.
 *
 * @example
 * <FormField label="E-mail" type="email" error={errors.email} required />
 * <FormField as="textarea" label="Bio" rows={4} maxLength={200} charCount={bio.length} />
 */
export function FormField({
  label,
  hint,
  error,
  successMessage,
  hideLabel = false,
  required,
  disabled,
  id: idProp,
  className,
  charCount,
  maxLength,
  as = 'input',
  ...fieldProps
}: FormFieldProps) {
  const autoId   = useId()
  const fieldId  = idProp ?? autoId
  const helperId = `${fieldId}-helper`

  const hasHelper    = !!(error ?? successMessage ?? hint)
  const status       = error ? 'error' : successMessage ? 'success' : 'default'
  const helperVariant= error ? 'error' : successMessage ? 'success' : 'default'
  const helperContent= error ?? successMessage ?? hint

  const showCounter = maxLength !== undefined && charCount !== undefined
  const isOverLimit = showCounter && charCount > maxLength

  return (
    <div
      className={[styles.formField, className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
    >
      <div className={styles.formField__header}>
        <Label
          htmlFor={fieldId}
          required={required}
          disabled={disabled}
          className={hideLabel ? styles['formField__label--hidden'] : undefined}
        >
          {label}
        </Label>

        {showCounter && (
          <span
            className={[
              styles.formField__counter,
              isOverLimit && styles['formField__counter--over'],
            ].filter(Boolean).join(' ')}
            aria-live="polite"
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      {as === 'textarea' ? (
        <Textarea
          {...(fieldProps as TextareaProps)}
          id={fieldId}
          required={required}
          disabled={disabled}
          status={status}
          maxLength={maxLength}
          describedBy={hasHelper ? helperId : undefined}
        />
      ) : (
        <Input
          {...(fieldProps as InputProps)}
          id={fieldId}
          required={required}
          disabled={disabled}
          status={status}
          maxLength={maxLength}
          describedBy={hasHelper ? helperId : undefined}
          className={styles.formField__input}
        />
      )}

      <HelperText id={helperId} variant={helperVariant}>
        {helperContent}
      </HelperText>
    </div>
  )
}
