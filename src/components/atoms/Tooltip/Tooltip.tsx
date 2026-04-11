import { type ReactNode, useCallback, useId, useRef, useState } from 'react'
import styles from './Tooltip.module.css'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  children: ReactNode
  content: ReactNode
  placement?: TooltipPlacement
  delay?: number
  disabled?: boolean
  className?: string
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  delay = 400,
  disabled = false,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = useId()

  const show = useCallback(() => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }, [delay, disabled])

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setVisible(false)
  }, [])

  return (
    <span
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={!disabled && visible ? tooltipId : undefined}>
        {children}
      </span>

      {!disabled && (
        <span
          id={tooltipId}
          role="tooltip"
          className={[
            styles.bubble,
            styles[`bubble--${placement}`],
          ].join(' ')}
          data-visible={visible || undefined}
        >
          {content}
        </span>
      )}
    </span>
  )
}
