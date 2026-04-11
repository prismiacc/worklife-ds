import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import styles from './Dropdown.module.css'

export interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  description?: string
  danger?: boolean
  disabled?: boolean
  separator?: never
}

export interface DropdownSeparator {
  separator: true
  id: string
}

export type DropdownEntry = DropdownItem | DropdownSeparator

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownEntry[]
  onSelect: (id: string) => void
  placement?: DropdownPlacement
  width?: number | 'trigger'
  disabled?: boolean
  className?: string
}

function isSeparator(entry: DropdownEntry): entry is DropdownSeparator {
  return 'separator' in entry && entry.separator === true
}

function isSelectableItem(entry: DropdownEntry): entry is DropdownItem {
  return !isSeparator(entry) && !entry.disabled
}

export function Dropdown({
  trigger,
  items,
  onSelect,
  placement = 'bottom-start',
  width,
  disabled = false,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const triggerId = useId()

  const selectableIndices = items
    .map((item, i) => (isSelectableItem(item) ? i : -1))
    .filter((i) => i !== -1)

  const closeMenu = useCallback(() => {
    setOpen(false)
    setFocusIndex(-1)
  }, [])

  const openMenu = useCallback(() => {
    if (disabled) return
    setOpen(true)
    setFocusIndex(selectableIndices[0] ?? -1)
  }, [disabled, selectableIndices])

  const toggleMenu = useCallback(() => {
    if (open) closeMenu()
    else openMenu()
  }, [open, closeMenu, openMenu])

  // Close on outside click
  useEffect(() => {
    if (!open) return

    function handleMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open, closeMenu])

  // Focus management
  useEffect(() => {
    if (!open || focusIndex < 0 || !menuRef.current) return
    const items = menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]')
    const selectableIndex = selectableIndices.indexOf(focusIndex)
    if (selectableIndex >= 0 && items[selectableIndex]) {
      items[selectableIndex].focus()
    }
  }, [focusIndex, open, selectableIndices])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openMenu()
        }
        return
      }

      switch (e.key) {
        case 'Escape': {
          e.preventDefault()
          closeMenu()
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          const currentPos = selectableIndices.indexOf(focusIndex)
          const nextPos = currentPos < selectableIndices.length - 1 ? currentPos + 1 : 0
          setFocusIndex(selectableIndices[nextPos])
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          const currentPos = selectableIndices.indexOf(focusIndex)
          const prevPos = currentPos > 0 ? currentPos - 1 : selectableIndices.length - 1
          setFocusIndex(selectableIndices[prevPos])
          break
        }
        case 'Enter':
        case ' ': {
          e.preventDefault()
          if (focusIndex >= 0 && isSelectableItem(items[focusIndex])) {
            onSelect(items[focusIndex].id)
            closeMenu()
          }
          break
        }
        case 'Tab': {
          closeMenu()
          break
        }
      }
    },
    [open, openMenu, closeMenu, focusIndex, selectableIndices, items, onSelect],
  )

  const popoverStyle: React.CSSProperties = {
    width: width === 'trigger' ? '100%' : width ? `${width}px` : undefined,
  }

  return (
    <div
      ref={wrapperRef}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
    >
      <div
        id={triggerId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-disabled={disabled || undefined}
        onClick={toggleMenu}
        className={styles.trigger}
      >
        {trigger}
      </div>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={[styles.popover, styles[`popover--${placement}`]].join(' ')}
          style={popoverStyle}
        >
          {items.map((entry) => {
            if (isSeparator(entry)) {
              return <hr key={entry.id} className={styles.separator} role="separator" />
            }

            const itemIndex = items.indexOf(entry)
            return (
              <button
                key={entry.id}
                role="menuitem"
                tabIndex={-1}
                disabled={entry.disabled}
                aria-disabled={entry.disabled || undefined}
                className={[
                  styles.item,
                  entry.danger && styles['item--danger'],
                  entry.disabled && styles['item--disabled'],
                  itemIndex === focusIndex && styles['item--focused'],
                ].filter(Boolean).join(' ')}
                onClick={() => {
                  if (!entry.disabled) {
                    onSelect(entry.id)
                    closeMenu()
                  }
                }}
                onMouseEnter={() => {
                  if (!entry.disabled) setFocusIndex(itemIndex)
                }}
              >
                {entry.icon && <span className={styles.itemIcon}>{entry.icon}</span>}
                <span className={styles.itemContent}>
                  <span className={styles.itemLabel}>{entry.label}</span>
                  {entry.description && (
                    <span className={styles.itemDescription}>{entry.description}</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
