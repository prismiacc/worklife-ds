import type { HTMLAttributes } from 'react'
import styles from './Skeleton.module.css'

export type SkeletonVariant = 'text' | 'rect' | 'circle' | 'card'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant
  width?:   string | number
  height?:  string | number
  /** Número de linhas de texto (variant="text" apenas) */
  lines?:   number
}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  lines   = 1,
  className,
  style,
  ...rest
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <span className={[styles.stack, className].filter(Boolean).join(' ')} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={[styles.skeleton, styles['skeleton--text']].join(' ')}
            style={{
              width: i === lines - 1 ? '70%' : '100%',
              ...style,
            }}
          />
        ))}
      </span>
    )
  }

  return (
    <span
      {...rest}
      className={[
        styles.skeleton,
        styles[`skeleton--${variant}`],
        className,
      ].filter(Boolean).join(' ')}
      style={{
        width:  width  !== undefined ? (typeof width  === 'number' ? `${width}px`  : width)  : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        ...style,
      }}
      aria-hidden="true"
    />
  )
}
