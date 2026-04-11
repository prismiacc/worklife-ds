import { type ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '../../molecules/Breadcrumb'
import styles from './PageHeader.module.css'

export interface PageHeaderProps {
  title:         string
  subtitle?:     string
  breadcrumb?:   BreadcrumbItem[]
  actions?:      ReactNode
  badge?:        ReactNode
  tabs?:         ReactNode
  backHref?:     string
  onBack?:       () => void
  className?:    string
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  badge,
  tabs,
  backHref,
  onBack,
  className,
}: PageHeaderProps) {
  const rootClasses = [styles.root, className].filter(Boolean).join(' ')

  const backButton = (backHref || onBack) && (
    <a
      href={backHref ?? '#'}
      className={styles.backBtn}
      onClick={onBack ? (e) => { e.preventDefault(); onBack() } : undefined}
      aria-label="Voltar"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true">
        <polyline points="10 3 5 8 10 13" />
      </svg>
    </a>
  )

  return (
    <header className={rootClasses}>
      {breadcrumb && breadcrumb.length > 0 && (
        <div className={styles.breadcrumbRow}>
          <Breadcrumb items={breadcrumb} />
        </div>
      )}

      <div className={styles.titleRow}>
        <div className={styles.titleGroup}>
          {backButton}
          <h1 className={styles.title}>{title}</h1>
          {badge && <span className={styles.badge}>{badge}</span>}
        </div>
        {actions && (
          <div className={styles.actions}>{actions}</div>
        )}
      </div>

      {subtitle && (
        <p className={styles.subtitle}>{subtitle}</p>
      )}

      {tabs && (
        <div className={styles.tabs}>{tabs}</div>
      )}
    </header>
  )
}
