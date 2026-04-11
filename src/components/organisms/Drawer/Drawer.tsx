import {
  useRef, useEffect, useCallback, useId,
  type ReactNode, type MouseEvent, type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './Drawer.module.css'

export type DrawerPlacement = 'left' | 'right' | 'bottom'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface DrawerProps {
  isOpen:         boolean
  onClose:        () => void
  title?:         string
  children:       ReactNode
  footer?:        ReactNode
  placement?:     DrawerPlacement
  size?:          DrawerSize
  closeOnOverlay?: boolean
  showClose?:     boolean
  className?:     string
}

function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(
    'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
  ))
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  placement     = 'right',
  size          = 'md',
  closeOnOverlay = true,
  showClose     = true,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  /* -- Focus management ------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return

    prevFocusRef.current = document.activeElement as HTMLElement

    const frame = requestAnimationFrame(() => {
      if (panelRef.current) {
        const focusable = getFocusable(panelRef.current)
        focusable[0]?.focus()
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      prevFocusRef.current?.focus()
    }
  }, [isOpen])

  /* -- Body scroll lock ------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  /* -- Escape key ------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [isOpen, onClose])

  /* -- Focus trap -------------------------------------------------------- */
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = getFocusable(panelRef.current)
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [])

  /* -- Backdrop click --------------------------------------------------- */
  const handleBackdropClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlay && e.target === e.currentTarget) onClose()
  }, [closeOnOverlay, onClose])

  if (!isOpen) return null

  const panelClasses = [
    styles.panel,
    styles[`panel--${placement}`],
    styles[`panel--${placement}--${size}`],
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onKeyDown={handleKeyDown}
        className={panelClasses}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className={styles.header}>
            {title && <h2 id={titleId} className={styles.title}>{title}</h2>}
            {showClose && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Fechar"
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
