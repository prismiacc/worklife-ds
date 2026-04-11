import { createContext, useContext, useCallback, useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Toast.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type ToastVariant  = 'default' | 'success' | 'warning' | 'error' | 'info'
export type ToastPosition = 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right'

export interface ToastItem {
  id:        string
  message:   string
  variant?:  ToastVariant
  duration?: number  /* ms — 0 = persiste até dismiss */
  action?:   { label: string; onClick: () => void }
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, 'id'>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

/* ── Context ────────────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}

/* ── Provider ───────────────────────────────────────────────────── */
export interface ToastProviderProps {
  children:   ReactNode
  position?:  ToastPosition
  maxVisible?:number
}

export function ToastProvider({
  children,
  position   = 'bottom-center',
  maxVisible = 5,
}: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setItems(prev => prev.filter(t => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current.clear()
    setItems([])
  }, [])

  const toast = useCallback((opts: Omit<ToastItem, 'id'>): string => {
    const id  = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const dur = opts.duration ?? 4500

    setItems(prev => {
      const next = [{ ...opts, id }, ...prev]
      return next.slice(0, maxVisible)
    })

    if (dur > 0) {
      const timer = setTimeout(() => dismiss(id), dur)
      timers.current.set(id, timer)
    }

    return id
  }, [dismiss, maxVisible])

  // Limpa timers ao desmontar
  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <ToastRegion items={items} position={position} onDismiss={dismiss} />,
        document.body
      )}
    </ToastContext.Provider>
  )
}

/* ── Region (lista de toasts) ───────────────────────────────────── */
interface ToastRegionProps {
  items:     ToastItem[]
  position:  ToastPosition
  onDismiss: (id: string) => void
}

function ToastRegion({ items, position, onDismiss }: ToastRegionProps) {
  return (
    <div
      className={[styles.region, styles[`region--${position}`]].join(' ')}
      aria-live="polite"
      aria-atomic="false"
      aria-label="Notificações"
    >
      {items.map(item => (
        <ToastCard key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

/* ── Card individual ────────────────────────────────────────────── */
const ICONS: Record<ToastVariant, ReactNode> = {
  default: null,
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
  info: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="7" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  ),
}

interface ToastCardProps {
  item:      ToastItem
  onDismiss: (id: string) => void
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  const variant = item.variant ?? 'default'
  const icon    = ICONS[variant]

  return (
    <div
      role="status"
      aria-live="polite"
      className={[styles.card, styles[`card--${variant}`]].join(' ')}
    >
      {icon && (
        <span className={styles.card__icon}>{icon}</span>
      )}

      <span className={styles.card__message}>{item.message}</span>

      {item.action && (
        <button
          type="button"
          className={styles.card__action}
          onClick={() => { item.action!.onClick(); onDismiss(item.id) }}
        >
          {item.action.label}
        </button>
      )}

      <button
        type="button"
        className={styles.card__dismiss}
        onClick={() => onDismiss(item.id)}
        aria-label="Fechar notificação"
      >
        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <line x1="2" y1="2" x2="10" y2="10" />
          <line x1="10" y1="2" x2="2" y2="10" />
        </svg>
      </button>
    </div>
  )
}
