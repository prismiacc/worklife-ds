import { ReactNode } from 'react'
import styles from './GoalCard.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type GoalStatus = 'on-track' | 'at-risk' | 'completed' | 'paused'

export interface GoalMilestone {
  id:        string
  label:     string
  done:      boolean
}

export interface GoalCardProps {
  title:        string
  description?: string
  progress:     number          // 0–100
  target?:      string          // e.g. "30 min/dia"
  current?:     string          // e.g. "22 min/dia"
  dueDate?:     string          // formatted string
  status?:      GoalStatus
  milestones?:  GoalMilestone[]
  icon?:        ReactNode
  onEdit?:      () => void
  onDelete?:    () => void
  className?:   string
}

/* ── Status config ──────────────────────────────────────────────── */
const STATUS_CONFIG: Record<GoalStatus, { label: string; class: string }> = {
  'on-track':  { label: 'No prazo',   class: 'status--onTrack'  },
  'at-risk':   { label: 'Em risco',   class: 'status--atRisk'   },
  'completed': { label: 'Concluído',  class: 'status--completed'},
  'paused':    { label: 'Pausado',    class: 'status--paused'   },
}

/* ── Progress bar color ─────────────────────────────────────────── */
function barColor(status: GoalStatus | undefined, progress: number) {
  if (status === 'completed') return 'var(--wlh-green-500)'
  if (status === 'at-risk')   return 'var(--wlh-red-400)'
  if (status === 'paused')    return 'var(--wlh-slate-400)'
  if (progress >= 80)         return 'var(--wlh-green-500)'
  if (progress >= 40)         return 'var(--wlh-amber-400)'
  return 'var(--wlh-navy-500)'
}

/* ── GoalCard ───────────────────────────────────────────────────── */
export function GoalCard({
  title,
  description,
  progress,
  target,
  current,
  dueDate,
  status = 'on-track',
  milestones = [],
  icon,
  onEdit,
  onDelete,
  className,
}: GoalCardProps) {
  const clamped    = Math.min(100, Math.max(0, progress))
  const cfg        = STATUS_CONFIG[status]
  const color      = barColor(status, clamped)
  const doneMiles  = milestones.filter(m => m.done).length

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* Header */}
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <div className={styles.headerText}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <span className={[styles.status, styles[cfg.class]].join(' ')}>
          {cfg.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressMeta}>
          <span className={styles.progressValue}>{clamped}%</span>
          {dueDate && <span className={styles.dueDate}>Prazo: {dueDate}</span>}
        </div>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso: ${clamped}%`}
        >
          <div
            className={styles.fill}
            style={{ width: `${clamped}%`, background: color }}
          />
        </div>

        {/* Current vs Target */}
        {(current || target) && (
          <div className={styles.metricRow}>
            {current && (
              <span className={styles.metricCurrent}>
                <span className={styles.metricDot} style={{ background: color }} />
                Atual: <strong>{current}</strong>
              </span>
            )}
            {target && (
              <span className={styles.metricTarget}>
                Meta: <strong>{target}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className={styles.milestones}>
          <span className={styles.milestonesLabel}>
            Marcos — {doneMiles}/{milestones.length}
          </span>
          <ul className={styles.milestoneList}>
            {milestones.map(m => (
              <li key={m.id} className={[styles.milestone, m.done ? styles['milestone--done'] : ''].join(' ')}>
                <span className={styles.milestoneCheck} aria-hidden="true">
                  {m.done ? '✓' : '○'}
                </span>
                {m.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className={styles.actions}>
          {onEdit && (
            <button className={styles.actionBtn} onClick={onEdit} type="button">
              Editar
            </button>
          )}
          {onDelete && (
            <button className={[styles.actionBtn, styles['actionBtn--danger']].join(' ')} onClick={onDelete} type="button">
              Excluir
            </button>
          )}
        </div>
      )}
    </div>
  )
}
