import { type ReactNode } from 'react'
import { Heart, CheckCircle2, Target, Timer, Smile, Users } from 'lucide-react'
import styles from './InsightCard.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type InsightCategory = 'wellbeing' | 'habits' | 'goals' | 'focus' | 'mood' | 'team'
export type InsightPriority = 'high' | 'medium' | 'low'
export type InsightAction = { label: string; onClick: () => void }

export interface InsightCardProps {
  id:          string
  title:       string
  body:        string
  category:    InsightCategory
  priority?:   InsightPriority
  metric?:     { label: string; value: string; trend?: number }
  actions?:    InsightAction[]
  onDismiss?:  () => void
  isNew?:      boolean
  className?:  string
}

/* ── Category config ───────────────────────────────────────────── */
const CATEGORY_CONFIG: Record<InsightCategory, { icon: ReactNode; colorClass: string; label: string }> = {
  wellbeing: { icon: <Heart        size={14} />, colorClass: 'cat--navy',   label: 'Bem-estar' },
  habits:    { icon: <CheckCircle2 size={14} />, colorClass: 'cat--green',  label: 'H\u00e1bitos'   },
  goals:     { icon: <Target       size={14} />, colorClass: 'cat--amber',  label: 'Metas'     },
  focus:     { icon: <Timer        size={14} />, colorClass: 'cat--purple', label: 'Foco'      },
  mood:      { icon: <Smile        size={14} />, colorClass: 'cat--amber',  label: 'Humor'     },
  team:      { icon: <Users        size={14} />, colorClass: 'cat--navy',   label: 'Equipe'    },
}

/* ── Priority config ───────────────────────────────────────────── */
const PRIORITY_CONFIG: Record<InsightPriority, string> = {
  high:   'priority--high',
  medium: 'priority--medium',
  low:    'priority--low',
}

/* ── Trend arrow helper ────────────────────────────────────────── */
function TrendArrow({ trend }: { trend: number }): ReactNode {
  if (trend === 0) return null
  const isUp = trend > 0
  return (
    <span
      className={[styles.trend, isUp ? styles['trend--up'] : styles['trend--down']].join(' ')}
      aria-label={isUp ? `Aumento de ${trend}%` : `Queda de ${Math.abs(trend)}%`}
    >
      <svg
        className={styles.trendIcon}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={isUp ? 'M6 10V2M6 2L2.5 5.5M6 2L9.5 5.5' : 'M6 2V10M6 10L2.5 6.5M6 10L9.5 6.5'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {Math.abs(trend)}%
    </span>
  )
}

/* ── InsightCard ───────────────────────────────────────────────── */
export function InsightCard({
  id,
  title,
  body,
  category,
  priority = 'medium',
  metric,
  actions,
  onDismiss,
  isNew = false,
  className,
}: InsightCardProps) {
  const cat = CATEGORY_CONFIG[category]
  const priClass = PRIORITY_CONFIG[priority]
  const visibleActions = actions?.slice(0, 2) ?? []

  return (
    <article
      id={id}
      className={[styles.root, styles[priClass], className].filter(Boolean).join(' ')}
    >
      {/* ── Top row ──────────────────────────────────────────── */}
      <div className={styles.topRow}>
        <span className={[styles.chip, styles[cat.colorClass]].join(' ')}>
          <span className={styles.chipIcon} aria-hidden="true">{cat.icon}</span>
          {cat.label}
        </span>

        <span className={[styles.priorityDot, styles[`dot--${priority}`]].join(' ')} aria-label={`Prioridade ${priority}`} />

        {isNew && (
          <span className={styles.newBadge}>
            <span className={styles.newDot} aria-hidden="true" />
            Novo
          </span>
        )}

        <span className={styles.topRowSpacer} />

        {onDismiss && (
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={onDismiss}
            aria-label="Dispensar insight"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{body}</p>
      </div>

      {/* ── Metric row ───────────────────────────────────────── */}
      {metric && (
        <div className={styles.metricRow}>
          <span className={styles.metricValue}>{metric.value}</span>
          <span className={styles.metricLabel}>{metric.label}</span>
          {metric.trend !== undefined && <TrendArrow trend={metric.trend} />}
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────────── */}
      {visibleActions.length > 0 && (
        <div className={styles.actions}>
          {visibleActions.map(action => (
            <button
              key={action.label}
              type="button"
              className={styles.actionBtn}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </article>
  )
}
