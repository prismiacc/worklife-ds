import {
  useState, useRef, useCallback, type ReactNode, type KeyboardEvent,
} from 'react'
import styles from './Tabs.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type TabsVariant = 'line' | 'pill' | 'card'
export type TabsSize    = 'sm' | 'md' | 'lg'

export interface TabItem {
  id:       string
  label:    string
  icon?:    ReactNode
  badge?:   string | number
  disabled?: boolean
  content:  ReactNode
}

export interface TabsProps {
  tabs:          TabItem[]
  defaultTab?:   string
  activeTab?:    string
  onChange?:     (id: string) => void
  variant?:      TabsVariant
  size?:         TabsSize
  fullWidth?:    boolean
  className?:    string
}

/* ── Tabs ───────────────────────────────────────────────────────── */
export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActive,
  onChange,
  variant   = 'line',
  size      = 'md',
  fullWidth = false,
  className,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(
    defaultTab ?? tabs.find(t => !t.disabled)?.id ?? tabs[0]?.id,
  )

  const isControlled = controlledActive !== undefined
  const active = isControlled ? controlledActive : internalActive

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const listRef = useRef<HTMLDivElement>(null)

  const enabledTabs = tabs.filter(t => !t.disabled)

  const activate = useCallback((id: string) => {
    if (!isControlled) setInternalActive(id)
    onChange?.(id)
    tabRefs.current.get(id)?.focus()
  }, [isControlled, onChange])

  /* ── Roving tabindex + keyboard nav ─────────────────────────── */
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const idx = enabledTabs.findIndex(t => t.id === id)
    let next = -1

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (idx + 1) % enabledTabs.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (idx - 1 + enabledTabs.length) % enabledTabs.length
    } else if (e.key === 'Home') {
      next = 0
    } else if (e.key === 'End') {
      next = enabledTabs.length - 1
    } else {
      return
    }

    e.preventDefault()
    activate(enabledTabs[next].id)
  }

  const activeTab = tabs.find(t => t.id === active)

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* Tab list */}
      <div
        ref={listRef}
        role="tablist"
        aria-orientation="horizontal"
        className={[
          styles.list,
          styles[`list--${variant}`],
          styles[`list--${size}`],
          fullWidth ? styles['list--full'] : '',
        ].filter(Boolean).join(' ')}
      >
        {tabs.map(tab => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              ref={el => {
                if (el) tabRefs.current.set(tab.id, el)
                else tabRefs.current.delete(tab.id)
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              aria-disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && activate(tab.id)}
              onKeyDown={e => handleKeyDown(e, tab.id)}
              className={[
                styles.tab,
                styles[`tab--${variant}`],
                isActive ? styles['tab--active'] : '',
                tab.disabled ? styles['tab--disabled'] : '',
              ].filter(Boolean).join(' ')}
            >
              {tab.icon && (
                <span className={styles.tab__icon} aria-hidden="true">{tab.icon}</span>
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={styles.tab__badge}>{tab.badge}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab panels */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          className={styles.panel}
          tabIndex={0}
        >
          {tab.id === active && tab.content}
        </div>
      ))}
    </div>
  )
}
