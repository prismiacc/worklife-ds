import { type ReactNode } from 'react'
import styles from './Navbar.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export interface NavbarProps {
  logo?:        ReactNode
  /** Slot central (ex: SearchField) */
  center?:      ReactNode
  /** Ações à direita (ícones, avatar, etc.) */
  actions?:     ReactNode
  /** Borda inferior */
  bordered?:    boolean
  className?:   string
}

/* ── Navbar ─────────────────────────────────────────────────────── */
export function Navbar({
  logo,
  center,
  actions,
  bordered = true,
  className,
}: NavbarProps) {
  return (
    <header
      className={[
        styles.navbar,
        bordered ? styles['navbar--bordered'] : '',
        className,
      ].filter(Boolean).join(' ')}
      role="banner"
    >
      {/* Logo / brand */}
      {logo && (
        <div className={styles.brand}>{logo}</div>
      )}

      {/* Center slot */}
      {center && (
        <div className={styles.center}>{center}</div>
      )}

      {/* Actions */}
      {actions && (
        <div className={styles.actions}>{actions}</div>
      )}
    </header>
  )
}

/* ── NavbarIconButton ───────────────────────────────────────────── */
export interface NavbarIconButtonProps {
  icon:      ReactNode
  label:     string
  badge?:    number
  onClick?:  () => void
}

export function NavbarIconButton({ icon, label, badge, onClick }: NavbarIconButtonProps) {
  return (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <span className={styles.iconBtn__icon}>{icon}</span>
      {badge !== undefined && badge > 0 && (
        <span className={styles.iconBtn__badge} aria-label={`${badge} notificações`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}

/* ── NavbarDivider ──────────────────────────────────────────────── */
export function NavbarDivider() {
  return <div className={styles.divider} aria-hidden="true" />
}
