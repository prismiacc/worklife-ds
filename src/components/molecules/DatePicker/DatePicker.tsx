import {
  useState, useRef, useEffect, useCallback, useId,
  type KeyboardEvent,
} from 'react'
import styles from './DatePicker.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type DatePickerMode = 'single' | 'range'

export interface DateRange {
  start: Date | null
  end:   Date | null
}

export interface DatePreset {
  label: string
  getValue: () => DateRange
}

export interface DatePickerProps {
  mode?:          DatePickerMode
  value?:         Date | null
  rangeValue?:    DateRange
  onChange?:      (date: Date | null) => void
  onRangeChange?: (range: DateRange) => void
  placeholder?:   string
  minDate?:       Date
  maxDate?:       Date
  disabled?:      boolean
  showPresets?:   boolean
  presets?:       DatePreset[]
  label?:         string
  error?:         string
  hint?:          string
  fullWidth?:     boolean
  className?:     string
}

/* ── Default presets ────────────────────────────────────────────── */
export const DEFAULT_PRESETS: DatePreset[] = [
  { label: 'Hoje',           getValue: () => ({ start: startOfDay(new Date()), end: startOfDay(new Date()) }) },
  { label: 'Ontem',          getValue: () => { const d = addDays(new Date(), -1); return { start: startOfDay(d), end: startOfDay(d) } } },
  { label: 'Últimos 7 dias', getValue: () => ({ start: startOfDay(addDays(new Date(), -6)), end: startOfDay(new Date()) }) },
  { label: 'Últimos 30 dias',getValue: () => ({ start: startOfDay(addDays(new Date(), -29)), end: startOfDay(new Date()) }) },
  { label: 'Este mês',       getValue: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) },
  { label: 'Mês passado',    getValue: () => {
    const d = new Date(); d.setMonth(d.getMonth() - 1)
    return { start: startOfMonth(d), end: endOfMonth(d) }
  }},
]

/* ── Date helpers ───────────────────────────────────────────────── */
function startOfDay(d: Date)   { const n = new Date(d); n.setHours(0,0,0,0); return n }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d: Date)   { return new Date(d.getFullYear(), d.getMonth() + 1, 0) }
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function isInRange(d: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false
  const t = d.getTime()
  return t >= start.getTime() && t <= end.getTime()
}
function isBefore(a: Date, b: Date) { return a.getTime() < b.getTime() }
function isAfter(a: Date, b: Date)  { return a.getTime() > b.getTime() }

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                   'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAYS_PT   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

/* ── Format date ────────────────────────────────────────────────── */
function formatDate(d: Date | null): string {
  if (!d) return ''
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatRange(r: DateRange): string {
  if (!r.start && !r.end) return ''
  if (r.start && !r.end) return formatDate(r.start)
  return `${formatDate(r.start)} – ${formatDate(r.end)}`
}

/* ── Build calendar grid ────────────────────────────────────────── */
function buildGrid(year: number, month: number): (Date | null)[][] {
  const first     = new Date(year, month, 1)
  const startDow  = first.getDay()          // 0=Sun
  const daysCount = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysCount }, (_, i) => new Date(year, month, i + 1)),
  ]
  // Pad to complete weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

/* ── Calendar ───────────────────────────────────────────────────── */
interface CalendarProps {
  viewYear:   number
  viewMonth:  number
  onNav:      (year: number, month: number) => void
  mode:       DatePickerMode
  selected:   Date | null
  range:      DateRange
  hover:      Date | null
  onHover:    (d: Date | null) => void
  onSelect:   (d: Date) => void
  minDate?:   Date
  maxDate?:   Date
}

