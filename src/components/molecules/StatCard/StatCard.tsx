import { type ReactNode } from 'react'
import styles from './StatCard.module.css'

/* ── Types ─────────────────────────────────────────────────────── */
export type TrendDirection = 'up' | 'down' | 'neutral'
export type StatVariant    = 'default' | 'brand' | 'amber' | 'success' | 'warning' | 'error'

export interface StatCardProps {
  label:        string
  value:        string | number
  unit?:        string
  trend?:       number          // ex: 12.5 (positivo = bom, negativo = ruim)
  trendLabel?:  string          // ex: "vs mês anterior"
  trendInverse?: boolean        // quando queda é positiva (ex: taxa de erro)
  icon?:        ReactNode
  variant?:     StatVariant
  isLoading?:   boolean
  className?:   string
}

function TrendArrow({ direction }: { direction: TrendDirection }) {
  if (direction === 'up') return (
    <svg viewBox="0 0 12 12" fill="currentColor" width="10" height="10" aria-hidden="true">
      <path d="M6 2L10 8H2L6 2Z" />
    </svg>
  )
  if (direction === 'down') return (
    <svg viewBox="0 0 12 12" fill="currentColor" width="10" height="10" aria-hidden="true">
      <path d="M6 10L2 4H10L6 10Z" />
    </svg>
  )
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" width="10" height="10" aria-hidden="true">
      <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function StatCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  trendInverse = false,
  icon,
  variant      = 'default',
  isLoading    = false,
  className,
}: StatCardProps) {
  const direction: TrendDirection =
    trend === undefined || trend === 0
      ? 'neutral'
      : trend > 0 ? 'up' : 'down'

  const isPositive =
    direction === 'neutral' ? undefined :
    trendInverse ? direction === 'down' : direction === 'up'

  return (
    <div
      className={[
        styles.card,
        styles[`card--${variant}`],
        isLoading ? styles['card--loading'] : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-busy={isLoading}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && (
          <span className={[styles.icon, styles[`icon--${variant}`]].join(' ')} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      {isLoading ? (
        <div className={styles.skeleton} />
      ) : (
        <div className={styles.valueRow}>
          <span className={styles.value}>{value}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
      )}

      {/* Trend */}
      {trend !== undefined && !isLoading && (
        <div className={[
          styles.trend,
          isPositive === true  ? styles['trend--positive'] : '',
          isPositive === false ? styles['trend--negative'] : '',
          isPositive === undefined ? styles['trend--neutral'] : '',
        ].filter(Boolean).join(' ')}>
          <TrendArrow direction={direction} />
          <span className={styles.trendValue}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          {trendLabel && (
            <span className={styles.trendLabel}>{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
