import { useMemo, type ReactNode } from 'react'
import { Angry, Frown, Meh, Smile, Laugh } from 'lucide-react'
import styles from './MoodHistory.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface MoodEntry {
  date:  string       // ISO 'YYYY-MM-DD'
  level: MoodLevel
  note?: string
  tags?: string[]
}

export type MoodChartView = 'week' | 'month'

export interface MoodHistoryProps {
  entries:     MoodEntry[]
  view?:       MoodChartView
  onLogMood?:  (level: MoodLevel) => void
  onEntryClick?: (entry: MoodEntry) => void
  showAverage?: boolean
  showLogToday?: boolean
  className?:  string
}

/* ── Mood config ────────────────────────────────────────────────── */
export const MOOD_CONFIG: Record<MoodLevel, { icon: ReactNode; label: string; color: string; bg: string }> = {
  1: { icon: <Angry size={16} />, label: 'Muito baixo', color: 'var(--wlh-red-500)',    bg: 'var(--wlh-red-50)'    },
  2: { icon: <Frown size={16} />, label: 'Baixo',       color: 'var(--wlh-amber-500)',  bg: 'var(--wlh-amber-50)'  },
  3: { icon: <Meh   size={16} />, label: 'Neutro',      color: 'var(--wlh-slate-400)',  bg: 'var(--wlh-slate-100)' },
  4: { icon: <Smile size={16} />, label: 'Bom',         color: 'var(--wlh-green-400)',  bg: 'var(--wlh-green-50)'  },
  5: { icon: <Laugh size={16} />, label: 'Ótimo',       color: 'var(--wlh-green-600)',  bg: 'var(--wlh-green-100)' },
}

/* ── Helpers ────────────────────────────────────────────────────── */
function getLast(n: number): string[] {
  const dates: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

function formatDateLabel(iso: string, short = false): string {
  const d = new Date(iso + 'T00:00:00')
  if (short) return d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase().slice(0, 3)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

/* ── MoodHistory ────────────────────────────────────────────────── */
export function MoodHistory({
  entries,
  view          = 'week',
  onLogMood,
  onEntryClick,
  showAverage   = true,
  showLogToday  = true,
  className,
}: MoodHistoryProps) {
  const days    = view === 'week' ? 7 : 30
  const dates   = useMemo(() => getLast(days), [days])
  const today   = new Date().toISOString().slice(0, 10)

  /* Map entries by date */
  const entryMap = useMemo(() => {
    const m = new Map<string, MoodEntry>()
    entries.forEach(e => m.set(e.date, e))
    return m
  }, [entries])

  /* Average mood */
  const average = useMemo(() => {
    const valid = entries.filter(e => dates.includes(e.date))
    if (!valid.length) return null
    return valid.reduce((sum, e) => sum + e.level, 0) / valid.length
  }, [entries, dates])

  const todayEntry = entryMap.get(today)

  /* Chart max height for bars */
  const BAR_MAX = 80  // px

  /* Trend: compare last half vs first half */
  const trend = useMemo(() => {
    const half = Math.floor(days / 2)
    const first = dates.slice(0, half).map(d => entryMap.get(d)?.level).filter(Boolean) as number[]
    const second = dates.slice(half).map(d => entryMap.get(d)?.level).filter(Boolean) as number[]
    if (!first.length || !second.length) return null
    const avgFirst  = first.reduce((a, b) => a + b, 0) / first.length
    const avgSecond = second.reduce((a, b) => a + b, 0) / second.length
    const diff = avgSecond - avgFirst
    return { diff: Math.round(diff * 10) / 10, up: diff >= 0 }
  }, [entries, dates, days])

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Humor</h3>
          {showAverage && average !== null && (
            <span className={styles.average}>
              Média: {average.toFixed(1)}
              {' '}{MOOD_CONFIG[Math.round(average) as MoodLevel]?.icon}
            </span>
          )}
        </div>
        {trend !== null && (
          <span className={[styles.trend, trend.up ? styles['trend--up'] : styles['trend--down']].join(' ')}>
            {trend.up ? '↑' : '↓'} {Math.abs(trend.diff)}
          </span>
        )}
      </div>

      {/* Bar chart */}
      <div className={styles.chart}>
        {dates.map(iso => {
          const entry    = entryMap.get(iso)
          const isToday  = iso === today
          const level    = entry?.level
          const cfg      = level ? MOOD_CONFIG[level] : null
          const barH     = level ? (level / 5) * BAR_MAX : 0

          return (
            <div key={iso} className={styles.barCol}>
              {/* Bar */}
              <div
                className={styles.barWrap}
                style={{ height: BAR_MAX }}
              >
                {level ? (
                  <button
                    type="button"
                    className={[styles.bar, isToday ? styles['bar--today'] : ''].join(' ')}
                    style={{
                      height:     barH,
                      background: cfg!.color,
                    }}
                    onClick={() => onEntryClick?.(entry!)}
                    title={`${iso}: ${cfg!.label}`}
                    aria-label={`${formatDateLabel(iso)} — ${cfg!.label}`}
                    disabled={!onEntryClick}
                  >
                    <span className={styles.barEmoji}>{cfg!.icon}</span>
                  </button>
                ) : (
                  <div
                    className={[styles.barEmpty, isToday ? styles['barEmpty--today'] : ''].join(' ')}
                    style={{ height: BAR_MAX }}
                  />
                )}
              </div>

              {/* Day label */}
              <span className={[styles.dayLabel, isToday ? styles['dayLabel--today'] : ''].join(' ')}>
                {view === 'week'
                  ? formatDateLabel(iso, true)
                  : iso.slice(8)  /* day number for month view */
                }
              </span>
            </div>
          )
        })}
      </div>

      {/* Log today */}
      {showLogToday && onLogMood && !todayEntry && (
        <div className={styles.logSection}>
          <span className={styles.logLabel}>Como você está hoje?</span>
          <div className={styles.moodPicker}>
            {([1, 2, 3, 4, 5] as MoodLevel[]).map(l => (
              <button
                key={l}
                type="button"
                className={styles.moodBtn}
                onClick={() => onLogMood(l)}
                title={MOOD_CONFIG[l].label}
                aria-label={MOOD_CONFIG[l].label}
              >
                <span className={styles.moodEmoji}>{MOOD_CONFIG[l].icon}</span>
                <span className={styles.moodBtnLabel}>{MOOD_CONFIG[l].label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Today already logged */}
      {showLogToday && todayEntry && (
        <div className={styles.todayCard} style={{ background: MOOD_CONFIG[todayEntry.level].bg }}>
          <span className={styles.todayEmoji}>{MOOD_CONFIG[todayEntry.level].icon}</span>
          <div className={styles.todayText}>
            <span className={styles.todayLabel}>Hoje — {MOOD_CONFIG[todayEntry.level].label}</span>
            {todayEntry.note && <span className={styles.todayNote}>{todayEntry.note}</span>}
          </div>
        </div>
      )}
    </div>
  )
}
