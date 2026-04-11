import { useState, useEffect, useRef, useCallback, CSSProperties } from 'react'
import styles from './FocusTimer.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type TimerPhase = 'focus' | 'short-break' | 'long-break'

export interface FocusTimerPreset {
  label:       string
  focus:       number   // minutes
  shortBreak:  number
  longBreak:   number
  rounds:      number   // focus rounds before long break
}

export interface FocusTimerProps {
  preset?:       FocusTimerPreset
  onPhaseEnd?:   (phase: TimerPhase, round: number) => void
  onSessionEnd?: (totalFocusMinutes: number) => void
  className?:    string
}

/* ── Default preset ─────────────────────────────────────────────── */
export const DEFAULT_PRESET: FocusTimerPreset = {
  label:      'Pomodoro',
  focus:      25,
  shortBreak: 5,
  longBreak:  15,
  rounds:     4,
}

/* ── Phase labels ───────────────────────────────────────────────── */
const PHASE_LABEL: Record<TimerPhase, string> = {
  'focus':       'Foco',
  'short-break': 'Pausa curta',
  'long-break':  'Pausa longa',
}

/* ── Format seconds → MM:SS ─────────────────────────────────────── */
function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/* ── FocusTimer ─────────────────────────────────────────────────── */
export function FocusTimer({
  preset        = DEFAULT_PRESET,
  onPhaseEnd,
  onSessionEnd,
  className,
}: FocusTimerProps) {
  const [phase,    setPhase]    = useState<TimerPhase>('focus')
  const [round,    setRound]    = useState(1)
  const [running,  setRunning]  = useState(false)
  const [elapsed,  setElapsed]  = useState(0)   // seconds elapsed in current phase

  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const totalFocusRef = useRef(0)  // total focus seconds this session

  /* Total seconds for current phase */
  function phaseTotal(p: TimerPhase): number {
    if (p === 'focus')       return preset.focus      * 60
    if (p === 'short-break') return preset.shortBreak * 60
    return                           preset.longBreak  * 60
  }

  const total     = phaseTotal(phase)
  const remaining = Math.max(0, total - elapsed)
  const pct       = total > 0 ? (elapsed / total) * 100 : 0

  /* SVG ring */
  const SIZE  = 200
  const SW    = 10
  const R     = (SIZE - SW) / 2
  const CIRC  = 2 * Math.PI * R
  const offset = CIRC - (pct / 100) * CIRC

  /* Advance phase */
  const advancePhase = useCallback(() => {
    setRunning(false)
    setElapsed(0)
    setPhase(prev => {
      onPhaseEnd?.(prev, round)
      if (prev === 'focus') {
        totalFocusRef.current += preset.focus * 60
        // advance round counter
        const nextRound = round + 1
        if (nextRound > preset.rounds) {
          setRound(1)
          return 'long-break'
        }
        setRound(nextRound)
        return 'short-break'
      }
      // after break → back to focus
      return 'focus'
    })
  }, [onPhaseEnd, round, preset.focus, preset.rounds])

  /* Tick */
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1
        if (next >= total) {
          advancePhase()
          return 0
        }
        return next
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, total, advancePhase])

  /* Cleanup on unmount */
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  function handleStartPause() { setRunning(r => !r) }

  function handleReset() {
    setRunning(false)
    setElapsed(0)
  }

  function handleSkip() { advancePhase() }

  function handleStop() {
    setRunning(false)
    setElapsed(0)
    setPhase('focus')
    setRound(1)
    onSessionEnd?.(Math.floor(totalFocusRef.current / 60))
    totalFocusRef.current = 0
  }

  /* Round dots */
  const dots = Array.from({ length: preset.rounds }, (_, i) => i + 1)

  /* Phase ring color */
  const ringColor = phase === 'focus'
    ? 'var(--wlh-navy-600)'
    : phase === 'short-break'
    ? 'var(--wlh-green-500)'
    : 'var(--wlh-amber-400)'

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* Phase tabs */}
      <div className={styles.phaseTabs} role="tablist">
        {(['focus', 'short-break', 'long-break'] as TimerPhase[]).map(p => (
          <button
            key={p}
            role="tab"
            aria-selected={phase === p}
            className={[styles.phaseTab, phase === p ? styles['phaseTab--active'] : ''].join(' ')}
            onClick={() => { setRunning(false); setElapsed(0); setPhase(p) }}
            type="button"
          >
            {PHASE_LABEL[p]}
          </button>
        ))}
      </div>

      {/* Ring + time */}
      <div className={styles.ringWrap}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          className={running ? styles['ring--running'] : ''}
        >
          {/* Track */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke="var(--wlh-slate-100)"
            strokeWidth={SW}
          />
          {/* Progress */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke={ringColor}
            strokeWidth={SW}
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              transition: running ? 'stroke-dashoffset 1s linear' : 'none',
            }}
          />
        </svg>

        {/* Center */}
        <div className={styles.ringCenter}>
          <span
            className={styles.timeDisplay}
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${formatTime(remaining)} restantes`}
          >
            {formatTime(remaining)}
          </span>
          <span className={styles.phaseLabel} style={{ color: ringColor }}>
            {PHASE_LABEL[phase]}
          </span>
        </div>
      </div>

      {/* Round dots */}
      <div className={styles.rounds} aria-label={`Rodada ${round} de ${preset.rounds}`}>
        {dots.map(d => (
          <span
            key={d}
            className={[styles.dot, d < round ? styles['dot--done'] : d === round ? styles['dot--active'] : ''].join(' ')}
            style={d <= round ? { background: ringColor } : undefined}
          />
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.ctrlBtn}
          onClick={handleReset}
          title="Reiniciar fase"
          type="button"
          aria-label="Reiniciar fase"
        >
          {/* Reset icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>

        <button
          className={[styles.ctrlBtn, styles['ctrlBtn--primary']].join(' ')}
          onClick={handleStartPause}
          type="button"
          aria-label={running ? 'Pausar' : 'Iniciar'}
          style={{ '--ring-color': ringColor } as CSSProperties}
        >
          {running ? (
            /* Pause */
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            /* Play */
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

        <button
          className={styles.ctrlBtn}
          onClick={handleSkip}
          title="Pular fase"
          type="button"
          aria-label="Pular fase"
        >
          {/* Skip icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="5,4 15,12 5,20"/>
            <line x1="19" y1="5" x2="19" y2="19"/>
          </svg>
        </button>
      </div>

      {/* Stop session */}
      {(running || elapsed > 0) && (
        <button
          className={styles.stopBtn}
          onClick={handleStop}
          type="button"
        >
          Encerrar sessão
        </button>
      )}
    </div>
  )
}
