import { type ReactNode, Fragment } from 'react'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label:    string
  href?:    string
  icon?:    ReactNode
  onClick?: () => void
}

export interface BreadcrumbProps {
  items:        BreadcrumbItem[]
  separator?:   ReactNode
  maxItems?:    number
  className?:   string
}

function BreadcrumbLink({ item, isCurrent }: { item: BreadcrumbItem; isCurrent: boolean }) {
  if (isCurrent) {
    return (
      <span className={styles.current} aria-current="page">
        {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
        {item.label}
      </span>
    )
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        className={styles.link}
        onClick={item.onClick}
      >
        {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
        {item.label}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={styles.link}
      onClick={item.onClick}
    >
      {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
      {item.label}
    </button>
  )
}

function getVisibleItems(items: BreadcrumbItem[], maxItems?: number): BreadcrumbItem[] {
  if (!maxItems || items.length <= maxItems) return items

  const first = items[0]
  const lastTwo = items.slice(-2)
  const ellipsis: BreadcrumbItem = { label: '\u2026' }

  return [first, ellipsis, ...lastTwo]
}

export function Breadcrumb({
  items,
  separator = '/',
  maxItems,
  className,
}: BreadcrumbProps) {
  const visibleItems = getVisibleItems(items, maxItems)

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={styles.list}>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1
          const isEllipsis = item.label === '\u2026'

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li className={styles.separator} aria-hidden="true">
                  {separator}
                </li>
              )}
              <li className={styles.item}>
                {isEllipsis ? (
                  <span className={styles.ellipsis} aria-hidden="true">{'\u2026'}</span>
                ) : (
                  <BreadcrumbLink item={item} isCurrent={isLast} />
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
