import { useMemo, type ReactNode, type CSSProperties } from 'react'
import { Flame } from 'lucide-react'
import styles from './HabitTracker.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type HabitFrequency = 'daily' | 'weekdays' | 'custom'

export interface HabitEntry {
  date:      string    // ISO: 'YYYY-MM-DD'
  completed: boolean
  value?:    number    // optional quantity (e.g. minutes, reps)
}

export interface HabitTrackerProps {
  name:        string
  description?: string
  icon?:       ReactNode
  color?:      string   // CSS color — default wlh-navy-500
  frequency?:  HabitFrequency
  streak?:     number   // current streak (days)
  bestStreak?: number
  completionRate?: number  // 0–100
  entries:     HabitEntry[]
  weeks?:      number   // grid width in weeks (default 17 ≈ 4 months)
  onToggle?:   (date: string, current: boolean) => void
  className?:  string
}

/* ── Helpers ────────────────────────────────────────────────────── */
function toISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

/** Build a grid of weeks × 7 days ending today */
function buildGrid(weeks: number): Date[][] {
  const today  = new Date()
  today.setHours(0, 0, 0, 0)
  const totalDays = weeks * 7
  // go back to the most recent Sunday (or whatever aligns to cols)
  const startDayOfWeek = today.getDay() // 0=Sun
  const startDate = addDays(today, -(totalDays - 1 + startDayOfWeek) + startDayOfWeek)
  // build flat list, then chunk into weeks
  const days: Date[] = []
  for (let i = 0; i < totalDays; i++) days.push(addDays(startDate, i))
  const grid: Date[][] = []
  for (let w = 0; w < weeks; w++) grid.push(days.slice(w * 7, (w + 1) * 7))
  return grid
}

const DAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

/* ── HabitTracker ───────────────────────────────────────────────── */
export function HabitTracker({
  name,
  description,
  icon    = '✦',
  color   = 'var(--wlh-navy-500)',
  streak,
  bestStreak,
  completionRate,
  entries,
  weeks   = 17,
  onToggle,
  className,
}: HabitTrackerProps) {
  const grid = useMemo(() => buildGrid(weeks), [weeks])
  const today = toISO(new Date())

  /* Build lookup map for O(1) access */
  const entryMap = useMemo(() => {
    const map = new Map<string, HabitEntry>()
    entries.forEach(e => map.set(e.date, e))
    return map
  }, [entries])

  /* Month labels: emit label when month changes across columns */
  const monthLabels = useMemo(() => {
    const labels: { weekIdx: number; label: string }[] = []
    let lastMonth = -1
    grid.forEach((week, wi) => {
      const month = week[0].getMonth()
      if (month !== lastMonth) {
        labels.push({ weekIdx: wi, label: MONTH_NAMES[month] })
        lastMonth = month
      }
    })
    return labels
  }, [grid])

  function getLevel(entry: HabitEntry | undefined): 0 | 1 | 2 | 3 | 4 {
    if (!entry?.completed) return 0
    if (entry.value === undefined) return 4
    // normalize value if present (arbitrary scale)
    const v = entry.value
    if (v <= 25)  return 1
    if (v <= 50)  return 2
    if (v <= 75)  return 3
    return 4
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.icon} style={{ background: `${color}20`, color }}>{icon}</span>
        <div className={styles.meta}>
          <span className={styles.name}>{name}</span>
          {description && <span className={styles.description}>{description}</span>}
        </div>
        {streak !== undefined && (
          <div className={styles.streakBadge}>
            <Flame size={14} aria-hidden="true" className={styles.streakFlame} />
            <span className={styles.streakNum}>{streak}</span>
            <span className={styles.streakUnit}>dias</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      {(bestStreak !== undefined || completionRate !== undefined) && (
        <div className={styles.stats}>
          {bestStreak !== undefined && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{bestStreak}</span>
              <span className={styles.statLabel}>Melhor sequência</span>
            </div>
          )}
          {completionRate !== undefined && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{completionRate}%</span>
              <span className={styles.statLabel}>Conclusão</span>
            </div>
          )}
        </div>
      )}

      {/* Contribution grid */}
      <div className={styles.gridWrapper}>
        {/* Month labels row */}
        <div className={styles.monthRow} style={{ gridTemplateColumns: `16px repeat(${weeks}, 1fr)` }}>
          <span /> {/* spacer for day labels */}
          {grid.map((_, wi) => {
            const ml = monthLabels.find(m => m.weekIdx === wi)
            return (
              <span key={wi} className={styles.monthLabel}>
                {ml ? ml.label : ''}
              </span>
            )
          })}
        </div>

        {/* Grid: rows = days of week, cols = weeks */}
        <div className={styles.grid}>
          {/* Day labels column */}
          <div className={styles.dayLabels}>
            {DAY_LABELS.map((d, i) => (
              <span key={i} className={styles.dayLabel}>{i % 2 === 1 ? d : ''}</span>
            ))}
          </div>

          {/* Weeks columns */}
          <div className={styles.weeks} style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
            {grid.map((week, wi) => (
              <div key={wi} className={styles.weekCol}>
                {week.map((day, di) => {
                  const iso   = toISO(day)
                  const entry = entryMap.get(iso)
                  const level = getLevel(entry)
                  const isToday   = iso === today
                  const isFuture  = iso > today
                  const completed = entry?.completed ?? false

                  return (
                    <button
                      key={di}
                      type="button"
                      className={[
                        styles.cell,
                        styles[`cell--l${level}`],
                        isToday    ? styles['cell--today']   : '',
                        isFuture   ? styles['cell--future']  : '',
                        onToggle && !isFuture ? styles['cell--interactive'] : '',
                      ].filter(Boolean).join(' ')}
                      style={
                        level > 0
                          ? { '--habit-color': color } as CSSProperties
                          : undefined
                      }
                      disabled={isFuture || !onToggle}
                      onClick={() => onToggle?.(iso, completed)}
                      aria-label={`${iso}${completed ? ' — concluído' : ''}`}
                      aria-pressed={completed}
                      title={iso}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Menos</span>
          {([0, 1, 2, 3, 4] as const).map(l => (
            <span
              key={l}
              className={[styles.cell, styles[`cell--l${l}`]].join(' ')}
              style={l > 0 ? { '--habit-color': color } as CSSProperties : undefined}
            />
          ))}
          <span className={styles.legendLabel}>Mais</span>
        </div>
      </div>
    </div>
  )
}