function Calendar({
  viewYear, viewMonth, onNav,
  mode, selected, range, hover, onHover, onSelect,
  minDate, maxDate,
}: CalendarProps) {
  const grid      = buildGrid(viewYear, viewMonth)
  const today     = startOfDay(new Date())
  const focusRef  = useRef<HTMLButtonElement>(null)

  const prevMonth = () => {
    if (viewMonth === 0) onNav(viewYear - 1, 11)
    else onNav(viewYear, viewMonth - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) onNav(viewYear + 1, 0)
    else onNav(viewYear, viewMonth + 1)
  }

  const isDisabled = (d: Date) => {
    if (minDate && isBefore(d, startOfDay(minDate))) return true
    if (maxDate && isAfter(d, startOfDay(maxDate)))  return true
    return false
  }

  const isRangeStart  = (d: Date) => mode === 'range' && range.start !== null && isSameDay(d, range.start)
  const isRangeEnd    = (d: Date) => mode === 'range' && range.end   !== null && isSameDay(d, range.end)
  const isInHoverRange = (d: Date) => {
    if (mode !== 'range' || !range.start || range.end || !hover) return false
    const [lo, hi] = isBefore(hover, range.start)
      ? [hover, range.start]
      : [range.start, hover]
    return isInRange(d, lo, hi)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const focused = document.activeElement as HTMLButtonElement
    const all     = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button[data-date]'))
    const idx     = all.indexOf(focused)
    const deltas: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }
    const delta   = deltas[e.key]
    if (delta === undefined) return
    e.preventDefault()
    const next = all[idx + delta]
    if (next) next.focus()
  }

  return (
    <div className={styles.calendar}>
      {/* Month nav */}
      <div className={styles.nav}>
        <button type="button" className={styles.navBtn} onClick={prevMonth} aria-label="Mês anterior">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="10,4 6,8 10,12" />
          </svg>
        </button>
        <span className={styles.navTitle}>
          {MONTHS_PT[viewMonth]} {viewYear}
        </span>
        <button type="button" className={styles.navBtn} onClick={nextMonth} aria-label="Próximo mês">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6,4 10,8 6,12" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className={styles.dayHeaders} role="row">
        {DAYS_PT.map(d => (
          <div key={d} className={styles.dayHeader} role="columnheader" aria-label={d}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid} role="grid" aria-label={`${MONTHS_PT[viewMonth]} ${viewYear}`} onKeyDown={handleKeyDown}>
        {grid.map((week, wi) => (
          <div key={wi} className={styles.week} role="row">
            {week.map((day, di) => {
              if (!day) return <div key={di} className={styles.empty} role="gridcell" aria-hidden="true" />

              const isToday    = isSameDay(day, today)
              const isSel      = mode === 'single' && selected !== null && isSameDay(day, selected)
              const isStart    = isRangeStart(day)
              const isEnd      = isRangeEnd(day)
              const inRange    = mode === 'range' && isInRange(day, range.start, range.end)
              const inHover    = isInHoverRange(day)
              const disabled   = isDisabled(day)

              return (
                <div key={di} role="gridcell">
                  <button
                    ref={isSel || isStart ? focusRef : undefined}
                    type="button"
                    data-date={day.toISOString()}
                    className={[
                      styles.day,
                      isToday               ? styles['day--today']     : '',
                      isSel || isStart || isEnd ? styles['day--selected'] : '',
                      isStart               ? styles['day--rangeStart'] : '',
                      isEnd                 ? styles['day--rangeEnd']   : '',
                      (inRange && !isStart && !isEnd) ? styles['day--inRange']   : '',
                      inHover               ? styles['day--hovered']   : '',
                      disabled              ? styles['day--disabled']  : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => !disabled && onSelect(day)}
                    onMouseEnter={() => !disabled && onHover(day)}
                    onMouseLeave={() => onHover(null)}
                    disabled={disabled}
                    aria-label={day.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    aria-pressed={isSel || isStart || isEnd}
                    aria-current={isToday ? 'date' : undefined}
                    tabIndex={isSel || isStart ? 0 : -1}
                  >
                    {day.getDate()}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── DatePicker ─────────────────────────────────────────────────── */
export function DatePicker({
  mode            = 'single',
  value           = null,
  rangeValue      = { start: null, end: null },
  onChange,
  onRangeChange,
  placeholder,
  minDate,
  maxDate,
  disabled        = false,
  showPresets     = false,
  presets         = DEFAULT_PRESETS,
  label,
  error,
  hint,
  fullWidth       = false,
  className,
}: DatePickerProps) {
  const id = useId()

  const [open, setOpen]         = useState(false)
  const [hover, setHover]       = useState<Date | null>(null)
  const [viewDate, setViewDate] = useState(() => {
    const base = mode === 'single' ? value : rangeValue.start
    return base ?? new Date()
  })

  const wrapperRef = useRef<HTMLDivElement>(null)

  /* Close on outside click */
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  /* Select handler */
  const handleSelect = useCallback((day: Date) => {
    if (mode === 'single') {
      onChange?.(day)
      setOpen(false)
      return
    }
    // Range mode
    const { start, end } = rangeValue
    if (!start || (start && end)) {
      // Start fresh selection
      onRangeChange?.({ start: day, end: null })
    } else {
      // Complete the range
      const [lo, hi] = isBefore(day, start) ? [day, start] : [start, day]
      onRangeChange?.({ start: lo, end: hi })
      setOpen(false)
    }
  }, [mode, onChange, onRangeChange, rangeValue])

  /* Preset handler */
  const handlePreset = (preset: DatePreset) => {
    const range = preset.getValue()
    if (mode === 'single') {
      onChange?.(range.start)
      if (range.start) setViewDate(range.start)
    } else {
      onRangeChange?.(range)
      if (range.start) setViewDate(range.start)
    }
    setOpen(false)
  }

  /* Derived display value */
  const displayValue = mode === 'single'
    ? formatDate(value)
    : formatRange(rangeValue)

  const placeholderText = placeholder
    ?? (mode === 'single' ? 'Selecionar data' : 'Selecionar período')

  return (
    <div
      ref={wrapperRef}
      className={[
        styles.root,
        fullWidth ? styles['root--full'] : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Label */}
      {label && (
        <label htmlFor={id} className={styles.label}>{label}</label>
      )}

      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={displayValue || placeholderText}
        className={[
          styles.trigger,
          open      ? styles['trigger--open']     : '',
          error     ? styles['trigger--error']    : '',
          disabled  ? styles['trigger--disabled'] : '',
        ].filter(Boolean).join(' ')}
      >
        <svg className={styles.calIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
          <rect x="2" y="3" width="12" height="11" rx="1" />
          <line x1="2" y1="7" x2="14" y2="7" />
          <line x1="5" y1="2" x2="5" y2="4" />
          <line x1="11" y1="2" x2="11" y2="4" />
        </svg>
        <span className={[styles.triggerText, !displayValue ? styles['triggerText--placeholder'] : ''].filter(Boolean).join(' ')}>
          {displayValue || placeholderText}
        </span>
        {displayValue && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={e => {
              e.stopPropagation()
              if (mode === 'single') onChange?.(null)
              else onRangeChange?.({ start: null, end: null })
            }}
            aria-label="Limpar data"
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" width="10" height="10" aria-hidden="true">
              <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
            </svg>
          </button>
        )}
      </button>

      {/* Hint / Error */}
      {(hint || error) && (
        <span className={error ? styles.error : styles.hint} role={error ? 'alert' : undefined}>
          {error ?? hint}
        </span>
      )}

      {/* Popover */}
      {open && (
        <div
          className={[styles.popover, showPresets ? styles['popover--withPresets'] : ''].filter(Boolean).join(' ')}
          role="dialog"
          aria-label="Seletor de data"
          aria-modal="false"
        >
          {/* Presets */}
          {showPresets && (
            <div className={styles.presets}>
              <div className={styles.presetsLabel}>Períodos rápidos</div>
              {presets.map(p => (
                <button
                  key={p.label}
                  type="button"
                  className={styles.preset}
                  onClick={() => handlePreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Calendar */}
          <Calendar
            viewYear={viewDate.getFullYear()}
            viewMonth={viewDate.getMonth()}
            onNav={(y, m) => setViewDate(new Date(y, m, 1))}
            mode={mode}
            selected={value}
            range={rangeValue}
            hover={hover}
            onHover={setHover}
            onSelect={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  )
}
