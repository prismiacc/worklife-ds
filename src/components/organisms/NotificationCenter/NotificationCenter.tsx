import { useState, useRef, useEffect, type ReactNode } from 'react'
import styles from './NotificationCenter.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type NotifVariant = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id:        string
  title:     string
  body?:     string
  variant?:  NotifVariant
  read?:     boolean
  timestamp: Date
  avatar?:   string
  action?:   { label: string; onClick: () => void }
}

export interface NotificationCenterProps {
  notifications:  Notification[]
  onMarkRead:     (id: string) => void
  onMarkAllRead:  () => void
  onDismiss?:     (id: string) => void
  trigger:        ReactNode
  maxHeight?:     number
}

/* ── Time ago ───────────────────────────────────────────────────── */
function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 1)  return 'agora'
  if (mins < 60) return `${mins}m`
  if (hours < 24) return `${hours}h`
  return `${days}d`
}

/* ── Variant icon ───────────────────────────────────────────────── */
function VariantIcon({ variant = 'info' }: { variant?: NotifVariant }) {
  const colors: Record<NotifVariant, string> = {
    info:    'var(--wlh-purple-500)',
    success: 'var(--wlh-green-500)',
    warning: 'var(--wlh-amber-500)',
    error:   'var(--wlh-red-500)',
  }
  return (
    <div className={styles.variantDot} style={{ background: colors[variant] }} aria-hidden="true" />
  )
}

/* ── NotificationCenter ─────────────────────────────────────────── */
export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  trigger,
  maxHeight = 420,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const unread = notifications.filter(n => !n.read).length

  /* Close on outside click */
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {/* Trigger */}
      <div
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        role="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Notificações${unread > 0 ? ` — ${unread} não lidas` : ''}`}
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(o => !o)}
      >
        {trigger}
        {unread > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={styles.dropdown}
          role="region"
          aria-label="Centro de notificações"
        >
          {/* Header */}
          <div className={styles.header}>
            <h3 className={styles.headerTitle}>Notificações</h3>
            {unread > 0 && (
              <button type="button" className={styles.markAllBtn} onClick={onMarkAllRead}>
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <ul
            className={styles.list}
            style={{ maxHeight }}
            role="list"
            aria-label="Lista de notificações"
          >
            {notifications.length === 0 ? (
              <li className={styles.empty}>
                <svg viewBox="0 0 32 32" fill="none" width="32" height="32" aria-hidden="true">
                  <path d="M16 4a9 9 0 0 0-9 9v3l-2 4h22l-2-4v-3a9 9 0 0 0-9-9Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M13 24a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span>Nenhuma notificação</span>
              </li>
            ) : (
              notifications.map(notif => (
                <li
                  key={notif.id}
                  className={[styles.item, !notif.read ? styles['item--unread'] : ''].filter(Boolean).join(' ')}
                >
                  <div className={styles.itemInner} onClick={() => onMarkRead(notif.id)}>
                    <VariantIcon variant={notif.variant} />

                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemTitle}>{notif.title}</span>
                        <span className={styles.itemTime}>{timeAgo(notif.timestamp)}</span>
                      </div>
                      {notif.body && (
                        <p className={styles.itemBody}>{notif.body}</p>
                      )}
                      {notif.action && (
                        <button
                          type="button"
                          className={styles.itemAction}
                          onClick={e => { e.stopPropagation(); notif.action!.onClick() }}
                        >
                          {notif.action.label}
                        </button>
                      )}
                    </div>

                    {!notif.read && (
                      <div className={styles.unreadDot} aria-hidden="true" />
                    )}
                  </div>

                  {onDismiss && (
                    <button
                      type="button"
                      className={styles.dismissBtn}
                      onClick={() => onDismiss(notif.id)}
                      aria-label="Remover notificação"
                    >
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" width="10" height="10" aria-hidden="true">
                        <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
                      </svg>
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className={styles.footer}>
              <button type="button" className={styles.viewAllBtn} onClick={() => setOpen(false)}>
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
