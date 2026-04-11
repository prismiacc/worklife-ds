import { useEffect, useRef } from 'react'
import styles from './WellbeingScore.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type WellbeingSize = 'sm' | 'md' | 'lg' | 'xl'

export interface WellbeingScoreProps {
  score:        number        // 0–100
  label?:       string
  trend?:       number        // pontos vs período anterior
  trendLabel?:  string
  showRing?:    boolean
  size?:        WellbeingSize
  animate?:     boolean
  className?:   string
}

/* ── Color by score ─────────────────────────────────────────────── */
function scoreColor(score: number) {
  if (score >= 80) return { stroke: 'var(--wlh-green-500)',  text: 'var(--wlh-green-700)',  bg: 'var(--wlh-green-50)',  label: 'Excelente' }
  if (score >= 60) return { stroke: 'var(--wlh-green-400)',  text: 'var(--wlh-green-600)',  bg: 'var(--wlh-green-50)',  label: 'Bom' }
  if (score >= 40) return { stroke: 'var(--wlh-amber-400)',  text: 'var(--wlh-amber-700)',  bg: 'var(--wlh-amber-50)',  label: 'Regular' }
  if (score >= 20) return { stroke: 'var(--wlh-red-400)',    text: 'var(--wlh-red-600)',    bg: 'var(--wlh-red-50)',    label: 'Baixo' }
  return               { stroke: 'var(--wlh-red-500)',    text: 'var(--wlh-red-700)',    bg: 'var(--wlh-red-50)',    label: 'Crítico' }
}

/* ── Sizes ──────────────────────────────────────────────────────── */
const SIZES: Record<WellbeingSize, { d: number; sw: number; valueFontSize: string; labelFontSize: string }> = {
  sm: { d: 72,  sw: 5,  valueFontSize: '1.25rem', labelFontSize: '0.625rem' },
  md: { d: 104, sw: 7,  valueFontSize: '1.75rem', labelFontSize: '0.6875rem' },
  lg: { d: 140, sw: 9,  valueFontSize: '2.25rem', labelFontSize: '0.75rem' },
  xl: { d: 180, sw: 10, valueFontSize: '3rem',    labelFontSize: '0.875rem' },
}

/* ── WellbeingScore ─────────────────────────────────────────────── */
export function WellbeingScore({
  score,
  label     = 'Bem-estar',
  trend,
  trendLabel = 'vs semana anterior',
  showRing  = true,
  size      = 'md',
  animate   = true,
  className,
}: WellbeingScoreProps) {
  const clampedScore = Math.min(100, Math.max(0, score))
  const color        = scoreColor(clampedScore)
  const cfg          = SIZES[size]
  const r            = (cfg.d - cfg.sw) / 2
  const circ         = 2 * Math.PI * r
  // Only show 270° arc (¾ circle, starting from bottom-left)
  const arcLen       = (circ * 3) / 4
  const fillLen      = (clampedScore / 100) * arcLen
  const offset       = arcLen - fillLen

  const fillRef = useRef<SVGCircleElement>(null)

  /* Animate on mount */
  useEffect(() => {
    if (!animate || !fillRef.current) return
    fillRef.current.style.strokeDashoffset = String(arcLen)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (fillRef.current) {
          fillRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          fillRef.current.style.strokeDashoffset = String(offset)
        }
      })
    })
  }, [animate, arcLen, offset])

  const trendPositive = trend !== undefined ? trend >= 0 : undefined

  return (
    <div className={[styles.root, styles[`root--${size}`], className].filter(Boolean).join(' ')}>
      <div className={styles.gauge} style={{ width: cfg.d, height: cfg.d }}>
        <svg
          width={cfg.d}
          height={cfg.d}
          viewBox={`0 0 ${cfg.d} ${cfg.d}`}
          aria-hidden="true"
          style={{ transform: 'rotate(135deg)' }}
        >
          {/* Track */}
          <circle
            cx={cfg.d / 2}
            cy={cfg.d / 2}
            r={r}
            fill="none"
            stroke="var(--wlh-slate-200)"
            strokeWidth={cfg.sw}
            strokeDasharray={`${arcLen} ${circ}`}
            strokeLinecap="round"
          />
          {/* Fill */}
          <circle
            ref={fillRef}
            cx={cfg.d / 2}
            cy={cfg.d / 2}
            r={r}
            fill="none"
            stroke={color.stroke}
            strokeWidth={cfg.sw}
            strokeDasharray={`${arcLen} ${circ}`}
            strokeDashoffset={animate ? arcLen : offset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className={styles.center}>
          <span
            className={styles.value}
            style={{ fontSize: cfg.valueFontSize, color: color.text }}
          >
            {clampedScore}
          </span>
          <span
            className={styles.statusLabel}
            style={{ fontSize: cfg.labelFontSize, color: color.text }}
          >
            {color.label}
          </span>
        </div>
      </div>

      {/* Label + trend */}
      <div className={styles.footer}>
        <span className={styles.label}>{label}</span>
        {trend !== undefined && (
          <span
            className={[styles.trend, trendPositive ? styles['trend--up'] : styles['trend--down']].join(' ')}
            aria-label={`${trend >= 0 ? '+' : ''}${trend} pontos ${trendLabel}`}
          >
            {trendPositive ? '↑' : '↓'} {Math.abs(trend)} pts
            <span className={styles.trendLabel}>{trendLabel}</span>
          </span>
        )}
      </div>
    </div>
  )
}
