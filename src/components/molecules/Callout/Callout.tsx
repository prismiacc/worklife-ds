import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Callout.module.css'

export type CalloutVariant = 'info' | 'success' | 'warning' | 'error'

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant:    CalloutVariant
  title?:     string
  /** Ícone customizado — usa o padrão da variant se omitido */
  icon?:      ReactNode
  /** Ação opcional no canto direito */
  action?:    ReactNode
  /** Callback para fechar o callout */
  onDismiss?: () => void
}

const DEFAULT_ICONS: Record<CalloutVariant, ReactNode> = {
  info: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="7" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="5,8.5 7,10.5 11,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="8" y1="7" x2="8" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

const ROLES: Record<CalloutVariant, string> = {
  info:    'note',
  success: 'status',
  warning: 'alert',
  error:   'alert',
}

export function Callout({
  variant,
  title,
  icon,
  action,
  onDismiss,
  children,
  className,
  ...rest
}: CalloutProps) {
  return (
    <div
      {...rest}
      role={ROLES[variant]}
      className={[styles.callout, styles[`callout--${variant}`], className].filter(Boolean).join(' ')}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? DEFAULT_ICONS[variant]}
      </span>

      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.content}>{children}</div>}
      </div>

      {action && <div className={styles.action}>{action}</div>}

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={styles.dismiss}
          aria-label="Fechar"
        >
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </button>
      )}
    </div>
  )
}
