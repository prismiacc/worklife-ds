import { ReactNode } from 'react'
import { Trophy, Timer } from 'lucide-react'
import styles from './ActivityFeed.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type ActivityType =
  | 'habit'
  | 'goal'
  | 'mood'
  | 'focus'
  | 'achievement'
  | 'note'
  | 'check-in'

export interface ActivityItem {
  id:          string
  type:        ActivityType
  title:       string
  description?: string
  timestamp:   Date | string
  icon?:       ReactNode
  value?:      string           // e.g. "25 min", "Score: 78"
  badge?:      string           // e.g. "Conquista"
  highlight?:  boolean
}

export interface ActivityFeedProps {
  items:       ActivityItem[]
  title?:      string
  maxItems?:   number
  showDividers?: boolean
  onItemClick?: (id: string) => void
  emptyMessage?: string
  className?:  string
}

/* ── Type config ─────────────────────────────────────────────────── */
const TYPE_CONFIG: Record<ActivityType, { bg: string; color: string; defaultIcon: ReactNode }> = {
  habit:       { bg: 'var(--wlh-green-100)',  color: 'var(--wlh-green-700)',  defaultIcon: '\u2713' },
  goal:        { bg: 'var(--wlh-navy-100)',   color: 'var(--wlh-navy-700)',   defaultIcon: '\u25CE' },
  mood:        { bg: 'var(--wlh-amber-100)',  color: 'var(--wlh-amber-700)',  defaultIcon: '\u25D5' },
  focus:       { bg: 'var(--wlh-purple-100)', color: 'var(--wlh-purple-700)', defaultIcon: <Timer size={14} /> },
  achievement: { bg: 'var(--wlh-amber-100)',  color: 'var(--wlh-amber-700)',  defaultIcon: <Trophy size={14} /> },
  note:        { bg: 'var(--wlh-slate-100)',  color: 'var(--wlh-slate-600)',  defaultIcon: '\u270E' },
  'check-in':  { bg: 'var(--wlh-green-50)',   color: 'var(--wlh-green-600)',  defaultIcon: '\u25C9' },
}

/* ── Relative time ──────────────────────────────────────────────── */
function timeAgo(ts: Date | string): string {
  const date  = ts instanceof Date ? ts : new Date(ts)
  const now   = new Date()
  const diff  = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60)              return 'agora'
  if (diff < 3600)            return `${Math.floor(diff / 60)}m`
  if (diff < 86400)           return `${Math.floor(diff / 3600)}h`
  if (diff < 86400 * 7)       return `${Math.floor(diff / 86400)}d`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

/* ── Group by day ───────────────────────────────────────────────── */
function groupByDay(items: ActivityItem[]): { label: string; items: ActivityItem[] }[] {
  const today     = new Date(); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)

  const groups = new Map<string, ActivityItem[]>()
  items.forEach(item => {
    const d = new Date(item.timestamp); d.setHours(0, 0, 0, 0)
    let key: string
    if (d.getTime() === today.getTime())     key = 'Hoje'
    else if (d.getTime() === yesterday.getTime()) key = 'Ontem'
    else key = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  })
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }))
}

/* ── ActivityFeed ───────────────────────────────────────────────── */
export function ActivityFeed({
  items,
  title          = 'Atividade Recente',
  maxItems,
  showDividers   = true,
  onItemClick,
  emptyMessage   = 'Nenhuma atividade ainda',
  className,
}: ActivityFeedProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items
  const groups       = groupByDay(displayItems)

  if (items.length === 0) {
    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.empty}>{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={styles.feed}>
        {groups.map((group, gi) => (
          <div key={gi} className={styles.group}>
            {showDividers && (
              <div className={styles.groupLabel}>{group.label}</div>
            )}
            <ul className={styles.list}>
              {group.items.map((item, ii) => {
                const cfg = TYPE_CONFIG[item.type]
                const isClickable = !!onItemClick

                return (
                  <li key={item.id} className={styles.itemWrapper}>
                    <div
                      className={[
                        styles.item,
                        item.highlight ? styles['item--highlight'] : '',
                        isClickable   ? styles['item--clickable']  : '',
                      ].filter(Boolean).join(' ')}
                      role={isClickable ? 'button' : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      onClick={() => onItemClick?.(item.id)}
                      onKeyDown={e => {
                        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          onItemClick?.(item.id)
                        }
                      }}
                      aria-label={isClickable ? item.title : undefined}
                    >
                      {/* Icon */}
                      <span
                        className={styles.iconWrap}
                        style={{ background: cfg.bg, color: cfg.color }}
                        aria-hidden="true"
                      >
                        {item.icon ?? cfg.defaultIcon}
                      </span>

                      {/* Content */}
                      <div className={styles.content}>
                        <div className={styles.topRow}>
                          <span className={styles.itemTitle}>{item.title}</span>
                          <span className={styles.time}>{timeAgo(item.timestamp)}</span>
                        </div>
                        {item.description && (
                          <p className={styles.desc}>{item.description}</p>
                        )}
                        {(item.value || item.badge) && (
                          <div className={styles.bottomRow}>
                            {item.value && (
                              <span className={styles.value} style={{ color: cfg.color }}>{item.value}</span>
                            )}
                            {item.badge && (
                              <span className={styles.badge}>{item.badge}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline connector (except last in group) */}
                    {ii < group.items.length - 1 && (
                      <span className={styles.connector} aria-hidden="true" />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
