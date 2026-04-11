import {
  createContext, useContext, useCallback, useState, useRef, useEffect,
  type ReactNode, type HTMLAttributes, type MouseEvent, type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  isOpen:       boolean
  onClose:      () => void
  /** Título exibido no header — usado também como aria-label */
  title?:       string
  /** Oculta o botão X e desativa fechar ao clicar no backdrop */
  isDismissable?: boolean
  size?:        ModalSize
  /** Elemento que receberá foco ao abrir (padrão: primeiro focável) */
  initialFocusRef?: React.RefObject<HTMLElement>
  children:     ReactNode
  footer?:      ReactNode
  className?:   string
}

/* ── Focus trap helpers ─────────────────────────────────────────── */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
}

/* ── Context (controle externo via hook) ────────────────────────── */
interface ModalContextValue {
  open:  (id: string) => void
  close: (id: string) => void
  isOpen: (id: string) => boolean
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function useModal(id: string) {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal deve ser usado dentro de <ModalController>')
  return {
    isOpen:  ctx.isOpen(id),
    open:  () => ctx.open(id),
    close: () => ctx.close(id),
    toggle: () => ctx.isOpen(id) ? ctx.close(id) : ctx.open(id),
  }
}

export function ModalController({ children }: { children: ReactNode }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const open   = useCallback((id: string) => setOpenIds(s => new Set(s).add(id)), [])
  const close  = useCallback((id: string) => setOpenIds(s => { const n = new Set(s); n.delete(id); return n }), [])
  const isOpen = useCallback((id: string) => openIds.has(id), [openIds])
  return (
    <ModalContext.Provider value={{ open, close, isOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

/* ── Modal ──────────────────────────────────────────────────────── */
export function Modal({
  isOpen,
  onClose,
  title,
  isDismissable = true,
  size = 'md',
  initialFocusRef,
  children,
  footer,
  className,
}: ModalProps) {
  const dialogRef  = useRef<HTMLDivElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  /* — Abre/fecha ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return

    // Salva o elemento com foco antes de abrir
    prevFocusRef.current = document.activeElement as HTMLElement

    // Foca o elemento inicial ou o primeiro focável
    const frame = requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else if (dialogRef.current) {
        const focusable = getFocusable(dialogRef.current)
        focusable[0]?.focus()
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [isOpen, initialFocusRef])

  useEffect(() => {
    if (!isOpen) {
      // Restaura o foco ao fechar
      prevFocusRef.current?.focus()
    }
  }, [isOpen])

  /* — Trava scroll do body ─────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  /* — Tecla Escape ────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen || !isDismissable) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [isOpen, isDismissable, onClose])

  /* — Focus trap ──────────────────────────────────────────────── */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = getFocusable(dialogRef.current)
    if (!focusable.length) return
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }

  /* — Backdrop click ──────────────────────────────────────────── */
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isDismissable && e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  const content = (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={handleKeyDown}
        className={[
          styles.dialog,
          styles[`dialog--${size}`],
          className,
        ].filter(Boolean).join(' ')}
      >
        {/* Header */}
        {(title || isDismissable) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {isDismissable && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Fechar modal"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="3" y1="3" x2="13" y2="13" />
                  <line x1="13" y1="3" x2="3" y2="13" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={styles.body}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : null
}

/* ── ModalHeader / ModalBody / ModalFooter (conveniência) ────────── */
export function ModalHeader({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.sectionHeader, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}

export function ModalBody({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.sectionBody, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}

export function ModalFooter({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.sectionFooter, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
