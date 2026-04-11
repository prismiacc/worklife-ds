import { type ReactNode } from 'react'
import styles from './EmptyState.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type EmptyStateSize = 'sm' | 'md' | 'lg'

export interface EmptyStateAction {
  label:    string
  onClick:  () => void
  variant?: 'primary' | 'secondary' | 'ghost'
}

export interface EmptyStateProps {
  title:         string
  description?:  string
  icon?:         ReactNode
  /** Ilustração customizada (substitui icon) */
  illustration?: ReactNode
  primaryAction?:   EmptyStateAction
  secondaryAction?: EmptyStateAction
  size?:         EmptyStateSize
  className?:    string
}

/* ── Default illustrations por contexto ─────────────────────────── */
function DefaultIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="64" height="64" aria-hidden="true">
      <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M8 24h48" stroke="currentColor" strokeWidth="2" />
      <path d="M22 36h20M26 42h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* ── EmptyState ─────────────────────────────────────────────────── */
export function EmptyState({
  title,
  description,
  icon,
  illustration,
  primaryAction,
  secondaryAction,
  size      = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={[
        styles.root,
        styles[`root--${size}`],
        className,
      ].filter(Boolean).join(' ')}
      role="status"
      aria-label={title}
    >
      {/* Visual */}
      {(illustration || icon || !illustration) && (
        <div className={styles.visual}>
          {illustration ?? (
            <span className={styles.icon}>
              {icon ?? <DefaultIcon />}
            </span>
          )}
        </div>
      )}

      {/* Copy */}
      <div className={styles.copy}>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className={styles.actions}>
          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className={[styles.btn, styles[`btn--${primaryAction.variant ?? 'primary'}`]].join(' ')}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className={[styles.btn, styles[`btn--${secondaryAction.variant ?? 'ghost'}`]].join(' ')}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
