import {
  useState, useEffect, useRef, useCallback, useMemo,
  createContext, useContext, type ReactNode, type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './CommandMenu.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export interface CommandItem {
  id:       string
  label:    string
  icon?:    ReactNode
  group?:   string
  shortcut?: string[]
  keywords?: string[]
  onSelect: () => void
}

export interface CommandMenuProps {
  items:       CommandItem[]
  isOpen:      boolean
  onClose:     () => void
  placeholder?: string
}

/* ── Context + hook ─────────────────────────────────────────────── */
interface CommandCtx { open: () => void; close: () => void; isOpen: boolean }
const CommandContext = createContext<CommandCtx | null>(null)

export function useCommand() {
  const ctx = useContext(CommandContext)
  if (!ctx) throw new Error('useCommand deve estar dentro de <CommandProvider>')
  return ctx
}

export function CommandProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open  = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  /* ⌘K / Ctrl+K global shortcut */
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <CommandContext.Provider value={{ open, close, isOpen }}>
      {children}
    </CommandContext.Provider>
  )
}

/* ── fuzzy match ────────────────────────────────────────────────── */
function fuzzyMatch(query: string, item: CommandItem): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  const haystack = [item.label, ...(item.keywords ?? []), item.group ?? '']
    .join(' ').toLowerCase()
  return haystack.includes(q)
}

/* ── CommandMenu ────────────────────────────────────────────────── */
export function CommandMenu({
  items,
  isOpen,
  onClose,
  placeholder = 'Buscar comandos...',
}: CommandMenuProps) {
  const [query, setQuery]       = useState('')
  const [cursor, setCursor]     = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLUListElement>(null)

  /* Filter + group */
  const filtered = useMemo(() =>
    items.filter(item => fuzzyMatch(query, item)),
    [items, query],
  )

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    filtered.forEach(item => {
      const g = item.group ?? 'Geral'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(item)
    })
    return Array.from(map.entries())
  }, [filtered])

  const flat = useMemo(() => filtered, [filtered])

  /* Focus input on open */
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setCursor(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  /* Lock body scroll */
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  /* Scroll active item into view */
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-active="true"]`) as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(c => Math.min(c + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(c => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      flat[cursor]?.onSelect()
      onClose()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className={styles.backdrop} onClick={onClose} aria-hidden="false">
      <div
        className={styles.dialog}
        role="dialog"
        aria-label="Menu de comandos"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className={styles.inputRow}>
          <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="4" /><line x1="10" y1="10" x2="13.5" y2="13.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0) }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.input}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.escKey}>ESC</kbd>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          className={styles.list}
          role="listbox"
          aria-label="Resultados"
        >
          {flat.length === 0 ? (
            <li className={styles.empty}>Nenhum resultado para "{query}"</li>
          ) : (
            groups.map(([groupName, groupItems]) => {
              return (
                <li key={groupName} className={styles.group}>
                  <div className={styles.groupLabel}>{groupName}</div>
                  <ul role="group" aria-label={groupName} className={styles.groupList}>
                    {groupItems.map(item => {
                      const idx = flat.indexOf(item)
                      const isActive = idx === cursor
                      return (
                        <li key={item.id} role="none">
                          <button
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            data-active={isActive}
                            className={[styles.item, isActive ? styles['item--active'] : ''].filter(Boolean).join(' ')}
                            onClick={() => { item.onSelect(); onClose() }}
                            onMouseEnter={() => setCursor(idx)}
                          >
                            {item.icon && <span className={styles.item__icon}>{item.icon}</span>}
                            <span className={styles.item__label}>{item.label}</span>
                            {item.shortcut && (
                              <span className={styles.item__shortcuts}>
                                {item.shortcut.map((k, i) => <kbd key={i} className={styles.kbd}>{k}</kbd>)}
                              </span>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })
          )}
        </ul>

        {/* Footer */}
        <div className={styles.footer} aria-hidden="true">
          <span><kbd className={styles.kbd}>↑↓</kbd> navegar</span>
          <span><kbd className={styles.kbd}>↵</kbd> selecionar</span>
          <span><kbd className={styles.kbd}>ESC</kbd> fechar</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
