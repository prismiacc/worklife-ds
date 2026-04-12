import React, { useState, useId } from 'react'
import { FormField } from '../FormField/FormField'
import type { InputProps } from '../../atoms/Input/Input'
import styles from './PasswordField.module.css'

type InputFormFieldProps = {
  as?: 'input'
  label: string
  hint?: string
  error?: string
  successMessage?: string
  hideLabel?: boolean
  required?: boolean
  charCount?: number
  maxLength?: number
  iconRight?: React.ReactNode
} & Omit<InputProps, 'status' | 'describedBy'>

/* ── Strength calculation ───────────────────────────────────────── */
export type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong'

function calcStrength(password: string): { level: StrengthLevel; score: number; label: string } {
  if (!password) return { level: 'weak', score: 0, label: '' }

  let score = 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels: { level: StrengthLevel; label: string }[] = [
    { level: 'weak',   label: 'Muito fraca' },
    { level: 'weak',   label: 'Fraca' },
    { level: 'fair',   label: 'Razoável' },
    { level: 'good',   label: 'Boa' },
    { level: 'strong', label: 'Forte' },
    { level: 'strong', label: 'Muito forte' },
  ]
  const entry = levels[Math.min(score, levels.length - 1)]
  return { level: entry.level, score, label: entry.label }
}

/* ── Props ──────────────────────────────────────────────────────── */
export interface PasswordFieldProps
  extends Omit<InputFormFieldProps, 'type' | 'iconRight'> {
  showStrength?: boolean
  strengthLabel?: boolean
}

/* ── PasswordField ──────────────────────────────────────────────── */
export function PasswordField({
  showStrength  = false,
  strengthLabel = true,
  value,
  onChange,
  ...rest
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const strengthId = useId()

  const passwordValue = typeof value === 'string' ? value : ''
  const strength = calcStrength(passwordValue)
  const showMeter = showStrength && passwordValue.length > 0

  return (
    <div className={styles.root}>
      <FormField
        as="input"
        {...(rest as InputFormFieldProps)}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        autoComplete={visible ? 'off' : 'current-password'}
        aria-describedby={showMeter ? strengthId : undefined}
        iconRight={
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible(v => !v)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={visible}
            tabIndex={-1}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />

      {showMeter && (
        <div className={styles.meter} id={strengthId} aria-live="polite">
          <div className={styles.bars}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={[
                  styles.bar,
                  strength.score > i ? styles[`bar--${strength.level}`] : '',
                ].filter(Boolean).join(' ')}
              />
            ))}
          </div>
          {strengthLabel && (
            <span className={[styles.strengthLabel, styles[`strengthLabel--${strength.level}`]].join(' ')}>
              {strength.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Icons ──────────────────────────────────────────────────────── */
function EyeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <path d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5M5 4.2C3.4 5.1 2 6.8 1 8c1.3 2.2 4 4.5 7 4.5a7 7 0 0 0 2.8-.6M3.5 3.5C4.9 2.6 6.4 2 8 2c3 0 5.7 2.3 7 4.5a13 13 0 0 1-2.2 2.8" />
    </svg>
  )
}
