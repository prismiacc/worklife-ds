import styles from './ProgressBar.module.css'

export type ProgressVariant = 'brand' | 'amber' | 'success' | 'warning' | 'error' | 'info'
export type ProgressSize    = 'xs' | 'sm' | 'md' | 'lg'
export type ProgressType    = 'linear' | 'segmented' | 'circular'

export interface ProgressBarProps {
  value:          number
  max?:           number
  label:          string
  showLabel?:     boolean
  showValue?:     boolean
  variant?:       ProgressVariant
  size?:          ProgressSize
  type?:          ProgressType
  /** Para type="segmented": número de segmentos */
  segments?:      number
  /** Para type="circular": diâmetro em px */
  circularSize?:  number
  strokeWidth?:   number
  indeterminate?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel    = false,
  showValue    = false,
  variant      = 'brand',
  size         = 'sm',
  type         = 'linear',
  segments,
  circularSize = 48,
  strokeWidth  = 4,
  indeterminate = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  /* ── Circular ─────────────────────────────────────────────────── */
  if (type === 'circular') {
    const r = (circularSize - strokeWidth) / 2
    const circ = 2 * Math.PI * r
    const offset = circ - (pct / 100) * circ
    return (
      <div
        className={styles.circular}
        style={{ width: circularSize, height: circularSize }}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <svg
          className={styles.circular__svg}
          width={circularSize}
          height={circularSize}
          viewBox={`0 0 ${circularSize} ${circularSize}`}
          aria-hidden="true"
        >
          <circle
            className={styles.circular__track}
            cx={circularSize / 2}
            cy={circularSize / 2}
            r={r}
            strokeWidth={strokeWidth}
          />
          <circle
            className={[
              styles.circular__fill,
              variant !== 'brand' ? styles[`circular__fill--${variant}`] : '',
            ].filter(Boolean).join(' ')}
            cx={circularSize / 2}
            cy={circularSize / 2}
            r={r}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        {showValue && (
          <span className={styles.circular__label} aria-hidden="true">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    )
  }

  /* ── Segmented ────────────────────────────────────────────────── */
  if (type === 'segmented' && segments) {
    return (
      <div
        className={styles.segmented}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={segments}
        aria-label={label}
      >
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={[
              styles.segment,
              i < value ? styles['segment--filled'] : '',
            ].filter(Boolean).join(' ')}
          />
        ))}
      </div>
    )
  }

  /* ── Linear ───────────────────────────────────────────────────── */
  return (
    <div className={styles.wrapper}>
      {(showLabel || showValue) && (
        <div className={styles.header}>
          {showLabel && <span className={styles.label}>{label}</span>}
          {showValue && !indeterminate && (
            <span className={styles.valueText}>{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={[styles.track, styles[`track--${size}`]].join(' ')}
      >
        <div
          className={[
            styles.fill,
            styles[`fill--${variant}`],
            indeterminate ? styles['fill--indeterminate'] : '',
          ].filter(Boolean).join(' ')}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
