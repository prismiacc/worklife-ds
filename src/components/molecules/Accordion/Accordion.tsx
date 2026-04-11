import { type ReactNode, useCallback, useId, useState } from 'react'
import styles from './Accordion.module.css'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
  icon?: ReactNode
  badge?: string | number
  disabled?: boolean
}

export type AccordionVariant = 'default' | 'flush' | 'card'
export type AccordionSize = 'sm' | 'md' | 'lg'

export interface AccordionProps {
  items: AccordionItem[]
  multiple?: boolean
  defaultOpen?: string[]
  value?: string[]
  onChange?: (openIds: string[]) => void
  variant?: AccordionVariant
  size?: AccordionSize
  className?: string
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  value,
  onChange,
  variant = 'default',
  size = 'md',
  className,
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState<string[]>(defaultOpen)
  const baseId = useId()

  const isControlled = value !== undefined
  const openIds = isControlled ? value : internalOpen

  const toggle = useCallback(
    (id: string) => {
      let next: string[]

      if (openIds.includes(id)) {
        next = openIds.filter((openId) => openId !== id)
      } else if (multiple) {
        next = [...openIds, id]
      } else {
        next = [id]
      }

      if (!isControlled) {
        setInternalOpen(next)
      }
      onChange?.(next)
    },
    [openIds, multiple, isControlled, onChange],
  )

  return (
    <div
      className={[
        styles.accordion,
        styles[`accordion--${variant}`],
        styles[`accordion--${size}`],
        className,
      ].filter(Boolean).join(' ')}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        const triggerId = `${baseId}-trigger-${item.id}`
        const panelId = `${baseId}-panel-${item.id}`

        return (
          <div
            key={item.id}
            className={[
              styles.item,
              isOpen && styles['item--open'],
              item.disabled && styles['item--disabled'],
            ].filter(Boolean).join(' ')}
          >
            <button
              id={triggerId}
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
            >
              <span className={styles.triggerContent}>
                {item.icon && <span className={styles.triggerIcon}>{item.icon}</span>}
                <span className={styles.triggerTitle}>{item.title}</span>
                {item.badge !== undefined && (
                  <span className={styles.triggerBadge}>{item.badge}</span>
                )}
              </span>
              <span className={styles.chevron} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={styles.panel}
            >
              <div className={styles.panelInner}>
                <div className={styles.panelContent}>{item.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
